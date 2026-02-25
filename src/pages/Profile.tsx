import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, ClipboardList, CheckCircle2, MessageCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, homework, todos, posts, chatMessages } = useStore();
  const { user, updateEmail, updatePassword, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const stats = [
    { label: 'Posts', value: posts.filter(p => p.userId === '1').length, icon: MessageCircle },
    { label: 'Homework Done', value: homework.filter(h => h.status === 'done').length, icon: ClipboardList },
    { label: 'Tasks Done', value: todos.filter(t => t.completed).length, icon: CheckCircle2 },
    { label: 'Messages', value: chatMessages.filter(m => m.userId === '1').length, icon: BookOpen },
  ];

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');
    
    if (!newEmail) {
      setEmailError('Please enter a new email');
      return;
    }

    const { error } = await updateEmail(newEmail);
    if (error) {
      setEmailError(error.message);
    } else {
      setEmailSuccess('Email updated! Check your new email to confirm.');
      setNewEmail('');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    const { error } = await updatePassword(newPassword);
    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="bg-card rounded-xl border border-border p-6 text-center">
        <div className="flex justify-center mb-4">
          <UserAvatar user={currentUser} size="lg" showOnline />
        </div>
        <h1 className="text-xl font-bold text-foreground">{currentUser.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">Class {currentUser.className} · Student</p>
        {user && (
          <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
        )}

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

      {user && (
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Change Email</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update Email</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="New email address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                  {emailSuccess && <p className="text-sm text-green-500">{emailSuccess}</p>}
                  <Button type="submit" className="w-full">Update Email</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                  {passwordSuccess && <p className="text-sm text-green-500">{passwordSuccess}</p>}
                  <Button type="submit" className="w-full">Update Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {user && (
        <Button variant="destructive" className="w-full" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      )}
    </div>
  );
}
