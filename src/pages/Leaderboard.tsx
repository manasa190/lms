import { motion } from 'framer-motion';
import { Trophy, Medal, Flame, Star } from 'lucide-react';
import { gamificationDb } from '@/lib/gamification';
import { db } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';

const Leaderboard = () => {
  const { user } = useAuth();
  const points = gamificationDb.userPoints;
  const users = db.users.filter(u => u.role === 'student');

  const ranked = users.map(u => {
    const pt = points.find(p => p.userId === u.id);
    return { ...u, xp: pt?.totalXp || 0, streak: pt?.streak || 0 };
  }).sort((a, b) => b.xp - a.xp);

  const medals = ['🥇', '🥈', '🥉'];
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <motion.h1 variants={item} className="text-3xl font-display font-bold text-foreground mb-1">Leaderboard</motion.h1>
      <motion.p variants={item} className="text-muted-foreground mb-8">See who's leading the learning race</motion.p>

      {/* Top 3 Podium */}
      {ranked.length >= 3 && (
        <motion.div variants={item} className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          {[ranked[1], ranked[0], ranked[2]].map((r, idx) => {
            const podiumOrder = [1, 0, 2];
            const rank = podiumOrder[idx];
            const heights = ['h-28', 'h-36', 'h-20'];
            const sizes = ['text-3xl', 'text-4xl', 'text-2xl'];
            return (
              <div key={r.id} className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg mb-2 ${rank === 0 ? 'ring-4 ring-warning/50 scale-110' : ''}`}>
                  {r.name[0]}
                </div>
                <p className="text-sm font-semibold text-foreground truncate max-w-full">{r.name.split(' ')[0]}</p>
                <p className="text-xs text-muted-foreground mb-2">{r.xp} XP</p>
                <div className={`w-full ${heights[idx]} glass-card rounded-t-xl flex items-center justify-center`}>
                  <span className={sizes[idx]}>{medals[rank]}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Full ranking */}
      <motion.div variants={item} className="glass-card rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-sm font-medium text-muted-foreground">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Student</div>
          <div className="col-span-2 text-center">XP</div>
          <div className="col-span-2 text-center">Streak</div>
          <div className="col-span-2 text-center">Badges</div>
        </div>
        {ranked.map((r, i) => {
          const badgeCount = gamificationDb.userBadges.filter(b => b.userId === r.id).length;
          const isMe = r.id === user?.id;
          return (
            <motion.div
              key={r.id}
              variants={item}
              className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-border/50 items-center transition-colors ${isMe ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
            >
              <div className="col-span-1 font-display font-bold text-foreground">
                {i < 3 ? medals[i] : `#${i + 1}`}
              </div>
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{r.name} {isMe && <span className="text-xs text-primary">(You)</span>}</p>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                  <Star className="w-3.5 h-3.5 text-warning" /> {r.xp}
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="inline-flex items-center gap-1 text-sm text-foreground">
                  <Flame className="w-3.5 h-3.5 text-destructive" /> {r.streak}d
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="inline-flex items-center gap-1 text-sm text-foreground">
                  <Medal className="w-3.5 h-3.5 text-accent" /> {badgeCount}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default Leaderboard;
