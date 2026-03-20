import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/data';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock } from 'lucide-react';

const MyCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const enrollments = user.role === 'instructor'
    ? db.courses.filter(c => c.instructorId === user.id).map(c => ({ course: c, progress: 100, enrollment: null }))
    : db.enrollments.filter(e => e.userId === user.id).map(e => {
      const course = db.courses.find(c => c.id === e.courseId)!;
      const total = course?.modules.reduce((s, m) => s + m.lessons.length, 0) || 0;
      return { course, progress: total > 0 ? Math.round((e.completedLessons.length / total) * 100) : 0, enrollment: e };
    }).filter(e => e.course);

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <motion.h1 variants={item} className="text-3xl font-display font-bold text-foreground mb-6">
        {user.role === 'instructor' ? 'My Created Courses' : 'My Courses'}
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((e, i) => (
          <motion.div key={i} variants={item} whileHover={{ y: -4 }}
            className="glass-card rounded-xl overflow-hidden cursor-pointer" onClick={() => navigate(`/course/${e.course.id}`)}>
            <div className="h-32 relative overflow-hidden">
              {e.course.thumbnail ? (
                <img src={e.course.thumbnail} alt={e.course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-primary flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-primary-foreground/30" />
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-display font-semibold text-foreground mb-2">{e.course.title}</h3>
              {user.role === 'student' && (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full gradient-primary rounded-full" style={{ width: `${e.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-primary">{e.progress}%</span>
                  </div>
                  {e.enrollment?.completedAt && <p className="text-xs text-success">✓ Completed</p>}
                </>
              )}
              {user.role === 'instructor' && (
                <p className="text-sm text-muted-foreground">{e.course.studentsCount} students enrolled</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {enrollments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {user.role === 'instructor' ? 'No courses created yet' : 'No enrolled courses yet. Browse the catalog!'}
        </div>
      )}
    </motion.div>
  );
};

export default MyCourses;
