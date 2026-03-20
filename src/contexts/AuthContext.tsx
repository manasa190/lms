import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, User, Role } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: Role) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lms_current_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Check if user exists first
    let found = db.users.find(u => u.email === email);
    
    // If not found, create a new one on the fly (Allow Everyone)
    if (!found) {
      const newUser: User = {
        id: crypto.randomUUID(),
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email,
        password: password || 'password', // use provided password or default
        role: 'student' as Role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      db.users = [...db.users, newUser];
      found = newUser;
    }

    setUser(found);
    localStorage.setItem('lms_current_user', JSON.stringify(found));
    localStorage.setItem('lms_token', btoa(JSON.stringify({ userId: found.id, role: found.role })));
    return true; // Always let them in
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: Role) => {
    const users = db.users;
    if (users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: crypto.randomUUID(),
      name, email, password, role,
      avatar: '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    db.users = [...users, newUser];
    setUser(newUser);
    localStorage.setItem('lms_current_user', JSON.stringify(newUser));
    localStorage.setItem('lms_token', btoa(JSON.stringify({ userId: newUser.id, role: newUser.role })));
    return true;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    // Use Google OAuth popup
    const clientId = '237070794063-3i6vkugt6n0n4s7ejhv7ace2hiumspjb.apps.googleusercontent.com';
    const redirectUri = window.location.origin;
    const scope = 'email profile';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    window.location.href = url;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('lms_current_user');
    localStorage.removeItem('lms_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
