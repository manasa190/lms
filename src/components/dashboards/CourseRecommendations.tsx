import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Star, Users } from 'lucide-react';
import { getRecommendations } from '@/lib/gamification';
import { useNavigate } from 'react-router-dom';

interface CourseRecommendationsProps {
  userId: string;
}

const CourseRecommendations = ({ userId }: CourseRecommendationsProps) => {
  const navigate = useNavigate();
  const recommendations = getRecommendations(userId).slice(0, 3);

  if (recommendations.length === 0) return null;

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={item}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-warning" />
        <h2 className="text-lg font-display font-semibold text-foreground">Recommended For You</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(`/course/${course.id}`)}
            className="glass-card rounded-xl p-5 cursor-pointer hover:shadow-card transition-all group"
          >
            <div className="h-24 w-full rounded-lg overflow-hidden mb-3 relative group-hover:scale-[1.02] transition-transform">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-accent flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent-foreground" />
                </div>
              )}
            </div>
            <h3 className="font-display font-semibold text-foreground text-sm mb-1">{course.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-warning" />{course.rating}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.studentsCount}</span>
            </div>
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">{course.category}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CourseRecommendations;
