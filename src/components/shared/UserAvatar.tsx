import { User } from '@/stores/useStore';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showOnline?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

export function UserAvatar({ user, size = 'md', showOnline = false }: UserAvatarProps) {
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const colors = [
    'bg-primary text-primary-foreground',
    'bg-accent text-accent-foreground',
    'bg-destructive text-destructive-foreground',
    'bg-success text-success-foreground',
    'bg-warning text-warning-foreground',
  ];
  const colorIdx = user.id.charCodeAt(0) % colors.length;

  return (
    <div className="relative inline-flex">
      <div className={`${sizeClasses[size]} ${colors[colorIdx]} rounded-full flex items-center justify-center font-semibold shrink-0`}>
        {initials}
      </div>
      {showOnline && user.online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-online border-2 border-card" />
      )}
    </div>
  );
}
