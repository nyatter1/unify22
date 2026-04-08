import React from 'react';
import { Gift, Palette, Bell, Newspaper, Users, Mail } from 'lucide-react';
import { UserProfile } from '../../types';

interface MobileNavProps {
  setShowDailyReward: (s: boolean) => void;
  setShowCustomizer: (s: boolean) => void;
  handleOpenNotifications: () => void;
  setShowNews: (s: boolean) => void;
  setShowSidebar: (s: boolean) => void;
  setShowInbox: (s: boolean) => void;
  unreadNotifications: number;
  unreadPMs: number;
}

export const MobileNav = ({
  setShowDailyReward,
  setShowCustomizer,
  handleOpenNotifications,
  setShowNews,
  setShowSidebar,
  setShowInbox,
  unreadNotifications,
  unreadPMs
}: MobileNavProps) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-2 z-40">
      <button onClick={() => setShowDailyReward(true)} className="flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
        <Gift className="w-5 h-5" />
        <span className="text-[9px] font-bold uppercase tracking-widest">Daily</span>
      </button>
      <button onClick={() => setShowInbox(true)} className="relative flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
        <Mail className={`w-5 h-5 ${unreadPMs > 0 ? 'text-red-500' : ''}`} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Inbox</span>
        {unreadPMs > 0 && <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full" />}
      </button>
      <button onClick={() => setShowCustomizer(true)} className="flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
        <Palette className="w-5 h-5" />
        <span className="text-[9px] font-bold uppercase tracking-widest">Style</span>
      </button>
      <button onClick={handleOpenNotifications} className="relative flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
        <Bell className="w-5 h-5" />
        <span className="text-[9px] font-bold uppercase tracking-widest">Notifs</span>
        {unreadNotifications > 0 && <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full" />}
      </button>
      <button onClick={() => setShowNews(true)} className="flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
        <Newspaper className="w-5 h-5" />
        <span className="text-[9px] font-bold uppercase tracking-widest">News</span>
      </button>
      <button onClick={() => setShowSidebar(true)} className="flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
        <Users className="w-5 h-5" />
        <span className="text-[9px] font-bold uppercase tracking-widest">Users</span>
      </button>
    </nav>
  );
};
