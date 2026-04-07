import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { UserProfile, Theme, NewsPost } from '../../../types';
import { supabase } from '../../../supabase';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  newsPosts: NewsPost[];
  allUsers: UserProfile[];
  currentTheme: Theme;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  isOpen,
  onClose,
  user,
  newsPosts,
  allUsers,
  currentTheme,
}) => {
  const handlePostNews = async () => {
    const content = (document.getElementById('newsContent') as HTMLTextAreaElement).value;
    const imageUrl = (document.getElementById('newsImage') as HTMLInputElement).value;
    if (!content) return;
    
    const newPost = {
      authorId: user.uid,
      authorUsername: user.username,
      authorPfp: user.pfp,
      content,
      imageUrl: imageUrl || null,
      likes: [],
      dislikes: [],
      comments: [],
      timestamp: new Date().toISOString()
    };
    
    await supabase.from('news').insert(newPost);
    
    // Notify everyone
    allUsers.forEach(async (u) => {
      if (u.uid !== user.uid) {
        await supabase.from('notifications').insert({
          userId: u.uid,
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          type: 'news_post',
          content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          read: false,
          timestamp: new Date().toISOString()
        });
      }
    });

    (document.getElementById('newsContent') as HTMLTextAreaElement).value = '';
    (document.getElementById('newsImage') as HTMLInputElement).value = '';
  };

  const handleLike = async (post: NewsPost) => {
    const hasLiked = post.likes?.includes(user.uid);
    let newLikes = post.likes || [];
    let newDislikes = post.dislikes || [];
    
    if (hasLiked) {
      newLikes = newLikes.filter((id: string) => id !== user.uid);
    } else {
      newLikes.push(user.uid);
      newDislikes = newDislikes.filter((id: string) => id !== user.uid);
    }
    
    await supabase.from('news').update({ likes: newLikes, dislikes: newDislikes }).eq('id', post.id);
  };

  const handleDislike = async (post: NewsPost) => {
    const hasDisliked = post.dislikes?.includes(user.uid);
    let newLikes = post.likes || [];
    let newDislikes = post.dislikes || [];
    
    if (hasDisliked) {
      newDislikes = newDislikes.filter((id: string) => id !== user.uid);
    } else {
      newDislikes.push(user.uid);
      newLikes = newLikes.filter((id: string) => id !== user.uid);
    }
    
    await supabase.from('news').update({ likes: newLikes, dislikes: newDislikes }).eq('id', post.id);
  };

  const handleComment = async (e: React.KeyboardEvent<HTMLInputElement>, post: NewsPost) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const text = input.value.trim();
      if (!text) return;
      
      const newComment = {
        id: Date.now().toString(),
        authorId: user.uid,
        authorUsername: user.username,
        authorPfp: user.pfp,
        text,
        timestamp: new Date()
      };
      
      await supabase.from('news').update({
        comments: [...(post.comments || []), newComment]
      }).eq('id', post.id);
      
      input.value = '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-all",
              currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
              currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
              currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
            )}
            style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-serif italic text-white">News</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {(user.rank === 'DEVELOPER' || user.rank === 'FOUNDER') && (
                <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Add News Post</h3>
                  <textarea id="newsContent" placeholder="What's new?" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 h-24 resize-none"></textarea>
                  <input type="text" id="newsImage" placeholder="Image URL (optional)" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white mb-4" />
                  <button 
                    onClick={handlePostNews}
                    className="w-full py-3 rounded-xl bg-white text-black font-bold uppercase tracking-widest"
                  >
                    Post News
                  </button>
                </div>
              )}

              {newsPosts.length === 0 ? (
                <p className="text-center text-white/40 py-8">No news yet</p>
              ) : (
                newsPosts.map(post => (
                  <div key={post.id} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={post.authorPfp} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-bold text-white">{post.authorUsername}</p>
                        <p className="text-xs text-white/40">
                          {post.timestamp ? new Date(post.timestamp).toLocaleString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <p className="text-white/80 whitespace-pre-wrap mb-4">{post.content}</p>
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt="" className="w-full rounded-xl mb-4 object-cover max-h-96" />
                    )}
                    
                    <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                      <button 
                        onClick={() => handleLike(post)}
                        className={cn("flex items-center gap-2 text-sm", post.likes?.includes(user.uid) ? "text-amber-500" : "text-white/60 hover:text-white")}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes?.length || 0}
                      </button>
                      
                      <button 
                        onClick={() => handleDislike(post)}
                        className={cn("flex items-center gap-2 text-sm", post.dislikes?.includes(user.uid) ? "text-red-500" : "text-white/60 hover:text-white")}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        {post.dislikes?.length || 0}
                      </button>

                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments?.length || 0}
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-4 space-y-4">
                      {post.comments?.map((comment: any) => (
                        <div key={comment.id} className="flex gap-3 bg-black/20 p-3 rounded-xl">
                          <img src={comment.authorPfp} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-white">{comment.authorUsername}</p>
                            <p className="text-sm text-white/80">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Add a comment..." 
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                          onKeyDown={(e) => handleComment(e, post)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
