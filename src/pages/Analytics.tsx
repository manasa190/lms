import { db } from '@/lib/data';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  if (!user) return null;

  const courses = user.role === 'admin' ? db.courses : db.courses.filter(c => c.instructorId === user.id);
  const enrollments = db.enrollments;

  const enrollmentByCourse = courses.map(c => ({
    name: c.title.substring(0, 15),
    enrolled: enrollments.filter(e => e.courseId === c.id).length,
    completed: enrollments.filter(e => e.courseId === c.id && e.completedAt).length,
  }));

  const categoryData = [...new Set(courses.map(c => c.category))].map(cat => ({
    name: cat, value: courses.filter(c => c.category === cat).reduce((s, c) => s + c.studentsCount, 0),
  }));

  const COLORS = ['hsl(250,70%,58%)', 'hsl(340,65%,70%)', 'hsl(175,55%,55%)', 'hsl(40,90%,55%)'];

  const monthlyTrend = [
    { month: 'Jan', users: 5 }, { month: 'Feb', users: 12 }, { month: 'Mar', users: 18 },
    { month: 'Apr', users: 25 }, { month: 'May', users: 22 }, { month: 'Jun', users: 30 },
  ];

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
      <motion.h1 variants={item} className="text-3xl font-display font-bold text-foreground mb-6">Analytics</motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Enrollment vs Completion</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={enrollmentByCourse}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Bar dataKey="enrolled" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="completed" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Students by Category</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2 glass-card rounded-xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Monthly User Growth</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
