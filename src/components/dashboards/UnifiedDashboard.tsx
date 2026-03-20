import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db, User } from '@/lib/data';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  BookOpen, Clock, Award, TrendingUp, Users, 
  BarChart3, ShieldCheck, GraduationCap, Zap 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import ActivityHeatmap from './ActivityHeatmap';
import CourseRecommendations from './CourseRecommendations';
import GamificationStats from './GamificationStats';
import StudyPlanner from './StudyPlanner';

const UnifiedDashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  // 1. Data Processing
  const users = db.users;
  const courses = db.courses;
  const enrollments = db.enrollments;

  // Student specific data
  const myEnrollments = enrollments.filter(e => e.userId === user.id);
  const enrolledCourses = myEnrollments.map(e => {
    const course = courses.find(c => c.id === e.courseId)!;
    const totalLessons = course?.modules.reduce((sum, m) => sum + m.lessons.length, 0) || 0;
    const progress = totalLessons > 0 ? Math.round((e.completedLessons.length / totalLessons) * 100) : 0;
    return { ...e, course, progress, totalLessons };
  }).filter(e => e.course);
  
  const totalLessonsCompleted = myEnrollments.reduce((sum, e) => sum + e.completedLessons.length, 0);

  // Instructor specific data
  const myTaughtCourses = courses.filter(c => c.instructorId === user.id);
  const totalMyStudents = myTaughtCourses.reduce((s, c) => s + c.studentsCount, 0);

  // Admin specific data
  const completionRate = enrollments.length ? Math.round((enrollments.filter(e => e.completedAt).length / enrollments.length) * 100) : 0;

  // 2. Dynamic Stats Configuration
  const getStats = () => {
    if (user.role === 'admin') {
      return [
        { icon: Users, label: 'Total Users', value: users.length, color: 'gradient-primary' },
        { icon: BookOpen, label: 'Platform Courses', value: courses.length, color: 'gradient-secondary' },
        { icon: TrendingUp, label: 'Completion rate', value: completionRate + '%', color: 'gradient-accent' },
        { icon: Zap, label: 'Enrollments', value: enrollments.length, color: 'gradient-primary' },
      ];
    }
    if (user.role === 'instructor') {
      return [
        { icon: GraduationCap, label: 'Courses Taught', value: myTaughtCourses.length, color: 'gradient-primary' },
        { icon: Users, label: 'Total Students', value: totalMyStudents, color: 'gradient-secondary' },
        { icon: Award, label: 'Avg Rating', value: '4.8', color: 'gradient-accent' },
        { icon: Clock, label: 'Total Lessons', value: myTaughtCourses.reduce((s, c) => s + c.modules.length, 0), color: 'gradient-primary' },
      ];
    }
    return [
      { icon: BookOpen, label: 'Enrolled Courses', value: enrolledCourses.length, color: 'gradient-primary' },
      { icon: Clock, label: 'Lessons Done', value: totalLessonsCompleted, color: 'gradient-secondary' },
      { icon: Award, label: 'XP Points', value: user.role === 'student' ? (db.enrollments.find(e => e.userId === user.id)?.completedLessons.length || 0) * 10 : 0, color: 'gradient-accent' },
      { icon: TrendingUp, label: 'Avg Progress', value: enrolledCourses.length ? Math.round(enrolledCourses.reduce((s, e) => s + e.progress, 0) / enrolledCourses.length) + '%' : '0%', color: 'gradient-primary' },
    ];
  };

  const chartData = user.role === 'admin' 
    ? [ { month: 'Jan', val: 12 }, { month: 'Feb', val: 19 }, { month: 'Mar', val: 25 }, { month: 'Apr', val: 32 } ]
    : enrolledCourses.map(e => ({ name: e.course.title.substring(0, 15) + '...', val: e.progress }));

  const quotes = [
    "The beautiful thing about learning is that no one can take it away from you.",
    "Education is the passport to the future.",
    "The more that you learn, the more places you'll go.",
    "Success is the sum of small efforts, repeated day-in and day-out."
  ];
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="space-y-8 pb-10">
      {/* 1. Unified Welcome Banner */}
      <motion.div variants={item} className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl ${
        user.role === 'admin' ? 'gradient-accent' : user.role === 'instructor' ? 'gradient-secondary' : 'gradient-primary'
      }`}>
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-black/5 blur-3xl" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 text-center lg:text-left">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/10">
               {user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : user.role === 'instructor' ? <GraduationCap className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
               {user.role} Dashboard
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight drop-shadow-sm">
              {user.role === 'admin' ? 'Admin Hub' : user.role === 'instructor' ? 'Instructor Suite' : 'Welcome back, ' + user.name.split(' ')[0] + '!'} ✨
            </h1>
            <p className="text-white/80 text-lg md:text-xl italic font-medium leading-relaxed max-w-xl">"{quote}"</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 shrink-0 mx-auto lg:mx-0">
             <div className="glass-blur bg-white/5 border border-white/20 p-6 md:p-8 rounded-[2rem] text-center shadow-2xl backdrop-blur-xl min-w-[140px]">
               <p className="text-4xl font-bold font-display leading-none mb-2">{user.role === 'admin' ? courses.length : user.role === 'instructor' ? myTaughtCourses.length : totalLessonsCompleted}</p>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{user.role === 'student' ? 'Lessons Done' : 'Courses'}</p>
             </div>
             <div className="glass-blur bg-white/5 border border-white/20 p-6 md:p-8 rounded-[2rem] text-center shadow-2xl backdrop-blur-xl min-w-[140px]">
               <p className="text-4xl font-bold font-display leading-none mb-2">{user.role === 'admin' ? users.length : user.role === 'instructor' ? totalMyStudents : enrolledCourses.length}</p>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{user.role === 'student' ? 'Active Paths' : user.role === 'admin' ? 'Total Users' : 'Students'}</p>
             </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Adaptive Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {getStats().map((s, i) => (
              <div key={i} className="glass-card rounded-[1.5rem] p-6 overflow-hidden relative group hover:shadow-2xl transition-all border-white/10 dark:bg-slate-900/40">
                <div className={`absolute top-0 right-0 w-24 h-24 ${s.color} opacity-5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:opacity-10 transition-all duration-700`} />
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <s.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-3xl font-bold font-display text-foreground leading-none mb-1">{s.value}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Daily Focus / Quick Actions */}
        <motion.div variants={item} className="lg:col-span-1">
          <div className="glass-card h-full rounded-[2rem] p-6 bg-secondary/5 border-secondary/10 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute inset-0 bg-secondary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold font-display mb-1 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-secondary" /> {user.role === 'student' ? 'Daily Focus' : 'System Check'}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {user.role === 'student' ? 'Complete 3 lessons today to keep your streak! 🔥' : 'Platform stability is at 100%. No issues today.'}
              </p>
            </div>
            <button className="relative z-10 w-full py-3 rounded-2xl bg-secondary text-secondary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-xl shadow-secondary/20">
              {user.role === 'student' ? 'Resume Learning' : 'Check Updates'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* 3. Central Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GamificationStats userId={user.id} />
        <motion.div variants={item} className="glass-card rounded-[2rem] p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-primary" /> Learning Momentum
             </h2>
             <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">Real-time</span>
          </div>
          <ActivityHeatmap userId={user.id} />
        </motion.div>
      </div>

      {/* 4. Recommendations or Admin Details */}
      {user.role === 'student' && (
        <div className="mb-8 p-4 bg-muted/30 rounded-[2.5rem] border border-border/50">
          <CourseRecommendations userId={user.id} />
        </div>
      )}

      {/* 5. Chart & Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2 glass-card rounded-[2rem] p-8 shadow-xl">
          <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
             <BarChart3 className="w-5 h-5 text-primary" /> {user.role === 'admin' ? 'Monthly Growth' : 'Course Performance'}
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey={user.role === 'admin' ? 'month' : 'name'} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.1)' }}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 16, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey={user.role === 'admin' ? 'val' : 'val'} fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <BookOpen className="w-12 h-12 opacity-10 mb-2" />
                <p className="text-sm font-medium">No activity data yet</p>
              </div>}
        </motion.div>

        <motion.div variants={item} className="glass-card rounded-[2rem] p-8 shadow-xl flex flex-col">
          <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
             <Zap className="w-5 h-5 text-secondary" /> {user.role === 'admin' ? 'Admin Tools' : 'Recent Focus'}
          </h2>
          <div className="space-y-6 flex-1">
            {user.role === 'admin' ? (
              ['User Management', 'Course Moderation', 'System Audit', 'Financial Reports'].map((tool, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-muted/50 border border-border/50 flex justify-between items-center group cursor-pointer hover:bg-muted transition-colors">
                  <span className="text-sm font-bold text-foreground">{tool}</span>
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center group-hover:text-primary transition-colors">→</div>
                </div>
              ))
            ) : (
              enrolledCourses.slice(0, 4).map(e => (
                <div key={e.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-foreground truncate max-w-[150px]">{e.course.title}</p>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{e.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden p-[2px]">
                    <div className="h-full gradient-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" style={{ width: `${e.progress}%` }} />
                  </div>
                </div>
              ))
            )}
            {user.role === 'student' && enrolledCourses.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-10 italic">Ready to start? Discover your first course!</p>
            )}
          </div>
        </motion.div>
      </div>

      {user.role === 'student' && <StudyPlanner userId={user.id} />}
    </motion.div>
  );
};

export default UnifiedDashboard;
