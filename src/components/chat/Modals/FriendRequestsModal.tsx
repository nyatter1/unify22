import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { UserProfile, Theme } from '../../../types';

interface FriendRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  allUsers: UserProfile[];
  currentTheme: Theme;
  onAccept: (uid: string) => void;
  onDecline: (uid: string) => void;
}

export const FriendRequestsModal: React.FC<FriendRequestsModalProps> = ({
  isOpen,
  onClose,
  user,
  allUsers,
  currentTheme,
  onAccept,
  onDecline,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh] transition-all",
              currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
              currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
              currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
            )}
            style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-serif italic text-white">Friend Requests</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              {!user.friendRequests || user.friendRequests.length === 0 ? (
                <p className="text-center text-white/40 py-8">No pending requests</p>
              ) : (
                user.friendRequests.map(uid => {
                  const requester = allUsers.find(u => u.uid === uid);
                  if (!requester) return null;
                  return (
                    <div key={uid} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <img src={requester.pfp} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{requester.username}</p>
                        <p className="text-xs text-white/40 uppercase tracking-widest">{requester.rank}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onAccept(uid)}
                          className="p-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDecline(uid)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
