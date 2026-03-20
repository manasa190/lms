import { useState } from 'react';
import { db, Role } from '@/lib/data';
import { motion } from 'framer-motion';
import { Users, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ManageUsers = () => {
  const [users, setUsers] = useState(db.users);

  const deleteUser = (id: string) => {
    if (id === '1') return; // Can't delete admin
    const updated = users.filter(u => u.id !== id);
    db.users = updated;
    setUsers(updated);
  };

  const changeRole = (id: string, role: Role) => {
    const updated = users.map(u => u.id === id ? { ...u, role } : u);
    db.users = updated;
    setUsers(updated);
  };

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <motion.h1 variants={item} className="text-3xl font-display font-bold text-foreground mb-6">Manage Users</motion.h1>

      <motion.div variants={item} className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Joined</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {u.name[0]}
                      </div>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-4">
                    <select value={u.role} onChange={e => changeRole(u.id, e.target.value as Role)}
                      className="px-2 py-1 rounded border border-border bg-background text-foreground text-sm">
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{u.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteUser(u.id)}
                      disabled={u.id === '1'} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ManageUsers;
