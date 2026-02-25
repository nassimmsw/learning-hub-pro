import { useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Home, BookOpen, ClipboardList, MessageCircle, User, Moon, Sun } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { UserAvatar } from '@/components/shared/UserAvatar';

const navItems = [
  { title: 'Feed', url: '/', icon: Home },
  { title: 'Homework', url: '/homework', icon: ClipboardList },
  { title: 'Subjects', url: '/subjects', icon: BookOpen },
  { title: 'Chat', url: '/chat', icon: MessageCircle },
  { title: 'Profile', url: '/profile', icon: User },
];

export function AppSidebar() {
  const location = useLocation();
  const { currentUser, darkMode, toggleDarkMode, users } = useStore();
  const onlineUsers = users.filter(u => u.online && u.id !== '1');

  return (
    <Sidebar className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="gradient-primary h-9 w-9 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
          2M
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm text-sidebar-accent-foreground">2M Classroom</h2>
          <p className="text-xs text-sidebar-foreground truncate">Class 2M · 2025-26</p>
        </div>
        <SidebarTrigger className="text-sidebar-foreground hover:text-sidebar-accent-foreground" />
      </div>

      <SidebarContent className="scrollbar-thin">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(item => {
                const active = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm
                          ${active
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                          }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.title === 'Chat' && (
                          <span className="ml-auto gradient-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60">Online</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 space-y-2">
              {onlineUsers.map(u => (
                <div key={u.id} className="flex items-center gap-2.5">
                  <UserAvatar user={u} size="sm" showOnline />
                  <span className="text-sm text-sidebar-foreground truncate">{u.name}</span>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-3 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3">
          <UserAvatar user={currentUser} size="sm" showOnline />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{currentUser.name}</p>
            <p className="text-[11px] text-sidebar-foreground">Class {currentUser.className}</p>
          </div>
          <button onClick={toggleDarkMode} className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </Sidebar>
  );
}
