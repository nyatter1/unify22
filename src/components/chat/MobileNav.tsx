import React from 'react';
import { Gift, Palette, Bell, Newspaper, Users } from 'lucide-react';
import { UserProfile } from '../../types';

interface MobileNavProps {
  setShowDailyReward: (s: boolean) => void;
  setShowCustomizer: (s: boolean) => void;
  handleOpenNotifications: () => void;
  setShowNews: (s: boolean) => void;
  setShowSidebar: (s: boolean) => void;
  unreadNotifications: number;
}

export const MobileNav = ({
  setShowDailyReward,
  setShowCustomizer,
  handleOpenNotifications,
  setShowNews,
  setShowSidebar,
  unreadNotifications
}: MobileNavProps) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-4 z-40">
      <button onClick={() => setShowDailyReward(true)} className="flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
        <Gift className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Daily</span>
      </button>
      <button onClick={() => setShowCustomizer(true)} className="flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
        <Palette className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Style</span>
      </button>
      <button onClick={handleOpenNotifications} className="relative flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
        <Bell className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Notifs</span>
        {unreadNotifications > 0 && <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full" />}
      </button>
      <button onClick={() => setShowNews(true)} className="flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
        <Newspaper className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase tracking-widest">News</span>
      </button>
      <button onClick={() => setShowSidebar(true)} className="flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
        <Users className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Users</span>
      </button>
    </nav>
  );
};
