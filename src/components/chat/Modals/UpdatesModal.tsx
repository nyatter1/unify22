import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { UserProfile, Theme, AppUpdate } from '../../../types';
import { supabase } from '../../../supabase';

interface UpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  appUpdates: AppUpdate[];
  currentTheme: Theme;
}

export const UpdatesModal: React.FC<UpdatesModalProps> = ({
  isOpen,
  onClose,
  user,
  appUpdates,
  currentTheme,
}) => {
  const handlePostUpdate = async () => {
    const version = (document.getElementById('updateVersion') as HTMLInputElement).value;
    const title = (document.getElementById('updateTitle') as HTMLInputElement).value;
    const content = (document.getElementById('updateContent') as HTMLTextAreaElement).value;
    if (!version || !title || !content) return;
    await supabase.from('updates').insert({ version, title, content, timestamp: new Date().toISOString() });
    (document.getElementById('updateVersion') as HTMLInputElement).value = '';
    (document.getElementById('updateTitle') as HTMLInputElement).value = '';
    (document.getElementById('updateContent') as HTMLTextAreaElement).value = '';
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
              "w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] transition-all",
              currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
              currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
              currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
            )}
            style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-serif italic text-white">Updates</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {(user.rank === 'DEVELOPER' || user.rank === 'FOUNDER') && (
                <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Add Update</h3>
                  <input type="text" id="updateVersion" placeholder="Version (e.g. v1.1.0)" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white mb-4" />
                  <input type="text" id="updateTitle" placeholder="Title" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white mb-4" />
                  <textarea id="updateContent" placeholder="Content" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 h-24 resize-none"></textarea>
                  <button 
                    onClick={handlePostUpdate}
                    className="w-full py-3 rounded-xl bg-white text-black font-bold uppercase tracking-widest"
                  >
                    Post Update
                  </button>
                </div>
              )}

              {appUpdates.length === 0 ? (
                <p className="text-center text-white/40 py-8">No updates yet</p>
              ) : (
                appUpdates.map(update => (
                  <div key={update.id} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">{update.title}</h3>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold">{update.version}</span>
                    </div>
                    <p className="text-white/80 whitespace-pre-wrap">{update.content}</p>
                    <p className="text-xs text-white/40 mt-4">
                      {update.timestamp ? new Date(update.timestamp).toLocaleString() : 'Just now'}
                    </p>
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
