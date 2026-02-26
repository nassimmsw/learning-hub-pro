import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Send, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Message {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  text: string;
  created_at: string;
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!text.trim() || !user) return;

    const message = {
      user_id: user.id,
      user_email: user.email || '',
      user_name: user.email?.split('@')[0] || 'User',
      text: text.trim(),
    };

    const { error } = await supabase.from('messages').insert(message);
    
    if (!error) {
      setText('');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm text-foreground">Class Chat</h2>
          <span className="text-xs text-muted-foreground ml-auto">{messages.length} messages</span>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4 scrollbar-thin">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isOwn = msg.user_id === user?.id;
              const showAvatar = i === 0 || messages[i - 1].user_id !== msg.user_id;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${!showAvatar ? 'pl-[52px]' : ''}`}
                >
                  {showAvatar && (
                    <UserAvatar 
                      user={{ id: msg.user_id, name: msg.user_name, avatar: '', className: '' }} 
                      size="md" 
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    {showAvatar && (
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className={`text-sm font-semibold ${isOwn ? 'text-primary' : 'text-foreground'}`}>
                          {msg.user_name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {format(new Date(msg.created_at), 'h:mm a')}
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-foreground/90">{msg.text}</p>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Type a message..."
              className="flex-1 bg-muted rounded-lg px-4 py-2.5 text-sm outline-none text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary/30 transition-shadow"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="gradient-primary text-primary-foreground px-4 py-2.5 rounded-lg disabled:opacity-40 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
