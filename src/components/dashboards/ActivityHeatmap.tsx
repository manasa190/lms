import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { gamificationDb } from '@/lib/gamification';

interface ActivityHeatmapProps {
  userId: string;
}

const ActivityHeatmap = ({ userId }: ActivityHeatmapProps) => {
  const heatmapData = useMemo(() => {
    const logs = gamificationDb.activityLogs.filter(l => l.userId === userId);
    const countByDate: Record<string, number> = {};

    for (const log of logs) {
      countByDate[log.date] = (countByDate[log.date] || 0) + 1;
    }

    // Generate last 16 weeks (112 days)
    const today = new Date();
    const weeks: { date: string; count: number; dayOfWeek: number }[][] = [];
    let currentWeek: { date: string; count: number; dayOfWeek: number }[] = [];

    for (let i = 111; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      const entry = { date: dateStr, count: countByDate[dateStr] || 0, dayOfWeek };

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(entry);
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return weeks;
  }, [userId]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-muted';
    if (count <= 1) return 'bg-primary/25';
    if (count <= 2) return 'bg-primary/50';
    if (count <= 3) return 'bg-primary/75';
    return 'bg-primary';
  };

  const totalActiveDays = heatmapData.flat().filter(d => d.count > 0).length;
  const totalActivities = heatmapData.flat().reduce((s, d) => s + d.count, 0);

  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-display font-semibold text-foreground">Learning Activity</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{totalActiveDays} active days</span>
          <span>{totalActivities} activities</span>
        </div>
      </div>
      <div className="flex gap-0.5">
        <div className="flex flex-col gap-0.5 mr-1.5 mt-0">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-[13px] text-[10px] text-muted-foreground flex items-center">{label}</div>
          ))}
        </div>
        {heatmapData.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day, di) => (
              <motion.div
                key={day.date}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: wi * 0.02 + di * 0.01 }}
                className={`w-[13px] h-[13px] rounded-[3px] ${getColor(day.count)} cursor-pointer transition-all hover:ring-2 hover:ring-primary/30`}
                title={`${day.date}: ${day.count} activities`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2 justify-end">
        <span className="text-[10px] text-muted-foreground">Less</span>
        {[0, 1, 2, 3, 4].map(level => (
          <div key={level} className={`w-[11px] h-[11px] rounded-[2px] ${getColor(level)}`} />
        ))}
        <span className="text-[10px] text-muted-foreground">More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
