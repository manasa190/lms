import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/data';
import { motion } from 'framer-motion';
import { BookOpen, Users, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const InstructorDashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  const myCourses = db.courses.filter(c => c.instructorId === user.id);
  const totalStudents = myCourses.reduce((s, c) => s + c.studentsCount, 0);
  const avgRating = myCourses.length ? (myCourses.reduce((s, c) => s + c.rating, 0) / myCourses.length).toFixed(1) : '0';
  const totalLessons = myCourses.reduce((s, c) => s + c.modules.reduce((ms, m) => ms + m.lessons.length, 0), 0);

  const enrollmentData = myCourses.map(c => ({ name: c.title.substring(0, 12) + '...', students: c.studentsCount }));
  const catData = [...new Set(myCourses.map(c => c.category))].map(cat => ({
    name: cat, value: myCourses.filter(c => c.category === cat).length,
  }));
  const COLORS = ['hsl(250,70%,58%)', 'hsl(340,65%,70%)', 'hsl(175,55%,55%)', 'hsl(40,90%,55%)'];

  const stats = [
    { icon: BookOpen, label: 'Courses', value: myCourses.length, color: 'gradient-primary' },
    { icon: Users, label: 'Total Students', value: totalStudents, color: 'gradient-secondary' },
    { icon: Star, label: 'Avg Rating', value: avgRating, color: 'gradient-accent' },
    { icon: BookOpen, label: 'Total Lessons', value: totalLessons, color: 'gradient-primary' },
  ];

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-8">
      {/* Welcome Banner */}
      <motion.div variants={item} className="relative overflow-hidden rounded-[2rem] gradient-secondary px-8 py-10 text-primary-foreground shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Instructor Suite 🎓</h1>
            <p className="text-primary-foreground/90 text-lg font-medium leading-relaxed">
               Empowering students today. Your courses have reached <span className="font-bold underline text-white">{totalStudents} learners</span> globally.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 shrink-0">
             <div className="glass-blur bg-white/10 border border-white/20 p-5 rounded-3xl text-center shadow-xl backdrop-blur-md">
               <p className="text-3xl font-bold font-display">{myCourses.length}</p>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Courses</p>
             </div>
             <div className="glass-blur bg-white/10 border border-white/20 p-5 rounded-3xl text-center shadow-xl backdrop-blur-md">
               <p className="text-3xl font-bold font-display">{avgRating}</p>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Rating</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Enrollments by Course</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Bar dataKey="students" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Courses by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InstructorDashboard;
