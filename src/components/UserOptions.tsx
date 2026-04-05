import React, { useState } from 'react';
import { Star, Eye, MessageSquare, Mic, VolumeX, UserMinus, UserX, X } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';

interface UserOptionsProps {
  targetUser: UserProfile;
  currentUser: UserProfile;
  onClose: () => void;
  onViewProfile: (uid: string) => void;
  onRateProfile: (uid: string) => void;
  onForceSpeak: (uid: string) => void;
  onMute: (uid: string) => void;
  onKick: (uid: string) => void;
  onBan: (uid: string) => void;
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
  onKick,
  onBan,
  onViewRatings
}) => {
  const isDev = currentUser.rank === 'DEVELOPER';
  const isAdmin = currentUser.rank === 'ADMINISTRATION' || currentUser.rank === 'STAR';
  const isSelf = currentUser.uid === targetUser.uid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-white/10 rounded-3xl p-0 w-full max-w-2xl shadow-2xl overflow-hidden flex flex-row"
      >
        {/* Left: Profile Preview */}
        <div className="w-1/3 bg-white/5 p-6 flex flex-col items-center justify-center border-r border-white/10">
           <div className="relative mb-4">
             <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20"></div>
             <img src={targetUser.pfp} alt={targetUser.username} className="w-24 h-24 rounded-full border-2 border-white/20 relative z-10" />
           </div>
           <h2 className="text-xl font-bold text-white mb-1">{targetUser.username}</h2>
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
        <div className="w-2/3 p-6">
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
            
            {isAdmin && (
              <div className="pt-2 border-t border-white/5 mt-2 space-y-2">
                <button onClick={() => onMute(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-all"><VolumeX className="w-4 h-4" /> Mute User</button>
                <button onClick={() => onKick(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all"><UserMinus className="w-4 h-4" /> Kick User</button>
                <button onClick={() => onBan(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-600 transition-all"><UserX className="w-4 h-4" /> Ban User</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
