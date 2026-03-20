import { db } from '@/lib/data';
import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  const users = db.users;
  const courses = db.courses;
  const enrollments = db.enrollments;

  const totalEnrollments = enrollments.length;
  const completionRate = enrollments.length ? Math.round((enrollments.filter(e => e.completedAt).length / enrollments.length) * 100) : 0;

  const roleData = [
    { name: 'Students', value: users.filter(u => u.role === 'student').length },
    { name: 'Instructors', value: users.filter(u => u.role === 'instructor').length },
    { name: 'Admins', value: users.filter(u => u.role === 'admin').length },
  ];

  // Calculate real monthly data from enrollments
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const monthlyData = months.slice(0, currentMonth + 1).map((month, index) => {
    const enrollmentsInMonth = enrollments.filter(e => {
      const date = new Date(e.enrolledAt);
      return date.getMonth() === index;
    }).length;
    return { month, enrollments: enrollmentsInMonth };
  });

  const stats = [
    { icon: Users, label: 'Total Users', value: users.length, color: 'gradient-primary' },
    { icon: BookOpen, label: 'Courses', value: courses.length, color: 'gradient-secondary' },
    { icon: TrendingUp, label: 'Completion Rate', value: `${completionRate}%`, color: 'gradient-accent' },
    { icon: TrendingUp, label: 'Enrollments', value: totalEnrollments, color: 'gradient-primary' },
  ];

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-8">
      {/* Welcome Banner */}
      <motion.div variants={item} className="relative overflow-hidden rounded-[2rem] gradient-accent px-8 py-10 text-primary-foreground shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Admin Hub 🛡️</h1>
            <p className="text-primary-foreground/90 text-lg font-medium leading-relaxed">
              Monitoring Learnova's growth. There are currently <span className="font-bold underline text-white">{users.length} active users</span> across the platform.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 shrink-0">
             <div className="glass-blur bg-white/10 border border-white/20 p-5 rounded-3xl text-center shadow-xl backdrop-blur-md">
               <p className="text-3xl font-bold font-display">{courses.length}</p>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Catalog</p>
             </div>
             <div className="glass-blur bg-white/10 border border-white/20 p-5 rounded-3xl text-center shadow-xl backdrop-blur-md">
               <p className="text-3xl font-bold font-display">{completionRate}%</p>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Success</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 overflow-hidden relative group hover:shadow-xl transition-all border-white/10 dark:bg-slate-900/50">
            <div className={`absolute top-0 right-0 w-24 h-24 ${s.color} opacity-5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:opacity-10 transition-all duration-700`} />
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              <s.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-3xl font-bold font-display text-foreground leading-none mb-1">{s.value}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div variants={item} className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Monthly Enrollments</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

      </div>

      <motion.div variants={item} className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">Users by Role</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={roleData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} width={80} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
