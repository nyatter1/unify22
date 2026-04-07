import React from 'react';
import { Coins, Gem, Heart, LogOut } from 'lucide-react';
import { UserProfile } from '../../types';
import { DEFAULT_PFP } from '../../constants';
import { cn } from '../../lib/utils';
import { supabase } from '../../supabase';

interface HeaderProps {
  user: UserProfile;
  currentTheme: any;
  showFriendsOnly: boolean;
  setShowFriendsOnly: (s: boolean) => void;
  setShowSidebar: (s: boolean) => void;
}

export const Header = ({
  user,
  currentTheme,
  showFriendsOnly,
  setShowFriendsOnly,
  setShowSidebar
}: HeaderProps) => {
  return (
    <header
      className={cn(
        "h-20 border-b flex items-center justify-between px-4 sm:px-8 z-20",
        currentTheme.customStyles?.glassEffect ? "backdrop-blur-2xl bg-black/20" : "bg-black/40",
        currentTheme.customStyles?.borderStyle ? "" : "border-white/10"
      )}
      style={{ borderBottom: currentTheme.customStyles?.borderStyle || undefined }}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-serif italic bg-gradient-to-b from-amber-50 to-amber-200 bg-clip-text text-transparent tracking-tight drop-shadow-xl">
          Uni-Fy
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Wallet Display - Always Visible */}
        <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] sm:text-xs font-bold text-white">{(user.gold ?? 0).toLocaleString()}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Gem className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] sm:text-xs font-bold text-white">{(user.rubies ?? 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-white/10">
          <div className="text-right hidden md:block">
            <p className="text-sm font-serif text-white leading-none">{user.username}</p>
            <div className="flex items-center justify-end gap-1.5 mt-1">
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">{user.status || user.rank}</span>
            </div>
          </div>
          <img src={user.pfp || DEFAULT_PFP} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-white/20 object-cover shadow-xl" />
          <button
            onClick={() => {
              setShowSidebar(true);
              setShowFriendsOnly(!showFriendsOnly);
            }}
            className={cn(
              "p-2 rounded-xl border transition-all flex items-center gap-2",
              showFriendsOnly
                ? "bg-amber-500/20 border-amber-500/50 text-amber-500"
                : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
            )}
          >
            <Heart className={cn("w-5 h-5", showFriendsOnly && "fill-current")} />
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
