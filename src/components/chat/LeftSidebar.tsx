import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pin, 
  Gift, 
  UserPlus, 
  Palette, 
  Bell, 
  Newspaper, 
  RefreshCw, 
  BookOpen, 
  Terminal 
} from 'lucide-react';
import { UserProfile } from '../../types';
import { cn } from '../../lib/utils';
import { SidebarItem } from './SidebarItem';

interface LeftSidebarProps {
  user: UserProfile;
  isLeftSidebarPinned: boolean;
  setIsLeftSidebarPinned: (p: boolean) => void;
  showLeftSidebar: boolean;
  setShowLeftSidebar: (s: boolean) => void;
  setShowDailyReward: (s: boolean) => void;
  setShowFriendRequests: (s: boolean) => void;
  setShowCustomizer: (s: boolean) => void;
  handleOpenNotifications: () => void;
  setShowNews: (s: boolean) => void;
  setShowUpdates: (s: boolean) => void;
  setShowRules: (s: boolean) => void;
  setShowCommandsModal: (s: boolean) => void;
  unreadNotifications: number;
  currentTheme: any;
}

export const LeftSidebar = ({
  user,
  isLeftSidebarPinned,
  setIsLeftSidebarPinned,
  showLeftSidebar,
  setShowLeftSidebar,
  setShowDailyReward,
  setShowFriendRequests,
  setShowCustomizer,
  handleOpenNotifications,
  setShowNews,
  setShowUpdates,
  setShowRules,
  setShowCommandsModal,
  unreadNotifications,
  currentTheme
}: LeftSidebarProps) => {
  return (
    <aside
      onMouseEnter={() => !isLeftSidebarPinned && setShowLeftSidebar(true)}
      onMouseLeave={() => !isLeftSidebarPinned && setShowLeftSidebar(false)}
      className={cn(
        "hidden lg:flex flex-col transition-all duration-300",
        currentTheme.customStyles?.glassEffect ? "backdrop-blur-xl bg-black/20" : "bg-black/40",
        currentTheme.customStyles?.borderStyle ? "border-r" : "border-r border-white/10",
        (isLeftSidebarPinned || showLeftSidebar) ? "w-64" : "w-20"
      )}
      style={{ borderRight: currentTheme.customStyles?.borderStyle || undefined }}
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between overflow-hidden">
        <AnimatePresence>
          {(isLeftSidebarPinned || showLeftSidebar) && (
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="font-serif italic text-white text-lg whitespace-nowrap"
            >
              Navigation
            </motion.h2>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsLeftSidebarPinned(!isLeftSidebarPinned)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isLeftSidebarPinned ? "text-amber-500 bg-amber-500/10" : "text-white/40 hover:text-white hover:bg-white/5"
          )}
        >
          <Pin className={cn("w-4 h-4", isLeftSidebarPinned ? "fill-current" : "")} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        <SidebarItem icon={<Gift className="w-5 h-5" />} label="Daily Reward" onClick={() => setShowDailyReward(true)} expanded={isLeftSidebarPinned || showLeftSidebar} />
        <SidebarItem
          icon={<UserPlus className="w-5 h-5" />}
          label="Friend Requests"
          onClick={() => setShowFriendRequests(true)}
          expanded={isLeftSidebarPinned || showLeftSidebar}
          badge={user.friendRequests?.length || undefined}
        />
        <SidebarItem icon={<Palette className="w-5 h-5" />} label="Customise" onClick={() => setShowCustomizer(true)} expanded={isLeftSidebarPinned || showLeftSidebar} />
        <SidebarItem
          icon={<Bell className="w-5 h-5" />}
          label="Notifications"
          onClick={handleOpenNotifications}
          expanded={isLeftSidebarPinned || showLeftSidebar}
          badge={unreadNotifications > 0 ? unreadNotifications : undefined}
        />
        <SidebarItem icon={<Newspaper className="w-5 h-5" />} label="News" onClick={() => setShowNews(true)} expanded={isLeftSidebarPinned || showLeftSidebar} />
        <SidebarItem icon={<RefreshCw className="w-5 h-5" />} label="Updates" onClick={() => setShowUpdates(true)} expanded={isLeftSidebarPinned || showLeftSidebar} />
        <SidebarItem icon={<BookOpen className="w-5 h-5" />} label="Rules" onClick={() => setShowRules(true)} expanded={isLeftSidebarPinned || showLeftSidebar} />
        <SidebarItem icon={<Terminal className="w-5 h-5" />} label="Commands" onClick={() => setShowCommandsModal(true)} expanded={isLeftSidebarPinned || showLeftSidebar} />
      </div>
    </aside>
  );
};
