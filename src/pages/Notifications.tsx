import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/data';
import { motion } from 'framer-motion';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Notifications = () => {
  const { user } = useAuth();
  if (!user) return null;

  const notifications = db.notifications.filter(n => n.userId === user.id);

  const markRead = (id: string) => {
    db.notifications = db.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    window.location.reload();
  };

  const markAllRead = () => {
    db.notifications = db.notifications.map(n => n.userId === user.id ? { ...n, read: true } : n);
    window.location.reload();
  };

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
      <div className="flex items-center justify-between mb-6">
        <motion.h1 variants={item} className="text-3xl font-display font-bold text-foreground">Notifications</motion.h1>
        {notifications.some(n => !n.read) && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <Check className="w-4 h-4 mr-1" /> Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <motion.div key={n.id} variants={item}
            className={`glass-card rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all ${!n.read ? 'border-l-4 border-l-primary' : 'opacity-70'}`}
            onClick={() => !n.read && markRead(n.id)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!n.read ? 'gradient-primary' : 'bg-muted'}`}>
              <Bell className={`w-5 h-5 ${!n.read ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="font-medium text-foreground">{n.title}</p>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.createdAt}</p>
            </div>
          </motion.div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No notifications yet</div>
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;
