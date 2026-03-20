import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Users, Circle } from 'lucide-react';
import { gamificationDb, ChatMessage } from '@/lib/gamification';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/data';

interface CourseChatProps {
  courseId: string;
}

const CourseChat = ({ courseId }: CourseChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(gamificationDb.chatMessages.filter(m => m.courseId === courseId));
  }, [courseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      courseId,
      userId: user.id,
      userName: user.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    const allMessages = gamificationDb.chatMessages;
    allMessages.push(msg);
    gamificationDb.chatMessages = allMessages;
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  // Get online users (simulated - users enrolled in this course)
  const enrolledUsers = db.enrollments
    .filter(e => e.courseId === courseId)
    .map(e => db.users.find(u => u.id === e.userId))
    .filter(Boolean);

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] glass-card rounded-2xl overflow-hidden border border-border flex flex-col"
            style={{ maxHeight: '500px' }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border bg-card/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span className="font-display font-semibold text-foreground text-sm">Course Chat</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{enrolledUsers.length} members</span>
                </div>
              </div>
              {/* Online indicators */}
              <div className="flex items-center gap-1 mt-1.5">
                {enrolledUsers.slice(0, 5).map(u => (
                  <div key={u!.id} className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted/50 text-[10px] text-muted-foreground">
                    <Circle className="w-1.5 h-1.5 fill-success text-success" />
                    {u!.name.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '340px' }}>
              {messages.map(msg => {
                const isMe = msg.userId === user?.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] ${isMe ? 'order-2' : ''}`}>
                      {!isMe && (
                        <p className="text-[10px] text-muted-foreground mb-0.5 ml-1">{msg.userName}</p>
                      )}
                      <div className={`px-3 py-2 rounded-2xl text-sm ${
                        isMe
                          ? 'gradient-primary text-primary-foreground rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      }`}>
                        {msg.content}
                      </div>
                      <p className={`text-[10px] text-muted-foreground mt-0.5 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-2.5 border-t border-border bg-card/80">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground border-none outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center disabled:opacity-40 hover:scale-105 transition-transform"
                >
                  <Send className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CourseChat;
