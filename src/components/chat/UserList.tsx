import React from 'react';
import { Users, Search, UserPlus, Shield, X } from 'lucide-react';
import { UserProfile } from '../../types';
import { RANKS, DEFAULT_BANNER, DEFAULT_PFP } from '../../constants';
import { cn } from '../../lib/utils';

interface UserListProps {
  user: UserProfile;
  allUsers: UserProfile[];
  onlineCount: number;
  offlineCount: number;
  sidebarView: 'default' | 'search' | 'friends' | 'staff';
  setSidebarView: (view: 'default' | 'search' | 'friends' | 'staff') => void;
  userSearch: string;
  setUserSearch: (s: string) => void;
  userSort: 'lastOnline' | 'highestRank' | 'lastOffline' | 'newest' | 'lastSeen';
  setUserSort: (s: 'lastOnline' | 'highestRank' | 'lastOffline' | 'newest' | 'lastSeen') => void;
  filteredUsers: UserProfile[];
  handleProfileClick: (uid: string) => void;
  setShowSidebar: (show: boolean) => void;
  setShowStatusEditor: (show: boolean) => void;
  getCardStyles: (u: UserProfile) => any;
  showSidebar: boolean;
  currentTheme: any;
}

export const UserList = ({
  user,
  allUsers,
  onlineCount,
  offlineCount,
  sidebarView,
  setSidebarView,
  userSearch,
  setUserSearch,
  userSort,
  setUserSort,
  filteredUsers,
  handleProfileClick,
  setShowSidebar,
  setShowStatusEditor,
  getCardStyles,
  showSidebar,
  currentTheme
}: UserListProps) => {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 right-0 z-50 w-80 flex flex-col transition-transform lg:static lg:transform-none",
        currentTheme.customStyles?.glassEffect ? "backdrop-blur-2xl bg-black/20" : "bg-black/95 lg:bg-black/40 lg:backdrop-blur-xl",
        currentTheme.customStyles?.borderStyle ? "border-l" : "border-l border-white/10",
        showSidebar ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}
      style={{ borderLeft: currentTheme.customStyles?.borderStyle || undefined }}
    >
      <div className="p-6 border-b border-white/10 space-y-4 min-h-[160px] flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarView('default')}
              className={cn(
                "p-2 rounded-xl transition-all",
                sidebarView === 'default' ? "text-amber-500 bg-amber-500/10" : "text-white/40 hover:text-white"
              )}
            >
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarView('search')}
              className={cn(
                "p-2 rounded-xl transition-all",
                sidebarView === 'search' ? "text-amber-500 bg-amber-500/10" : "text-white/40 hover:text-white"
              )}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarView('friends')}
              className={cn(
                "p-2 rounded-xl transition-all",
                sidebarView === 'friends' ? "text-amber-500 bg-amber-500/10" : "text-white/40 hover:text-white"
              )}
              title="Friends"
            >
              <UserPlus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarView('staff')}
              className={cn(
                "p-2 rounded-xl transition-all",
                sidebarView === 'staff' ? "text-amber-500 bg-amber-500/10" : "text-white/40 hover:text-white"
              )}
              title="Staff"
            >
              <Shield className="w-5 h-5" />
            </button>
          </div>
          <button onClick={() => setShowSidebar(false)} className="p-2 text-white/40 hover:text-white lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        {sidebarView === 'default' && (
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
            <span className="text-green-500">Online: {onlineCount}</span>
            <span className="text-white/20">•</span>
            <span className="text-white/40">Offline: {offlineCount}</span>
          </div>
        )}

        {sidebarView === 'staff' && (
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500">
            🛡️ Staff Members
          </div>
        )}

        {sidebarView === 'search' && (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
            <select
              value={userSort}
              onChange={(e) => setUserSort(e.target.value as any)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/60 focus:outline-none focus:border-amber-500/50 transition-colors"
            >
              <option value="lastOnline">Last Online</option>
              <option value="highestRank">Highest Rank</option>
              <option value="lastOffline">Last Offline</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        )}

        {sidebarView === 'friends' && (
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">
            Your Friends
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {(sidebarView === 'friends' ? allUsers.filter(u => user.friends?.includes(u.uid)) : filteredUsers).map((u) => {
          const { className, style, textClass } = getCardStyles(u);
          return (
            <div
              key={u.uid}
              className={cn(className, "cursor-pointer")}
              style={style}
              onClick={() => {
                handleProfileClick(u.uid);
                if (window.innerWidth < 1024) setShowSidebar(false);
              }}
            >
              <div className="relative">
                <img
                  src={u.pfp}
                  className="w-10 h-10 rounded-full border border-white/20 object-cover relative z-10"
                />
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-black rounded-full z-20",
                  u.isOnline ? "bg-green-500" : "bg-zinc-600"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={cn("text-sm font-serif truncate", textClass)}>{u.username}</p>
                  <img
                    src={u.customRank?.icon || RANKS.find(r => r.id === (u.rank || 'VIP'))?.icon || ''}
                    className="w-3.5 h-3.5 object-contain"
                    alt="rank"
                  />
                </div>
                <p className="text-[10px] opacity-40 uppercase tracking-widest mt-0.5">{u.status || u.rank}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 border-t border-white/10 bg-black/60">
        <div className="relative h-28 rounded-xl overflow-hidden border border-white/10 mb-3 group">
          <img src={user.banner || DEFAULT_BANNER} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-3">
            <div className="relative">
              <img src={user.pfp || DEFAULT_PFP} className="w-12 h-12 rounded-full border-2 border-white/30 shadow-2xl object-cover relative z-10" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-serif text-white font-bold drop-shadow-md">{user.username}</p>
                <img
                  src={user.customRank?.icon || RANKS.find(r => r.id === (user.rank || 'VIP'))?.icon || ''}
                  className="w-3.5 h-3.5 object-contain"
                  alt="rank"
                />
              </div>
              <button
                onClick={() => setShowStatusEditor(true)}
                className="text-[10px] text-white/40 hover:text-white/60 text-left truncate max-w-[120px]"
              >
                {user.status || 'Set status...'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
