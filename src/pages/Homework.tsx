import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/stores/useStore';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, FileText, AlertCircle, Plus, Upload, X, Image } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Correction {
  id: string;
  user_id: string;
  user_name: string;
  file_url: string;
  file_name: string;
  created_at: string;
}

interface HomeworkItem {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'done';
  created_by: string;
  created_by_name: string;
  corrections: Correction[];
}

export default function Homework() {
  const { user } = useAuth();
  const { subjects } = useStore();
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCorrectionForm, setShowCorrectionForm] = useState<string | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [correctionFile, setCorrectionFile] = useState<File | null>(null);
  const [correctionUploading, setCorrectionUploading] = useState(false);

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    const { data, error } = await supabase
      .from('homework')
      .select('*')
      .order('due_date', { ascending: true });

    if (!error && data) {
      const homeworkWithCorrections = await Promise.all(
        data.map(async (hw) => {
          const { data: corrections } = await supabase
            .from('corrections')
            .select('*')
            .eq('homework_id', hw.id)
            .order('created_at', { ascending: false });
          return { ...hw, corrections: corrections || [] };
        })
      );
      setHomework(homeworkWithCorrections);
    }
    setLoading(false);
  };

  const handleAddHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;

    setSubmitting(true);
    const { error } = await supabase.from('homework').insert({
      title: newTitle.trim(),
      description: newDescription.trim(),
      due_date: newDueDate,
      status: 'pending',
      created_by: user.id,
      created_by_name: user.email?.split('@')[0] || 'User',
    });

    if (!error) {
      setNewTitle('');
      setNewDescription('');
      setNewDueDate('');
      setShowAddForm(false);
      fetchHomework();
    }
    setSubmitting(false);
  };

  const handleToggleStatus = async (hw: HomeworkItem) => {
    const newStatus = hw.status === 'pending' ? 'done' : 'pending';
    await supabase.from('homework').update({ status: newStatus }).eq('id', hw.id);
    fetchHomework();
  };

  const handleUploadCorrection = async (homeworkId: string) => {
    if (!user || !correctionFile) return;

    setCorrectionUploading(true);
    const fileExt = correctionFile.name.split('.').pop();
    const fileName = `${homeworkId}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('corrections')
      .upload(fileName, correctionFile);

    if (!uploadError && uploadData) {
      const { data: { publicUrl } } = supabase.storage.from('corrections').getPublicUrl(fileName);

      await supabase.from('corrections').insert({
        homework_id: homeworkId,
        user_id: user.id,
        user_name: user.email?.split('@')[0] || 'User',
        file_url: publicUrl,
        file_name: correctionFile.name,
      });

      setCorrectionFile(null);
      setShowCorrectionForm(null);
      fetchHomework();
    }
    setCorrectionUploading(false);
  };

  const getDueInfo = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return { label: 'Due today', urgent: true };
    if (isPast(d)) return { label: 'Overdue', urgent: true };
    return { label: `Due ${format(d, 'MMM d')}`, urgent: false };
  };

  const pending = homework.filter(h => h.status === 'pending');
  const done = homework.filter(h => h.status === 'done');

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Homework</h1>
          <p className="text-sm text-muted-foreground mt-1">Track assignments and deadlines</p>
        </div>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Homework
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Homework</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddHomework} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Homework title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Optional description"
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Homework'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> Pending ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map((hw, i) => {
                  const due = getDueInfo(hw.due_date);
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
                          onClick={() => handleToggleStatus(hw)}
                          className="mt-0.5 text-muted-foreground hover:text-success transition-colors"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-muted-foreground">by {hw.created_by_name}</span>
                          </div>
                          <h3 className="font-semibold text-sm text-foreground">{hw.title}</h3>
                          {hw.description && <p className="text-xs text-muted-foreground mt-1">{hw.description}</p>}
                          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
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

                            <Dialog open={showCorrectionForm === hw.id} onOpenChange={(open) => setShowCorrectionForm(open ? hw.id : null)}>
                              <DialogTrigger asChild>
                                <button className="text-[11px] text-primary hover:underline flex items-center gap-1">
                                  <Upload className="h-3 w-3" /> Upload correction
                                </button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Upload Correction</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Photo</Label>
                                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setCorrectionFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="correction-file"
                                      />
                                      <label htmlFor="correction-file" className="cursor-pointer">
                                        {correctionFile ? (
                                          <div className="flex items-center justify-center gap-2">
                                            <Image className="h-5 w-5" />
                                            <span className="text-sm">{correctionFile.name}</span>
                                            <button onClick={(e) => { e.preventDefault(); setCorrectionFile(null); }} className="text-destructive">
                                              <X className="h-4 w-4" />
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <Upload className="h-8 w-8" />
                                            <span className="text-sm">Click to upload photo</span>
                                          </div>
                                        )}
                                      </label>
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() => handleUploadCorrection(hw.id)}
                                    disabled={!correctionFile || correctionUploading}
                                    className="w-full"
                                  >
                                    {correctionUploading ? 'Uploading...' : 'Submit'}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>

                          {hw.corrections.length > 0 && (
                            <div className="mt-3 flex gap-2 flex-wrap">
                              {hw.corrections.map(corr => (
                                <a
                                  key={corr.id}
                                  href={corr.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded hover:bg-muted/80"
                                >
                                  <Image className="h-3 w-3" />
                                  {corr.file_name}
                                </a>
                              ))}
                            </div>
                          )}
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
                {done.map(hw => (
                  <div key={hw.id} className="bg-card/50 rounded-xl border border-border/50 p-4 opacity-60">
                    <div className="flex items-start gap-3">
                      <button onClick={() => handleToggleStatus(hw)} className="mt-0.5 text-success">
                        <CheckCircle2 className="h-5 w-5 fill-success/20" />
                      </button>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">by {hw.created_by_name}</span>
                        </div>
                        <h3 className="font-semibold text-sm text-foreground line-through">{hw.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {homework.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No homework yet. Add some!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
