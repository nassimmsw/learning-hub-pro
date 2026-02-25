import { useStore } from '@/stores/useStore';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

export default function Homework() {
  const { homework, subjects, toggleHomeworkStatus } = useStore();

  const getSubject = (id: string) => subjects.find(s => s.id === id);
  const pending = homework.filter(h => h.status === 'pending');
  const done = homework.filter(h => h.status === 'done');

  const getDueInfo = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return { label: 'Due today', urgent: true };
    if (isPast(d)) return { label: 'Overdue', urgent: true };
    return { label: `Due ${format(d, 'MMM d')}`, urgent: false };
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Homework</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your assignments and deadlines</p>
      </div>

      <div className="space-y-6">
        {pending.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" /> Pending ({pending.length})
            </h2>
            <div className="space-y-3">
              {pending.map((hw, i) => {
                const subject = getSubject(hw.subjectId);
                const due = getDueInfo(hw.dueDate);
                return (
                  <motion.div
                    key={hw.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleHomeworkStatus(hw.id)}
                        className="mt-0.5 text-muted-foreground hover:text-success transition-colors"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{subject?.icon}</span>
                          <span className="text-xs font-medium text-muted-foreground">{subject?.name}</span>
                        </div>
                        <h3 className="font-semibold text-sm text-foreground">{hw.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{hw.description}</p>
                        <div className="flex items-center gap-3 mt-2.5">
                          <span className={`text-[11px] font-medium flex items-center gap-1 ${due.urgent ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {due.urgent && <AlertCircle className="h-3 w-3" />}
                            {due.label}
                          </span>
                          {hw.corrections.length > 0 && (
                            <span className="text-[11px] text-primary flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {hw.corrections.length} correction(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {done.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Completed ({done.length})
            </h2>
            <div className="space-y-3">
              {done.map(hw => {
                const subject = getSubject(hw.subjectId);
                return (
                  <div key={hw.id} className="bg-card/50 rounded-xl border border-border/50 p-4 opacity-60">
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleHomeworkStatus(hw.id)} className="mt-0.5 text-success">
                        <CheckCircle2 className="h-5 w-5 fill-success/20" />
                      </button>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{subject?.icon}</span>
                          <span className="text-xs font-medium text-muted-foreground">{subject?.name}</span>
                        </div>
                        <h3 className="font-semibold text-sm text-foreground line-through">{hw.title}</h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
