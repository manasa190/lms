import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/data';
import { motion } from 'framer-motion';
import { Award, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Certificates = () => {
  const { user } = useAuth();
  if (!user) return null;

  const completed = db.enrollments.filter(e => e.userId === user.id && e.completedAt);
  const courses = completed.map(e => ({ enrollment: e, course: db.courses.find(c => c.id === e.courseId)! })).filter(e => e.course);

  const downloadCertificate = (courseName: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 800, 600);
    grad.addColorStop(0, '#7c3aed');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);

    // Inner box
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.roundRect(40, 40, 720, 520, 16);
    ctx.fill();

    // Text
    ctx.fillStyle = '#1a1a2e';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', 400, 100);

    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(user.name, 400, 200);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText('has successfully completed', 400, 250);

    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#7c3aed';
    ctx.fillText(courseName, 400, 300);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#999';
    ctx.fillText(`Issued on ${new Date().toLocaleDateString()}`, 400, 380);
    ctx.fillText('Learnova', 400, 420);

    const link = document.createElement('a');
    link.download = `certificate-${courseName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
      <motion.h1 variants={item} className="text-3xl font-display font-bold text-foreground mb-6">My Certificates</motion.h1>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map(({ enrollment, course }) => (
            <motion.div key={enrollment.id} variants={item} className="glass-card rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-1">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">Completed on {enrollment.completedAt}</p>
              <Button variant="outline" onClick={() => downloadCertificate(course.title)}>
                <Download className="w-4 h-4 mr-2" /> Download Certificate
              </Button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Complete a course to earn your first certificate!</p>
        </div>
      )}
    </motion.div>
  );
};

export default Certificates;
