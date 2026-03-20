import { useParams, useNavigate } from 'react-router-dom';
import { db } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, FileText, HelpCircle, CheckCircle, MessageSquare, Send, BookOpen, Maximize2, Minimize2, Info, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import QuizView from '@/components/course/QuizView';
import CourseChat from '@/components/course/CourseChat';
import confetti from 'canvas-confetti';

const CourseView = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isFocusMode, setIsFocusMode] = useState(false);

  const course = db.courses.find(c => c.id === courseId);
  const enrollment = user ? db.enrollments.find(e => e.userId === user.id && e.courseId === courseId) : null;

  useEffect(() => {
    if (course && !activeLesson && course.modules[0]?.lessons[0]) {
      setActiveLesson(course.modules[0].lessons[0].id);
    }
  }, [course]);

  if (!course || !user) return <div className="text-center py-12 text-muted-foreground">Course not found</div>;

  const allLessons = course.modules.flatMap(m => m.lessons);
  const currentLesson = allLessons.find(l => l.id === activeLesson);
  const totalLessons = allLessons.length;
  const completedCount = enrollment?.completedLessons.length || 0;
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isCompleted = (lessonId: string) => enrollment?.completedLessons.includes(lessonId) || false;

  const completeLesson = (lessonId: string) => {
    if (!enrollment || isCompleted(lessonId)) return;

    // Celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ec4899', '#10b981']
    });

    const enrollments = db.enrollments.map(e => {
      if (e.id !== enrollment.id) return e;
      const updated = { ...e, completedLessons: [...e.completedLessons, lessonId] };
      if (updated.completedLessons.length === totalLessons) {
        updated.completedAt = new Date().toISOString().split('T')[0];
        setTimeout(() => {
          confetti({ particleCount: 200, spread: 160, origin: { y: 0.5 } });
        }, 500);
      }
      return updated;
    });
    db.enrollments = enrollments;
    window.dispatchEvent(new Event('storage')); // Trigger update
  };

  const comments = db.comments.filter(c => c.lessonId === activeLesson && c.courseId === courseId);

  const addComment = () => {
    if (!newComment.trim()) return;
    db.comments = [...db.comments, {
      id: crypto.randomUUID(), userId: user.id, lessonId: activeLesson!, courseId: courseId!,
      content: newComment, createdAt: new Date().toISOString().split('T')[0],
    }];
    setNewComment('');
  };

  const lessonIcon = (type: string) => {
    if (type === 'video') return <Play className="w-4 h-4" />;
    if (type === 'quiz') return <HelpCircle className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsFocusMode(!isFocusMode)} className="glass-card">
          {isFocusMode ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
          {isFocusMode ? 'Normal View' : 'Focus Mode'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Course outline */}
        {!isFocusMode && (
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="lg:col-span-1 glass-card rounded-2xl p-5 h-fit lg:sticky lg:top-6">
            <h2 className="font-display font-bold text-foreground text-lg mb-2">{course.title}</h2>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full gradient-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-semibold text-primary">{progress}%</span>
            </div>

            <div className="space-y-6">
              {course.modules.map(mod => (
                <div key={mod.id}>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">{mod.title}</p>
                  <div className="space-y-1">
                    {mod.lessons.map(lesson => (
                      <button key={lesson.id} onClick={() => setActiveLesson(lesson.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all relative ${activeLesson === lesson.id
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted text-foreground'
                          }`}>
                        {activeLesson === lesson.id && (
                          <motion.div layoutId="active-lesson" className="absolute left-0 w-1 h-4 bg-primary rounded-full" />
                        )}
                        {isCompleted(lesson.id) ? (
                          <CheckCircle className="w-4 h-4 text-success shrink-0" />
                        ) : (
                          <span className={`${activeLesson === lesson.id ? 'text-primary' : 'text-muted-foreground'}`}>{lessonIcon(lesson.type)}</span>
                        )}
                        <span className="truncate">{lesson.title}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{lesson.duration}m</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main content */}
        <div className={isFocusMode ? 'lg:col-span-4' : 'lg:col-span-3'}>
          <AnimatePresence mode="wait">
            {currentLesson ? (
              <motion.div key={currentLesson.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="glass-card rounded-2xl p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {lessonIcon(currentLesson.type)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{currentLesson.type}</span>
                        <h2 className="text-2xl font-display font-bold text-foreground">{currentLesson.title}</h2>
                      </div>
                    </div>
                    {isCompleted(currentLesson.id) && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold">
                        <CheckCircle className="w-3 h-3" /> COMPLETED
                      </div>
                    )}
                  </div>

                  {currentLesson.type === 'video' && (
                    <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 shadow-2xl relative group">
                      <iframe
                        src={currentLesson.content}
                        title={currentLesson.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}

                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {currentLesson.type === 'quiz' ? (
                      <QuizView quizId={currentLesson.content} onComplete={() => completeLesson(currentLesson.id)} />
                    ) : (
                      <div className="space-y-6">
                        {currentLesson.type === 'text' && (
                          <p className="text-foreground/90 text-lg leading-relaxed font-body">{currentLesson.content}</p>
                        )}

                        {!isCompleted(currentLesson.id) && (
                          <Button size="lg" className="gradient-primary text-primary-foreground font-bold shadow-lg hover:shadow-primary/25 transition-all w-full md:w-auto"
                            onClick={() => completeLesson(currentLesson.id)}>
                            <Sparkles className="w-4 h-4 mr-2" /> Mark as Complete
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Details (Only in normal view or lesson start) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" /> What you'll learn
                    </h3>
                    <ul className="space-y-3">
                      {course.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-foreground/80">
                          <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" /> Prerequisites & Difficulty
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${course.difficulty === 'Beginner' ? 'bg-success/10 text-success' :
                        course.difficulty === 'Intermediate' ? 'bg-warning/10 text-warning' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                        {course.difficulty}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Required Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {course.prerequisites.map((p, idx) => (
                          <span key={idx} className="bg-muted px-2 py-1 rounded text-xs">{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments */}
                {currentLesson.type !== 'quiz' && (
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" /> Students' Feedback ({comments.length})
                    </h3>
                    <div className="space-y-4 mb-6">
                      {comments.map(c => {
                        const author = db.users.find(u => u.id === c.userId);
                        return (
                          <div key={c.id} className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 shadow-sm transition-transform group-hover:scale-110">
                              {author?.name[0] || '?'}
                            </div>
                            <div className="flex-1">
                              <div className="bg-muted/30 rounded-2xl p-4 transition-colors group-hover:bg-muted/50">
                                <p className="text-xs font-bold text-primary mb-1">{author?.name}</p>
                                <p className="text-sm text-foreground/80 leading-relaxed">{c.content}</p>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1 ml-2">{c.createdAt}</p>
                            </div>
                          </div>
                        );
                      })}
                      {comments.length === 0 && (
                        <div className="text-center py-8">
                          <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Be the first to start a conversation!</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Share your thoughts..." value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addComment()}
                        className="rounded-xl border-muted bg-muted/20 focus:bg-background transition-all" />
                      <Button onClick={addComment} className="gradient-primary text-primary-foreground shrink-0 rounded-xl shadow-md">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center">
                <BookOpen className="w-16 h-16 text-primary/20 mx-auto mb-4" />
                <h2 className="text-2xl font-display font-bold text-foreground mb-2">Ready to start?</h2>
                <p className="text-muted-foreground mb-6">Select a lesson from the outline to begin your journey.</p>
                <Button onClick={() => course.modules[0]?.lessons[0] && setActiveLesson(course.modules[0].lessons[0].id)}
                  className="gradient-primary text-primary-foreground font-bold rounded-xl px-8">
                  Get Started
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {courseId && <CourseChat courseId={courseId} />}
    </motion.div>
  );
};

export default CourseView;
