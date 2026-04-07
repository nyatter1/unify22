import React, { useState, useEffect } from 'react';
import { 
  Star, Eye, MessageSquare, Mic, VolumeX, Volume2, 
  UserMinus, UserPlus, UserX, UserCheck, Shield, X, 
  ChevronDown, Settings2, ShieldAlert, Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mocking the utility for the standalone file environment
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Mocking constants if not provided in local scope
const RANKS = [
  { id: 'DEVELOPER', name: 'Developer', icon: 'https://api.iconify.design/lucide:code-2.svg' },
  { id: 'ADMINISTRATION', name: 'Admin', icon: 'https://api.iconify.design/lucide:shield-check.svg' },
  { id: 'MODERATOR', name: 'Moderator', icon: 'https://api.iconify.design/lucide:shield.svg' },
  { id: 'USER', name: 'User', icon: 'https://api.iconify.design/lucide:user.svg' }
];

export const UserOptions = ({
  targetUser,
  currentUser,
  onClose,
  onViewProfile,
  onRateProfile,
  onForceSpeak,
  onMute,
  onUnmute,
  onKick,
  onUnkick,
  onBan,
  onUnban,
  onChangeRank,
  onViewRatings
}) => {
  const [showRanks, setShowRanks] = useState(false);
  const [customRanks, setCustomRanks] = useState([]);

  // Fetching custom ranks logic (Preserving original functionality)
  useEffect(() => {
    const fetchCustomRanks = async () => {
      try {
        // In your production environment, ensure 'supabase' is imported or available
        // const { data, error } = await supabase.from('ranks').select('*');
        // if (data) setCustomRanks(data);
        setCustomRanks([]); 
      } catch (e) {
        console.error("Error fetching ranks:", e);
      }
    };
    fetchCustomRanks();
  }, []);

  const isDev = currentUser.rank === 'DEVELOPER';
  const isAdmin = isDev || ['ADMINISTRATION', 'STAR', 'FOUNDER'].includes(currentUser.rank);
  const isMod = isAdmin || currentUser.rank === 'MODERATOR';
  const isSelf = currentUser.uid === targetUser.uid;

  const ActionButton = ({ onClick, icon: Icon, children, variant = 'default', className = "" }) => {
    const variants = {
      default: "text-zinc-400 hover:text-white hover:bg-white/5",
      danger: "text-red-400 hover:text-red-300 hover:bg-red-500/10",
      success: "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10",
      warning: "text-amber-400 hover:text-amber-300 hover:bg-amber-500/10",
    };

    return (
      <button 
        onClick={onClick} 
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
          variants[variant],
          className
        )}
      >
        <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
        <span className="font-medium text-sm">{children}</span>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-zinc-950 border border-white/10 rounded-[2rem] w-full max-w-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh]"
      >
        {/* Left: Identity Sidebar */}
        <div className="w-full md:w-80 bg-gradient-to-b from-white/[0.03] to-transparent p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-white/10">
          <div className="relative group mb-6">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative">
              <img 
                src={targetUser.pfp} 
                alt={targetUser.username} 
                className="w-32 h-32 rounded-3xl border-2 border-white/10 relative z-10 object-cover shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500" 
              />
              <div className="absolute -bottom-2 -right-2 bg-zinc-900 border border-white/10 p-2 rounded-xl z-20 shadow-lg">
                <Fingerprint className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight text-center">{targetUser.username}</h2>
          <div className="flex items-center gap-2 mt-2">
             <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                {targetUser.rank || 'Member'}
             </span>
          </div>

          <div className="mt-6 w-full space-y-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-xs text-white/30 uppercase font-bold tracking-tighter mb-2 flex items-center gap-2">
                <Settings2 className="w-3 h-3" /> Bio
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                "{targetUser.status || 'This user prefers to stay mysterious...'}"
              </p>
            </div>

            {targetUser.badges && targetUser.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {targetUser.badges.map((badge, i) => (
                  <div key={i} className="px-3 py-1 rounded-lg bg-blue-500/5 border border-blue-500/20 text-[10px] text-blue-300 font-semibold uppercase">
                    {badge}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Interaction Panel */}
        <div className="flex-1 flex flex-col min-h-0 bg-zinc-950">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
               <h3 className="text-sm font-bold text-white/90 uppercase tracking-widest">User Controls</h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-1 gap-1">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-3 mb-2">General</p>
              <ActionButton onClick={() => onViewProfile(targetUser.uid)} icon={Eye}>
                View detailed profile
              </ActionButton>
              <ActionButton onClick={() => onViewRatings(targetUser.uid)} icon={Star}>
                {isSelf ? 'Manage my ratings' : 'Member feedback'}
              </ActionButton>
              {!isSelf && (
                <ActionButton onClick={() => onRateProfile(targetUser.uid)} icon={MessageSquare}>
                  Write a review
                </ActionButton>
              )}
            </div>

            {(isMod || isDev) && (
              <div className="mt-8">
                <p className="text-[10px] font-bold text-red-500/50 uppercase tracking-[0.2em] px-3 mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-3 h-3" /> Restriction Zone
                </p>
                
                <div className="bg-red-500/[0.02] border border-red-500/10 rounded-2xl p-1 space-y-1">
                  {isDev && (
                    <ActionButton onClick={() => onForceSpeak(targetUser.uid)} icon={Mic} variant="warning">
                      Force Voice Access
                    </ActionButton>
                  )}
                  
                  {!isSelf && (
                    <>
                      {targetUser.isMuted ? (
                        <ActionButton onClick={() => onUnmute(targetUser.uid)} icon={Volume2} variant="success">Restore Audio</ActionButton>
                      ) : (
                        <ActionButton onClick={() => onMute(targetUser.uid)} icon={VolumeX} variant="danger">Mute Communications</ActionButton>
                      )}

                      {isAdmin && (
                        <>
                          {targetUser.isKicked ? (
                            <ActionButton onClick={() => onUnkick(targetUser.uid)} icon={UserPlus} variant="success">Revoke Kick</ActionButton>
                          ) : (
                            <ActionButton onClick={() => onKick(targetUser.uid)} icon={UserMinus} variant="danger">Kick from Session</ActionButton>
                          )}

                          {targetUser.isBanned ? (
                            <ActionButton onClick={() => onUnban(targetUser.uid)} icon={UserCheck} variant="success">Revoke Ban</ActionButton>
                          ) : (
                            <ActionButton onClick={() => onBan(targetUser.uid)} icon={UserX} variant="danger">Permanent Ban</ActionButton>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {isAdmin && (
              <div className="mt-6">
                <button 
                  onClick={() => setShowRanks(!showRanks)} 
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all",
                    showRanks ? "bg-white/5 border-white/20" : "bg-transparent border-white/5 hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold text-white/80">Authority Management</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 transition-transform text-white/40", showRanks && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {showRanks && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 grid grid-cols-1 gap-1 p-2 bg-white/[0.02] rounded-2xl border border-white/5">
                        {[...RANKS, ...customRanks].map((r) => (
                          <button 
                            key={r.id}
                            onClick={() => onChangeRank(targetUser.uid, r.id, r.isCustom || false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm text-white/50 hover:text-white transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30">
                              <img src={r.icon} className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" alt="" />
                            </div>
                            <span className="font-medium">{r.name}</span>
                            {r.isCustom && <span className="ml-auto text-[8px] uppercase tracking-tighter opacity-30">Custom</span>}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
             <p className="text-[9px] text-white/20 uppercase tracking-[0.3em]">User Identifier: {targetUser.uid}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserOptions;
