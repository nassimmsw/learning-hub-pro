import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Plus, BookOpen } from 'lucide-react';

export default function Subjects() {
  const { subjects, todos, toggleTodo, addTodo } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState('');

  const handleAdd = () => {
    if (!newTodo.trim() || !selected) return;
    addTodo(selected, newTodo.trim());
    setNewTodo('');
  };

  const subjectTodos = selected ? todos.filter(t => t.subjectId === selected) : [];
  const selectedSubject = subjects.find(s => s.id === selected);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Subjects</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your courses and tasks</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
        {subjects.map((s, i) => {
          const count = todos.filter(t => t.subjectId === s.id && !t.completed).length;
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(selected === s.id ? null : s.id)}
              className={`p-4 rounded-xl border text-left transition-all
                ${selected === s.id
                  ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                  : 'border-border bg-card hover:border-primary/30'
                }`}
            >
              <span className="text-2xl">{s.icon}</span>
              <h3 className="font-semibold text-sm text-foreground mt-2">{s.name}</h3>
              {count > 0 && (
                <span className="text-[11px] text-muted-foreground">{count} task{count > 1 ? 's' : ''}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {selected ? (
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">{selectedSubject?.icon}</span>
            <h2 className="font-bold text-lg text-foreground">{selectedSubject?.name}</h2>
            <span className="text-xs text-muted-foreground ml-auto">
              {subjectTodos.filter(t => t.completed).length}/{subjectTodos.length} done
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {subjectTodos.map(todo => (
              <button
                key={todo.id}
                onClick={() => toggleTodo(todo.id)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left group"
              >
                {todo.completed
                  ? <CheckCircle2 className="h-4.5 w-4.5 text-success shrink-0" />
                  : <Circle className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary shrink-0" />
                }
                <span className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {todo.text}
                </span>
                {todo.dueDate && (
                  <span className="ml-auto text-[11px] text-muted-foreground shrink-0">
                    {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </button>
            ))}
            {subjectTodos.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No tasks yet</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
              placeholder="Add a new task..."
              className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={handleAdd}
              disabled={!newTodo.trim()}
              className="gradient-primary text-primary-foreground px-3 py-2 rounded-lg disabled:opacity-40 transition-opacity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Select a subject to view tasks</p>
        </div>
      )}
    </div>
  );
}
