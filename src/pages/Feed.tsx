import { useState } from 'react';
import { useStore } from '@/stores/useStore';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Heart, MessageCircle, Send, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

function CreatePost() {
  const [text, setText] = useState('');
  const { addPost, currentUser } = useStore();

  const handleSubmit = () => {
    if (!text.trim()) return;
    addPost(text.trim());
    setText('');
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex gap-3">
        <UserAvatar user={currentUser} size="md" />
        <div className="flex-1">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Share something with your class..."
            className="w-full bg-transparent resize-none border-none outline-none text-sm text-foreground placeholder:text-muted-foreground min-h-[60px]"
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
          />
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary text-xs transition-colors">
              <ImagePlus className="h-4 w-4" />
              <span>Image</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="gradient-primary text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40 transition-opacity flex items-center gap-1.5"
            >
              <Send className="h-3 w-3" />
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ postId }: { postId: string }) {
  const { posts, users, likePost, addComment } = useStore();
  const post = posts.find(p => p.id === postId)!;
  const author = users.find(u => u.id === post.userId)!;
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const liked = post.likes.includes('1');

  const handleComment = () => {
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border p-4"
    >
      <div className="flex gap-3">
        <UserAvatar user={author} size="md" showOnline />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm text-foreground">{author.name}</span>
            <span className="text-[11px] text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-foreground/90 mt-1.5 leading-relaxed whitespace-pre-wrap">{post.text}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
        <button
          onClick={() => likePost(post.id)}
          className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          <span>{post.likes.length}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments.length}</span>
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2.5">
              {post.comments.map(c => {
                const commenter = users.find(u => u.id === c.userId)!;
                return (
                  <div key={c.id} className="flex gap-2.5 pl-2">
                    <UserAvatar user={commenter} size="sm" />
                    <div className="bg-muted rounded-lg px-3 py-2 flex-1">
                      <span className="font-medium text-xs text-foreground">{commenter.name}</span>
                      <p className="text-xs text-foreground/80 mt-0.5">{c.text}</p>
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-2 pl-2">
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleComment(); }}
                  placeholder="Write a comment..."
                  className="flex-1 bg-muted rounded-lg px-3 py-2 text-xs outline-none text-foreground placeholder:text-muted-foreground"
                />
                <button onClick={handleComment} disabled={!commentText.trim()} className="text-primary disabled:opacity-40">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Feed() {
  const { posts } = useStore();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Classroom Feed</h1>
        <p className="text-sm text-muted-foreground mt-1">Stay updated with your classmates</p>
      </div>
      <CreatePost />
      <div className="space-y-4">
        {posts.map(p => <PostCard key={p.id} postId={p.id} />)}
      </div>
    </div>
  );
}
