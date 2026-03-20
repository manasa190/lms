import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Role } from '@/lib/data';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await register(name, email, password, role);
    setLoading(false);
    if (success) navigate('/dashboard');
    else setError('Email already exists');
  };

  const roles: { value: Role; label: string; desc: string }[] = [
    { value: 'student', label: '🎓 Student', desc: 'Enroll & learn' },
    { value: 'instructor', label: '👨‍🏫 Instructor', desc: 'Create courses' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full gradient-accent opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full gradient-primary opacity-20 blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl gradient-accent mb-4">
              <GraduationCap className="w-7 h-7 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground">Create account</h1>
            <p className="text-muted-foreground mt-1">Start your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="pl-10" required />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" required />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {roles.map(r => (
                <button key={r.value} type="button" onClick={() => setRole(r.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${role === r.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                  <span className="text-sm font-medium text-foreground">{r.label}</span>
                  <span className="block text-xs text-muted-foreground">{r.desc}</span>
                </button>
              ))}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
