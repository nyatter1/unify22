import React, { useState, useEffect } from 'react';
import { Star, Eye, MessageSquare, Mic, VolumeX, Volume2, UserMinus, UserPlus, UserX, UserCheck, Shield, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { UserProfile, RankDefinition } from '../types';
import { RANKS } from '../constants';
import { supabase } from '../supabase';

interface UserOptionsProps {
  targetUser: UserProfile;
  currentUser: UserProfile;
  onClose: () => void;
  onViewProfile: (uid: string) => void;
  onRateProfile: (uid: string) => void;
  onForceSpeak: (uid: string) => void;
  onMute: (uid: string) => void;
  onUnmute: (uid: string) => void;
  onKick: (uid: string) => void;
  onUnkick: (uid: string) => void;
  onBan: (uid: string) => void;
  onUnban: (uid: string) => void;
  onChangeRank: (uid: string, rankId: string, isCustom: boolean) => void;
  onViewRatings: (uid: string) => void;
}

export const UserOptions: React.FC<UserOptionsProps> = ({
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
  const [customRanks, setCustomRanks] = useState<RankDefinition[]>([]);

  useEffect(() => {
    const fetchCustomRanks = async () => {
      try {
        const { data, error } = await supabase.from('ranks').select('*');
        if (data) {
          setCustomRanks(data as RankDefinition[]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCustomRanks();
  }, []);

  const isDev = currentUser.rank === 'DEVELOPER';
  const isAdmin = isDev || currentUser.rank === 'ADMINISTRATION' || currentUser.rank === 'STAR' || currentUser.rank === 'FOUNDER';
  const isMod = isAdmin || currentUser.rank === 'MODERATOR';
  const isSelf = currentUser.uid === targetUser.uid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-white/10 rounded-3xl p-0 w-full max-w-2xl shadow-2xl overflow-hidden flex flex-row max-h-[90vh]"
      >
        {/* Left: Profile Preview */}
        <div className="w-1/3 bg-white/5 p-6 flex flex-col items-center justify-center border-r border-white/10 overflow-y-auto">
           <div className="relative mb-4">
             <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20"></div>
             <img src={targetUser.pfp} alt={targetUser.username} className="w-24 h-24 rounded-full border-2 border-white/20 relative z-10 object-cover" />
           </div>
           <h2 className="text-xl font-bold text-white mb-1 text-center">{targetUser.username}</h2>
           <p className="text-sm text-white/40 italic mb-4 text-center">"{targetUser.status || 'No status'}"</p>
           
           {targetUser.badges && targetUser.badges.length > 0 && (
             <div className="flex flex-wrap gap-1 justify-center">
               {targetUser.badges.map((badge, i) => (
                 <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60 uppercase tracking-wider">
                   {badge}
                 </span>
               ))}
             </div>
           )}
        </div>

        {/* Right: Actions */}
        <div className="w-2/3 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Actions</h2>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="space-y-2">
            <button onClick={() => onViewProfile(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-white/80 transition-all"><Eye className="w-4 h-4" /> View Profile</button>
            <button onClick={() => onViewRatings(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-white/80 transition-all"><Star className="w-4 h-4" /> {isSelf ? 'My Ratings' : 'View Ratings'}</button>
            {!isSelf && (
              <button onClick={() => onRateProfile(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-white/80 transition-all"><MessageSquare className="w-4 h-4" /> Rate Profile</button>
            )}
            
            {isDev && (
              <button onClick={() => onForceSpeak(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-amber-500/10 text-amber-500 transition-all"><Mic className="w-4 h-4" /> Force Speak</button>
            )}
            
            {isMod && !isSelf && (
              <div className="pt-4 border-t border-white/5 mt-4 space-y-2">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider px-3 mb-2">Moderation</h3>
                
                {targetUser.isMuted ? (
                  <button onClick={() => onUnmute(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-500/10 text-green-400 transition-all"><Volume2 className="w-4 h-4" /> Unmute User</button>
                ) : (
                  <button onClick={() => onMute(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all"><VolumeX className="w-4 h-4" /> Mute User</button>
                )}

                {isAdmin && (
                  <>
                    {targetUser.isKicked ? (
                      <button onClick={() => onUnkick(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-500/10 text-green-500 transition-all"><UserPlus className="w-4 h-4" /> Unkick User</button>
                    ) : (
                      <button onClick={() => onKick(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all"><UserMinus className="w-4 h-4" /> Kick User</button>
                    )}

                    {targetUser.isBanned ? (
                      <button onClick={() => onUnban(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-500/10 text-green-600 transition-all"><UserCheck className="w-4 h-4" /> Unban User</button>
                    ) : (
                      <button onClick={() => onBan(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-600 transition-all"><UserX className="w-4 h-4" /> Ban User</button>
                    )}

                    <div className="mt-4">
                      <button 
                        onClick={() => setShowRanks(!showRanks)} 
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-white/80 transition-all"
                      >
                        <div className="flex items-center gap-3"><Shield className="w-4 h-4" /> Change Rank</div>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", showRanks && "rotate-180")} />
                      </button>
                      
                      <AnimatePresence>
                        {showRanks && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-2 space-y-1 pl-4 border-l border-white/10 ml-4 max-h-48 overflow-y-auto pr-2"
                          >
                            {RANKS.map(r => (
                              <button 
                                key={r.id}
                                onClick={() => onChangeRank(targetUser.uid, r.id, false)}
                                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-sm text-white/60 hover:text-white transition-colors"
                              >
                                <img src={r.icon} className="w-4 h-4 object-contain" alt={r.name} />
                                {r.name}
                              </button>
                            ))}
                            {customRanks.map(r => (
                              <button 
                                key={r.id}
                                onClick={() => onChangeRank(targetUser.uid, r.id, true)}
                                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 text-sm text-white/60 hover:text-white transition-colors"
                              >
                                <img src={r.icon} className="w-4 h-4 object-contain" alt={r.name} />
                                {r.name} (Custom)
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
