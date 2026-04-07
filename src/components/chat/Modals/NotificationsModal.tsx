import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Theme, AppNotification } from '../../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  currentTheme: Theme;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  currentTheme,
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
              <h2 className="text-xl font-serif italic text-white">Notifications</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              {notifications.length === 0 ? (
                <p className="text-center text-white/40 py-8">No notifications yet</p>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <img src={notif.senderPfp} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm text-white/80">
                        <span className="font-bold text-white">{notif.senderUsername}</span>
                        {notif.type === 'profile_view' && ' viewed your profile'}
                        {notif.type === 'profile_like' && ' liked your profile'}
                        {notif.type === 'news_post' && ` posted: "${notif.content || 'News'}"`}
                        {notif.type === 'global_notification' && `: ${notif.content || 'Notification'}`}
                        {notif.type === 'mention' && ' mentioned you in chat'}
                      </p>
                      <p className="text-xs text-white/40 mt-1">
                        {notif.timestamp?.toDate ? notif.timestamp.toDate().toLocaleString() : 'Just now'}
                      </p>
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
