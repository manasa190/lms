import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/data';
import { gamificationDb } from '@/lib/gamification';
import { motion } from 'framer-motion';
import { User, Star, Flame, Medal, BookOpen, Clock, Award, TrendingUp, Calendar, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import ActivityHeatmap from '@/components/dashboards/ActivityHeatmap';
import { useMemo } from 'react';

const Profile = () => {
  const { user } = useAuth();

  const userPt = user ? gamificationDb.userPoints.find(p => p.userId === user.id) : null;
  const xp = userPt?.totalXp || 0;
  const streak = userPt?.streak || 0;
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  const allBadges = gamificationDb.badges;
  const earnedUserBadges = user ? gamificationDb.userBadges.filter(b => b.userId === user.id) : [];
  const earnedBadgeIds = new Set(earnedUserBadges.map(b => b.badgeId));

  const enrollments = user ? db.enrollments.filter(e => e.userId === user.id) : [];
  const completedCourses = enrollments.filter(e => e.completedAt).length;
  const totalLessonsCompleted = enrollments.reduce((s, e) => s + e.completedLessons.length, 0);
  const totalCourses = enrollments.length;

  const xpHistory = useMemo(() => {
    if (!user) return [];
    const logs = gamificationDb.activityLogs.filter(l => l.userId === user.id);
    const today = new Date();
    const days: { date: string; xp: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayXp = logs.filter(l => l.date === dateStr).reduce((s, l) => s + l.xpEarned, 0);
      days.push({ date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }), xp: dayXp });
    }
    return days;
  }, [user]);

  const recentActivity = useMemo(() => {
    if (!user) return [];
    return gamificationDb.activityLogs
      .filter(l => l.userId === user.id)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8);
  }, [user]);

  if (!user) return null;


  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  const stats = [
    { icon: BookOpen, label: 'Enrolled', value: totalCourses, color: 'gradient-primary' },
    { icon: Award, label: 'Completed', value: completedCourses, color: 'gradient-accent' },
    { icon: Clock, label: 'Lessons Done', value: totalLessonsCompleted, color: 'gradient-secondary' },
    { icon: TrendingUp, label: 'Level', value: level, color: 'gradient-primary' },
  ];

  const activityIcons: Record<string, string> = {
    lesson_completed: '📖',
    quiz_passed: '🧠',
    course_completed: '🎓',
    login: '👋',
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      {/* Profile header */}
      <motion.div variants={item} className="glass-card rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-display font-bold shrink-0 ring-4 ring-primary/20">
          {user.name[0]}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl font-display font-bold text-foreground">{user.name}</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-1 capitalize">Member since {user.createdAt} · {user.role}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <Star className="w-4 h-4 text-warning" />
              <span className="text-xl font-display font-bold text-foreground">{xp}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <Flame className="w-4 h-4 text-destructive" />
              <span className="text-xl font-display font-bold text-foreground">{streak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <Medal className="w-4 h-4 text-accent" />
              <span className="text-xl font-display font-bold text-foreground">{earnedUserBadges.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-2xl font-bold font-display text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* XP Level progress */}
      <motion.div variants={item} className="glass-card rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display font-semibold text-foreground text-sm">Level {level}</span>
          <span className="text-xs text-muted-foreground">{xpInLevel}/100 XP to Level {level + 1}</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpInLevel}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full gradient-primary rounded-full"
          />
        </div>
      </motion.div>

      {/* Badges section */}
      <motion.div variants={item} className="glass-card rounded-xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Medal className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-display font-semibold text-foreground">All Badges</h2>
          <span className="text-xs text-muted-foreground ml-auto">{earnedUserBadges.length}/{allBadges.length} earned</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allBadges.map(badge => {
            const earned = earnedBadgeIds.has(badge.id);
            const earnedData = earnedUserBadges.find(ub => ub.badgeId === badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-xl p-4 border transition-all ${
                  earned
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-muted/30 border-border opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="font-display font-semibold text-foreground text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
                {earned && earnedData && (
                  <p className="text-[10px] text-primary mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Earned {earnedData.earnedAt}
                  </p>
                )}
                {!earned && (
                  <p className="text-[10px] text-muted-foreground mt-2">{badge.requirement}</p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* XP History chart */}
        <motion.div variants={item} className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">XP History (14 days)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={xpHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="xp" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item} className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-2.5 max-h-[230px] overflow-y-auto">
            {recentActivity.length > 0 ? recentActivity.map(log => (
              <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
                <span className="text-lg">{activityIcons[log.type] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{log.detail}</p>
                  <p className="text-[10px] text-muted-foreground">{log.date}</p>
                </div>
                <span className="text-xs font-semibold text-primary shrink-0">+{log.xpEarned} XP</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No activity yet</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Heatmap */}
      <motion.div variants={item} className="glass-card rounded-xl p-6">
        <ActivityHeatmap userId={user.id} />
      </motion.div>
    </motion.div>
  );
};

export default Profile;
