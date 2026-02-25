import { useStore } from '@/stores/useStore';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { BookOpen, ClipboardList, CheckCircle2, MessageCircle } from 'lucide-react';

export default function Profile() {
  const { currentUser, homework, todos, posts, chatMessages } = useStore();

  const stats = [
    { label: 'Posts', value: posts.filter(p => p.userId === '1').length, icon: MessageCircle },
    { label: 'Homework Done', value: homework.filter(h => h.status === 'done').length, icon: ClipboardList },
    { label: 'Tasks Done', value: todos.filter(t => t.completed).length, icon: CheckCircle2 },
    { label: 'Messages', value: chatMessages.filter(m => m.userId === '1').length, icon: BookOpen },
  ];

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="bg-card rounded-xl border border-border p-6 text-center">
        <div className="flex justify-center mb-4">
          <UserAvatar user={currentUser} size="lg" showOnline />
        </div>
        <h1 className="text-xl font-bold text-foreground">{currentUser.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">Class {currentUser.className} · Student</p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {stats.map(s => (
            <div key={s.label} className="bg-muted/50 rounded-lg p-3">
              <s.icon className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
