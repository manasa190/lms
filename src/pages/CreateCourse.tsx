import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db, Module, Lesson } from '@/lib/data';
import { motion } from 'framer-motion';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('0');
  const [thumbnail, setThumbnail] = useState('');
  const [modules, setModules] = useState<{ title: string; lessons: { title: string; type: 'video' | 'text' | 'quiz'; content: string; duration: number }[] }[]>([
    { title: 'Module 1', lessons: [{ title: 'Lesson 1', type: 'video', content: '', duration: 10 }] },
  ]);

  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) return null;

  const addModule = () => setModules([...modules, { title: `Module ${modules.length + 1}`, lessons: [] }]);
  const addLesson = (mi: number) => {
    const updated = [...modules];
    updated[mi].lessons.push({ title: `Lesson ${updated[mi].lessons.length + 1}`, type: 'video', content: '', duration: 10 });
    setModules(updated);
  };
  const removeModule = (mi: number) => setModules(modules.filter((_, i) => i !== mi));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseId = crypto.randomUUID();
    const newModules: Module[] = modules.map((m, mi) => ({
      id: crypto.randomUUID(), title: m.title, order: mi + 1,
      lessons: m.lessons.map((l, li) => ({
        id: crypto.randomUUID(), title: l.title, type: l.type, content: l.content, duration: l.duration, order: li + 1,
      })),
    }));

    db.courses = [...db.courses, {
      id: courseId, title, description, category: category || 'General', thumbnail,
      instructorId: user.id, price: parseFloat(price) || 0, rating: 0, studentsCount: 0,
      modules: newModules, createdAt: new Date().toISOString().split('T')[0],
    }];

    navigate('/my-courses');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-3xl font-display font-bold text-foreground mb-6">Create Course</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-foreground">Course Details</h2>
          <Input placeholder="Course title" value={title} onChange={e => setTitle(e.target.value)} required />
          <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
            <Input placeholder="Thumbnail URL" value={thumbnail} onChange={e => setThumbnail(e.target.value)} />
          </div>
        </div>

        {modules.map((mod, mi) => (
          <div key={mi} className="glass-card rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Input value={mod.title} onChange={e => { const u = [...modules]; u[mi].title = e.target.value; setModules(u); }}
                className="font-semibold text-foreground max-w-xs" />
              <Button variant="ghost" size="sm" onClick={() => removeModule(mi)} className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {mod.lessons.map((lesson, li) => (
              <div key={li} className="p-3 rounded-lg bg-muted/50 space-y-2">
                <Input placeholder="Lesson title" value={lesson.title}
                  onChange={e => { const u = [...modules]; u[mi].lessons[li].title = e.target.value; setModules(u); }} />
                <div className="flex gap-2">
                  <select value={lesson.type} onChange={e => { const u = [...modules]; u[mi].lessons[li].type = e.target.value as any; setModules(u); }}
                    className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
                    <option value="video">Video</option>
                    <option value="text">Text</option>
                    <option value="quiz">Quiz</option>
                  </select>
                  <Input type="number" placeholder="Duration (min)" value={lesson.duration}
                    onChange={e => { const u = [...modules]; u[mi].lessons[li].duration = parseInt(e.target.value) || 0; setModules(u); }}
                    className="w-32" />
                </div>
                <Textarea placeholder="Content" value={lesson.content}
                  onChange={e => { const u = [...modules]; u[mi].lessons[li].content = e.target.value; setModules(u); }} />
              </div>
            ))}

            <Button variant="outline" size="sm" onClick={() => addLesson(mi)}>
              <Plus className="w-4 h-4 mr-1" /> Add Lesson
            </Button>
          </div>
        ))}

        <Button variant="outline" onClick={addModule} type="button">
          <Plus className="w-4 h-4 mr-1" /> Add Module
        </Button>

        <Button type="submit" className="gradient-primary text-primary-foreground w-full">
          Create Course
        </Button>
      </form>
    </motion.div>
  );
};

export default CreateCourse;
