import React from 'react';
import { Users, Search, UserPlus, Shield, X, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mocking the utility for the standalone file environment
const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Updated RANKS constant with the official assets, names, and priorities provided.
 */
const RANKS = [
  { id: 'DEVELOPER', name: 'DEVELOPER', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/verified.gif', priority: 100 },
  { id: 'FOUNDER', name: 'FOUNDER', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/founder.gif', priority: 90 },
  { id: 'MOTHER_OF_PURITY', name: 'Mother Of Purity', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/MoP.gif', priority: 85 },
  { id: 'STAR', name: 'STAR', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/superadmin.png', priority: 80 },
  { id: 'ADMINISTRATION', name: 'ADMINISTRATION', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/admin.png', priority: 70 },
  { id: 'MODERATOR', name: 'MODERATOR', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/mod.png', priority: 60 },
  { id: 'TIGER', name: 'T.I.G.E.R', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/tiger.png', priority: 50 },
  { id: 'DRAGON', name: 'Dragon', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/dragon.png', priority: 45 },
  { id: 'MANTIS', name: 'Mantis', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/mantis.png', priority: 40 },
  { id: 'SNAKE', name: 'Snake', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/snake.png', priority: 35 },
  { id: 'MILLIONAIRE', name: 'Millionaire', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/gold.png', priority: 30 },
  { id: 'ELITE', name: 'The ELITE', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/elite.png', priority: 25 },
  { id: 'SUPER_VIP', name: 'Super VIP', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/super-vip.gif', priority: 20 },
  { id: 'GOOD_GIRL', name: 'Good Girl', icon: 'https://api.dicebear.com/7.x/icons/svg?seed=heart&backgroundColor=ffb6c1', priority: 15 },
  { id: 'BUNNY', name: 'Bunny', icon: 'https://api.dicebear.com/7.x/icons/svg?seed=rabbit&backgroundColor=ff69b4', priority: 12 },
  { id: 'VIP', name: 'VIP', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/vip.gif', priority: 10 },
];

const DEFAULT_PFP = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

export const UserList = ({
  user,
  allUsers = [],
  onlineCount = 0,
  offlineCount = 0,
  sidebarView = 'default',
  setSidebarView,
  userSearch = '',
  setUserSearch,
  userSort = 'lastOnline',
  setUserSort,
  filteredUsers = [],
  handleProfileClick,
  setShowSidebar,
  setShowStatusEditor,
  getCardStyles = () => ({}),
  showSidebar,
  currentTheme = {}
}) => {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 right-0 z-50 w-85 flex flex-col transition-all duration-500 lg:static lg:transform-none border-l border-white/5",
        currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-950/90 backdrop-blur-xl",
        showSidebar ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}
    >
      {/* Header & Navigation */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center p-1 bg-white/5 rounded-2xl gap-1">
            {[
              { id: 'default', icon: Users, label: 'Community' },
              { id: 'search', icon: Search, label: 'Find' },
              { id: 'friends', icon: UserPlus, label: 'Friends' },
              { id: 'staff', icon: Shield, label: 'Staff' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSidebarView(tab.id)}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-300 relative group",
                  sidebarView === tab.id 
                    ? "bg-white/10 text-white shadow-xl" 
                    : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
                )}
                title={tab.label}
              >
                <tab.icon className="w-4 h-4" />
                {sidebarView === tab.id && (
                  <motion.div layoutId="tab-indicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                )}
              </button>
            ))}
          </div>
          <button onClick={() => setShowSidebar(false)} className="p-2 text-white/20 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Context Headers */}
        <div className="px-1">
          {sidebarView === 'default' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{onlineCount} Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{offlineCount} Offline</span>
              </div>
            </div>
          )}

          {sidebarView === 'search' && (
            <div className="space-y-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-blue-500/50 transition-colors" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User List Body */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
        {(sidebarView === 'friends' ? allUsers.filter(u => user.friends?.includes(u.uid)) : filteredUsers).map((u) => {
          const { className, style } = getCardStyles(u);
          const rankData = u.customRank || RANKS.find(r => r.id === u.rank) || RANKS.find(r => r.id === 'VIP');

          return (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              key={u.uid}
              onClick={() => {
                handleProfileClick(u.uid);
                if (window.innerWidth < 1024) setShowSidebar(false);
              }}
              className={cn(
                "group relative p-3 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/10 hover:bg-white/[0.03] cursor-pointer",
                className
              )}
              style={style}
            >
              {/* Layout: Top Row */}
              <div className="flex items-center gap-3">
                {/* Avatar Section with Online Ring */}
                <div className="relative shrink-0">
                  <div className={cn(
                    "absolute -inset-1 rounded-full opacity-20 transition-opacity group-hover:opacity-40",
                    u.isOnline ? "bg-emerald-500" : "bg-transparent"
                  )} />
                  <img
                    src={u.pfp || DEFAULT_PFP}
                    className="w-10 h-10 rounded-full object-cover border border-white/10 relative z-10"
                    alt={u.username}
                  />
                  {u.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full z-20" />
                  )}
                </div>

                {/* Username & Rank */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white/90 truncate tracking-tight">
                      {u.username}
                    </p>
                    {rankData?.icon && (
                      <div className="flex items-center gap-1 shrink-0 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5">
                        <img
                          src={rankData.icon}
                          className="w-4 h-4 object-contain transition-all"
                          alt={rankData.name}
                        />
                      </div>
                    )}
                  </div>

                  {/* Mood/Status (Only if present) */}
                  {u.status && (
                    <p className="text-[11px] text-white/40 italic truncate mt-0.5 font-medium leading-tight">
                      {u.status}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Profile Toggle */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => setShowStatusEditor(true)}
          className="w-full relative group rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900/50 hover:border-white/20 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="p-3 flex items-center gap-3 relative z-10">
            <div className="relative shrink-0">
              <img 
                src={user.pfp || DEFAULT_PFP} 
                className="w-9 h-9 rounded-full border border-white/10 object-cover shadow-lg" 
                alt="Me" 
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[11px] font-bold text-white/80 truncate">{user.username}</p>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] truncate">
                {user.status || 'Click to set status'}
              </p>
            </div>

            <div className="p-2 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Settings2 className="w-3 h-3 text-white/40" />
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default UserList;
