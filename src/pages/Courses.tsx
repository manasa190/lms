import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Users, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Courses = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<'popular' | 'rating' | 'newest'>('popular');
  const navigate = useNavigate();
  const { user } = useAuth();

  const courses = db.courses;
  const categories = ['All', ...new Set(courses.map(c => c.category))];

  const filtered = useMemo(() => {
    let result = courses.filter(c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== 'All') result = result.filter(c => c.category === category);
    if (sort === 'popular') result.sort((a, b) => b.studentsCount - a.studentsCount);
    else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [search, category, sort, courses]);

  const handleEnroll = (courseId: string) => {
    if (!user) return;
    const enrollments = db.enrollments;
    if (enrollments.find(e => e.userId === user.id && e.courseId === courseId)) {
      navigate(`/course/${courseId}`);
      return;
    }
    db.enrollments = [...enrollments, {
      id: crypto.randomUUID(), userId: user.id, courseId, completedLessons: [], enrolledAt: new Date().toISOString().split('T')[0],
    }];
    navigate(`/course/${courseId}`);
  };

  const isEnrolled = (courseId: string) => {
    if (!user) return false;
    return db.enrollments.some(e => e.userId === user.id && e.courseId === courseId);
  };

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <motion.h1 variants={item} className="text-3xl font-display font-bold text-foreground mb-6">Browse Courses</motion.h1>

      <motion.div variants={item} className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <Button key={cat} variant={category === cat ? 'default' : 'outline'} size="sm" onClick={() => setCategory(cat)}
              className={category === cat ? 'gradient-primary text-primary-foreground' : ''}>
              {cat}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="flex gap-2 mb-6">
        {(['popular', 'rating', 'newest'] as const).map(s => (
          <Button key={s} variant={sort === s ? 'default' : 'ghost'} size="sm" onClick={() => setSort(s)}
            className={sort === s ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground'}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => {
          const instructor = db.users.find(u => u.id === course.instructorId);
          const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
          const totalDuration = course.modules.reduce((s, m) => s + m.lessons.reduce((ls, l) => ls + l.duration, 0), 0);
          const enrolled = isEnrolled(course.id);

          return (
            <motion.div key={course.id} variants={item} whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card rounded-2xl overflow-hidden cursor-pointer group shadow-card relative border-white/10" onClick={() => handleEnroll(course.id)}>
              <div className="h-48 relative overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full gradient-primary flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary-foreground/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white shadow-xl uppercase tracking-wider">
                    {course.category}
                  </div>
                  <div className={`px-3 py-1 rounded-full backdrop-blur-md border border-white/10 text-[10px] font-bold shadow-xl uppercase tracking-wider ${course.difficulty === 'Beginner' ? 'bg-success/20 text-success' :
                    course.difficulty === 'Intermediate' ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                    {course.difficulty}
                  </div>
                </div>

                {enrolled && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-success text-[10px] font-bold text-success-foreground shadow-2xl">
                    <CheckCircle className="w-3 h-3" /> ENROLLED
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-body leading-relaxed">{course.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-warning text-warning" /> {course.rating}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.studentsCount}</span>
                  </div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{instructor?.name.split(' ')[0]}</p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </motion.div>
          );
        })}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">No courses found</p>}
    </motion.div>
  );
};

export default Courses;
