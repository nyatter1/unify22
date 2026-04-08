import React from 'react';
import { Users, Search, UserPlus, Shield, X, Mail, Bell, User } from 'lucide-react';
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
  unreadPMs: number;
  unreadNotifications: number;
  setShowInbox: (show: boolean) => void;
  setShowFriendRequests: (show: boolean) => void;
  handleOpenNotifications: () => void;
  setShowCustomizer: (show: boolean) => void;
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
  currentTheme,
  unreadPMs,
  unreadNotifications,
  setShowInbox,
  setShowFriendRequests,
  handleOpenNotifications,
  setShowCustomizer
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
      <div className="p-4 border-b border-white/10 space-y-4">
        <div className="flex items-center justify-between lg:hidden mb-2">
          <span className="font-serif text-white font-bold">Users</span>
          <button onClick={() => setShowSidebar(false)} className="text-white hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Second Row: Users, Friends, Staff, Search */}
        <div className="flex items-center justify-between bg-white/5 rounded-xl p-1">
          <button
            onClick={() => setSidebarView('default')}
            className={cn(
              "flex-1 p-2 rounded-lg flex items-center justify-center transition-all",
              sidebarView === 'default' ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
            )}
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarView('friends')}
            className={cn(
              "flex-1 p-2 rounded-lg flex items-center justify-center transition-all",
              sidebarView === 'friends' ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
            )}
          >
            <User className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarView('staff')}
            className={cn(
              "flex-1 p-2 rounded-lg flex items-center justify-center transition-all",
              sidebarView === 'staff' ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
            )}
          >
            <Shield className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarView('search')}
            className={cn(
              "flex-1 p-2 rounded-lg flex items-center justify-center transition-all",
              sidebarView === 'search' ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
            )}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {sidebarView === 'default' && (
          <div className="flex items-center gap-2 text-sm font-bold">
            <span className="text-white">Online</span>
            <span className="bg-cyan-500 text-white px-2 py-0.5 rounded-full text-xs">{onlineCount}</span>
          </div>
        )}

        {sidebarView === 'staff' && (
          <div className="flex items-center gap-2 text-sm font-bold text-amber-500">
            🛡️ Staff Members
            <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full text-xs">
              {filteredUsers.length}
            </span>
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
          <div className="text-sm font-bold text-white">
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
              className={cn(className, "cursor-pointer flex items-center gap-3")}
              style={style}
              onClick={() => {
                handleProfileClick(u.uid);
                if (window.innerWidth < 1024) setShowSidebar(false);
              }}
            >
              <div className="relative shrink-0">
                <img
                  src={u.pfp}
                  className="w-10 h-10 rounded-full border border-white/20 object-cover relative z-10"
                />
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-black rounded-full z-20",
                  u.isOnline ? "bg-green-500" : "bg-zinc-600"
                )} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className={cn("text-sm font-serif truncate", textClass)}>{u.username}</p>
                {u.status && (
                  <p className="text-[10px] opacity-60 truncate mt-0.5">{u.status}</p>
                )}
              </div>
              <img
                src={u.customRank?.icon || RANKS.find(r => r.id === (u.rank || 'VIP'))?.icon || ''}
                className="w-4 h-4 object-contain shrink-0"
                alt="rank"
              />
            </div>
          );
        })}
      </div>
    </aside>
  );
};
