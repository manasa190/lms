import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Clock, CheckCircle2, BookOpen } from 'lucide-react';
import { gamificationDb, generateStudyPlan, StudyPlan } from '@/lib/gamification';
import { db } from '@/lib/data';

interface StudyPlannerProps {
  userId: string;
}

const StudyPlanner = ({ userId }: StudyPlannerProps) => {
  const [plans, setPlans] = useState<StudyPlan[]>([]);

  useEffect(() => {
    // Auto-generate plans for enrolled courses without one
    const enrollments = db.enrollments.filter(e => e.userId === userId && !e.completedAt);
    const existingPlans = gamificationDb.studyPlans.filter(p => p.userId === userId);
    const planCourseIds = new Set(existingPlans.map(p => p.courseId));

    for (const enrollment of enrollments) {
      if (!planCourseIds.has(enrollment.courseId)) {
        generateStudyPlan(userId, enrollment.courseId, 2);
      }
    }

    setPlans(gamificationDb.studyPlans.filter(p => p.userId === userId));
  }, [userId]);

  const today = new Date().toISOString().split('T')[0];

  const todaysLessons = plans.flatMap(plan => {
    const course = db.courses.find(c => c.id === plan.courseId);
    const todaySchedule = plan.schedule.find(s => s.date === today);
    if (!todaySchedule || !course) return [];
    return todaySchedule.lessonIds.map(lid => {
      const lesson = course.modules.flatMap(m => m.lessons).find(l => l.id === lid);
      return { lesson, courseName: course.title, courseId: course.id };
    }).filter(l => l.lesson);
  });

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={item} className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-display font-semibold text-foreground">Study Planner</h2>
      </div>

      {/* Today's lessons */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-secondary" />
          <h3 className="font-display font-medium text-foreground text-sm">Today's Goals</h3>
        </div>
        {todaysLessons.length > 0 ? (
          <div className="space-y-2">
            {todaysLessons.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
                <BookOpen className="w-4 h-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.lesson?.title}</p>
                  <p className="text-xs text-muted-foreground">{item.courseName}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">You're all caught up for today! 🎉</p>
        )}
      </div>

      {/* Course schedules */}
      {plans.slice(0, 3).map(plan => {
        const course = db.courses.find(c => c.id === plan.courseId);
        if (!course) return null;
        const completedDays = plan.schedule.filter(s => s.completed).length;
        const totalDays = plan.schedule.length;
        const progress = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

        return (
          <div key={plan.id} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground truncate pr-2">{course.title}</p>
              <span className="text-xs text-muted-foreground shrink-0">{plan.dailyLessons} lessons/day</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Est. finish: {plan.estimatedEnd}</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default StudyPlanner;
