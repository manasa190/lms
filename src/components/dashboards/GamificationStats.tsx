import { motion } from 'framer-motion';
import { Star, Flame, Trophy, Medal } from 'lucide-react';
import { gamificationDb } from '@/lib/gamification';
import { useNavigate } from 'react-router-dom';

interface GamificationStatsProps {
  userId: string;
}

const GamificationStats = ({ userId }: GamificationStatsProps) => {
  const navigate = useNavigate();
  const userPt = gamificationDb.userPoints.find(p => p.userId === userId);
  const badges = gamificationDb.userBadges.filter(b => b.userId === userId);
  const allBadges = gamificationDb.badges;

  const xp = userPt?.totalXp || 0;
  const streak = userPt?.streak || 0;
  const earnedBadges = badges.map(ub => allBadges.find(b => b.id === ub.badgeId)).filter(Boolean);

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  // XP level calculation
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;

  return (
    <motion.div variants={item} className="space-y-4">
      {/* XP & Streak Bar */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Total XP</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">{xp}</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Level {level}</span>
              <span>{xpInLevel}/100 XP</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${xpInLevel}%` }} />
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-destructive" />
            <span className="text-sm font-medium text-muted-foreground">Streak</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">{streak} days</p>
          <p className="text-xs text-muted-foreground mt-1">Keep learning daily!</p>
        </div>
      </div>

      {/* Badges */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-accent" />
            <h3 className="font-display font-medium text-foreground text-sm">Badges</h3>
          </div>
          <span className="text-xs text-muted-foreground">{earnedBadges.length}/{allBadges.length}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {allBadges.map(badge => {
            const earned = earnedBadges.some(b => b?.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all relative ${earned
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_-5px_hsl(var(--primary))]'
                    : 'bg-muted/50 text-muted-foreground/30 border border-border/50 opacity-40'
                  }`}
                title={badge.description}
              >
                {earned && <div className="absolute inset-0 rounded-2xl shimmer opacity-20" />}
                <span className="text-lg">{badge.icon}</span>
                <span className="uppercase tracking-wider">{badge.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard link */}
      <button
        onClick={() => navigate('/leaderboard')}
        className="w-full glass-card rounded-xl p-4 flex items-center justify-between hover:shadow-card transition-all group"
      >
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          <span className="text-sm font-medium text-foreground">View Leaderboard</span>
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">See rankings →</span>
      </button>
    </motion.div>
  );
};

export default GamificationStats;
