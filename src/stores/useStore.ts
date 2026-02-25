import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  avatar: string;
  className: string;
  online?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  text: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Homework {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'done';
  corrections: Correction[];
}

export interface Correction {
  id: string;
  userId: string;
  fileName: string;
  uploadedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Todo {
  id: string;
  subjectId: string;
  text: string;
  completed: boolean;
  dueDate?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  channelId: string;
}

interface AppState {
  currentUser: User;
  users: User[];
  posts: Post[];
  homework: Homework[];
  subjects: Subject[];
  todos: Todo[];
  chatMessages: ChatMessage[];
  darkMode: boolean;

  toggleDarkMode: () => void;
  addPost: (text: string, image?: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  toggleHomeworkStatus: (id: string) => void;
  toggleTodo: (id: string) => void;
  addTodo: (subjectId: string, text: string, dueDate?: string) => void;
  sendMessage: (text: string, channelId: string) => void;
}

const mockUsers: User[] = [
  { id: '1', name: 'You', avatar: '', className: '2M', online: true },
  { id: '2', name: 'Sarah Chen', avatar: '', className: '2M', online: true },
  { id: '3', name: 'Alex Moreau', avatar: '', className: '2M', online: false },
  { id: '4', name: 'Lina Dupont', avatar: '', className: '2M', online: true },
  { id: '5', name: 'Prof. Bernard', avatar: '', className: '2M', online: false },
];

const mockSubjects: Subject[] = [
  { id: 's1', name: 'Mathematics', color: 'primary', icon: '📐' },
  { id: 's2', name: 'Physics', color: 'accent', icon: '⚡' },
  { id: 's3', name: 'French', color: 'destructive', icon: '📖' },
  { id: 's4', name: 'History', color: 'warning', icon: '🏛️' },
  { id: 's5', name: 'Computer Science', color: 'success', icon: '💻' },
];

export const useStore = create<AppState>((set, get) => ({
  currentUser: mockUsers[0],
  users: mockUsers,
  darkMode: true,
  subjects: mockSubjects,

  posts: [
    {
      id: 'p1', userId: '2', text: 'Does anyone have notes from today\'s math lecture? I missed the part about integrals 😅',
      likes: ['3', '4'], comments: [
        { id: 'c1', userId: '4', text: 'I\'ll share mine after class!', createdAt: '2026-02-25T10:30:00' },
        { id: 'c2', userId: '3', text: 'Same here, check the shared folder', createdAt: '2026-02-25T10:45:00' },
      ], createdAt: '2026-02-25T09:00:00'
    },
    {
      id: 'p2', userId: '5', text: '📢 Reminder: Physics lab report due this Friday. Please submit on time.',
      likes: ['1', '2', '3'], comments: [], createdAt: '2026-02-24T14:00:00'
    },
    {
      id: 'p3', userId: '4', text: 'Just finished the CS project! 🎉 Neural network accuracy at 94%. Happy to help anyone who needs it.',
      likes: ['1', '2'], comments: [
        { id: 'c3', userId: '2', text: 'That\'s amazing! Can you share your approach?', createdAt: '2026-02-24T16:30:00' },
      ], createdAt: '2026-02-24T15:00:00'
    },
  ],

  homework: [
    { id: 'h1', subjectId: 's1', title: 'Integration Exercises', description: 'Chapter 5, exercises 1-15. Show all work.', dueDate: '2026-02-28', status: 'pending', corrections: [] },
    { id: 'h2', subjectId: 's2', title: 'Physics Lab Report', description: 'Write up the pendulum experiment results.', dueDate: '2026-02-27', status: 'pending', corrections: [{ id: 'cr1', userId: '2', fileName: 'lab_report_v1.pdf', uploadedAt: '2026-02-25T12:00:00' }] },
    { id: 'h3', subjectId: 's5', title: 'Neural Network Project', description: 'Build and train a simple neural network classifier.', dueDate: '2026-02-26', status: 'done', corrections: [] },
    { id: 'h4', subjectId: 's3', title: 'Essay: Romanticism', description: 'Write 2000 words on the Romantic literary movement.', dueDate: '2026-03-05', status: 'pending', corrections: [] },
  ],

  todos: [
    { id: 't1', subjectId: 's1', text: 'Review integration formulas', completed: false, dueDate: '2026-02-27' },
    { id: 't2', subjectId: 's2', text: 'Finish lab report draft', completed: true, dueDate: '2026-02-26' },
    { id: 't3', subjectId: 's5', text: 'Debug neural network code', completed: true },
    { id: 't4', subjectId: 's3', text: 'Read chapters 5-7', completed: false, dueDate: '2026-02-28' },
    { id: 't5', subjectId: 's4', text: 'Prepare presentation slides', completed: false, dueDate: '2026-03-01' },
  ],

  chatMessages: [
    { id: 'm1', userId: '2', text: 'Hey everyone! Ready for the exam?', createdAt: '2026-02-25T08:00:00', channelId: 'general' },
    { id: 'm2', userId: '4', text: 'Not really 😂 still studying', createdAt: '2026-02-25T08:05:00', channelId: 'general' },
    { id: 'm3', userId: '3', text: 'Let\'s do a study group tonight?', createdAt: '2026-02-25T08:10:00', channelId: 'general' },
    { id: 'm4', userId: '2', text: 'Great idea! Library at 7pm?', createdAt: '2026-02-25T08:15:00', channelId: 'general' },
    { id: 'm5', userId: '1', text: 'I\'m in! 🙌', createdAt: '2026-02-25T08:20:00', channelId: 'general' },
    { id: 'm6', userId: '4', text: 'Can someone explain Fourier transforms?', createdAt: '2026-02-25T09:00:00', channelId: 's1' },
    { id: 'm7', userId: '3', text: 'Sure, it\'s basically decomposing signals into frequencies', createdAt: '2026-02-25T09:05:00', channelId: 's1' },
  ],

  toggleDarkMode: () => {
    set(s => {
      const next = !s.darkMode;
      document.documentElement.classList.toggle('dark', next);
      return { darkMode: next };
    });
  },

  addPost: (text, image) => set(s => ({
    posts: [{ id: `p${Date.now()}`, userId: '1', text, image, likes: [], comments: [], createdAt: new Date().toISOString() }, ...s.posts]
  })),

  likePost: (postId) => set(s => ({
    posts: s.posts.map(p => p.id === postId
      ? { ...p, likes: p.likes.includes('1') ? p.likes.filter(l => l !== '1') : [...p.likes, '1'] }
      : p)
  })),

  addComment: (postId, text) => set(s => ({
    posts: s.posts.map(p => p.id === postId
      ? { ...p, comments: [...p.comments, { id: `c${Date.now()}`, userId: '1', text, createdAt: new Date().toISOString() }] }
      : p)
  })),

  toggleHomeworkStatus: (id) => set(s => ({
    homework: s.homework.map(h => h.id === id ? { ...h, status: h.status === 'done' ? 'pending' : 'done' } : h)
  })),

  toggleTodo: (id) => set(s => ({
    todos: s.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  })),

  addTodo: (subjectId, text, dueDate) => set(s => ({
    todos: [...s.todos, { id: `t${Date.now()}`, subjectId, text, completed: false, dueDate }]
  })),

  sendMessage: (text, channelId) => set(s => ({
    chatMessages: [...s.chatMessages, { id: `m${Date.now()}`, userId: '1', text, createdAt: new Date().toISOString(), channelId }]
  })),
}));
