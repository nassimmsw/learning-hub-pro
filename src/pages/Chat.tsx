import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/stores/useStore';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Send, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function Chat() {
  const { chatMessages, users, subjects, sendMessage, currentUser } = useStore();
  const [channel, setChannel] = useState('general');
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels = [
    { id: 'general', name: 'General', icon: '💬' },
    ...subjects.map(s => ({ id: s.id, name: s.name, icon: s.icon })),
  ];

  const filtered = chatMessages.filter(m => m.channelId === channel);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filtered.length]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim(), channel);
    setText('');
  };

  return (
    <div className="flex h-screen">
      {/* Channel list */}
      <div className="w-56 border-r border-border bg-card/50 flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-sm text-foreground">Channels</h2>
        </div>
        <div className="flex-1 overflow-auto p-2 space-y-0.5 scrollbar-thin">
          {channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setChannel(ch.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors
                ${channel === ch.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
            >
              <span className="text-base">{ch.icon}</span>
              <span className="truncate">{ch.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm text-foreground">
            {channels.find(c => c.id === channel)?.name}
          </h2>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4 scrollbar-thin">
          {filtered.map((msg, i) => {
            const author = users.find(u => u.id === msg.userId)!;
            const isOwn = msg.userId === '1';
            const showAvatar = i === 0 || filtered[i - 1].userId !== msg.userId;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${!showAvatar ? 'pl-[52px]' : ''}`}
              >
                {showAvatar && <UserAvatar user={author} size="md" />}
                <div className="flex-1 min-w-0">
                  {showAvatar && (
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className={`text-sm font-semibold ${isOwn ? 'text-primary' : 'text-foreground'}`}>{author.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(msg.createdAt), 'h:mm a')}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-foreground/90">{msg.text}</p>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              placeholder={`Message #${channels.find(c => c.id === channel)?.name}...`}
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
