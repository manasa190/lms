import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/data';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ActivityHeatmap from './ActivityHeatmap';
import CourseRecommendations from './CourseRecommendations';
import GamificationStats from './GamificationStats';
import StudyPlanner from './StudyPlanner';

const StudentDashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  const enrollments = db.enrollments.filter(e => e.userId === user.id);
  const courses = db.courses;

  const enrolledCourses = enrollments.map(e => {
    const course = courses.find(c => c.id === e.courseId)!;
    const totalLessons = course?.modules.reduce((sum, m) => sum + m.lessons.length, 0) || 0;
    const progress = totalLessons > 0 ? Math.round((e.completedLessons.length / totalLessons) * 100) : 0;
    return { ...e, course, progress, totalLessons };
  }).filter(e => e.course);

  const completedCourses = enrolledCourses.filter(e => e.completedAt);
  const totalLessonsCompleted = enrollments.reduce((sum, e) => sum + e.completedLessons.length, 0);

  const chartData = enrolledCourses.map(e => ({
    name: e.course.title.substring(0, 15) + '...',
    progress: e.progress,
  }));

  const stats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: enrolledCourses.length, color: 'gradient-primary' },
    { icon: Clock, label: 'Lessons Done', value: totalLessonsCompleted, color: 'gradient-secondary' },
    { icon: Award, label: 'Completed', value: completedCourses.length, color: 'gradient-accent' },
    { icon: TrendingUp, label: 'Avg Progress', value: enrolledCourses.length ? Math.round(enrolledCourses.reduce((s, e) => s + e.progress, 0) / enrolledCourses.length) + '%' : '0%', color: 'gradient-primary' },
  ];

  const quotes = [
    "The beautiful thing about learning is that no one can take it away from you.",
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    "Learning never exhausts the mind.",
    "Success is the sum of small efforts, repeated day-in and day-out."
  ];
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <motion.div variants={item} className="relative overflow-hidden rounded-[2rem] gradient-primary px-8 py-10 text-primary-foreground shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-80 w-80 rounded-full bg-secondary/10 blur-3xl animate-pulse" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Welcome back, {user.name.split(' ')[0]}! ✨</h1>
            <p className="text-primary-foreground/90 text-lg italic font-medium leading-relaxed">"{quote}"</p>
          </div>
          <div className="grid grid-cols-2 gap-4 shrink-0">
             <div className="glass-blur bg-white/10 border border-white/20 p-5 rounded-3xl text-center shadow-xl backdrop-blur-md">
               <p className="text-3xl font-bold font-display">{totalLessonsCompleted}</p>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Lessons</p>
             </div>
             <div className="glass-blur bg-white/10 border border-white/20 p-5 rounded-3xl text-center shadow-xl backdrop-blur-md">
               <p className="text-3xl font-bold font-display">{enrolledCourses.length}</p>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Paths</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Stats & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
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
        </div>

        <motion.div variants={item} className="lg:col-span-1">
          <div className="glass-card h-full rounded-3xl p-6 bg-secondary/5 border-secondary/20 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold font-display mb-1 flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 text-secondary" /> Daily Focus
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Complete 3 lessons today to keep your streak! 🔥</p>
            </div>
            <button className="w-full py-3 rounded-2xl bg-secondary text-secondary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-secondary/20">
              Resume Learning
            </button>
          </div>
        </motion.div>
      </div>

      {/* Gamification + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GamificationStats userId={user.id} />
        <motion.div variants={item} className="glass-card rounded-xl p-6">
          <ActivityHeatmap userId={user.id} />
        </motion.div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <CourseRecommendations userId={user.id} />
      </div>

      {/* Chart + Current courses + Study planner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div variants={item} className="lg:col-span-2 glass-card rounded-xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Course Progress</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-center py-12">No enrolled courses yet</p>}
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Current Courses</h2>
          <div className="space-y-4">
            {enrolledCourses.slice(0, 4).map(e => (
              <div key={e.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-foreground truncate pr-2">{e.course.title}</p>
                  <span className="text-xs font-medium text-primary shrink-0">{e.progress}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${e.progress}%` }} />
                </div>
              </div>
            ))}
            {enrolledCourses.length === 0 && <p className="text-sm text-muted-foreground">No courses yet. Browse the catalog!</p>}
          </div>
        </motion.div>
      </div>

      {/* Study Planner */}
      <StudyPlanner userId={user.id} />
    </motion.div>
  );
};

export default StudentDashboard;
