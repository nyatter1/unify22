import React, { useState } from 'react';
import { Star, Eye, MessageSquare, Mic, VolumeX, UserMinus, UserX, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { User } from '../types';

interface UserOptionsProps {
  targetUser: User;
  currentUser: User;
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
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-white">{targetUser.username}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        {targetUser.status && (
          <p className="text-sm text-white/40 italic mb-4">"{targetUser.status}"</p>
        )}

        {targetUser.badges && targetUser.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-6">
            {targetUser.badges.map((badge, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/60 uppercase tracking-wider">
                {badge}
              </span>
            ))}
          </div>
        )}
        
        <div className="space-y-2">
          <button onClick={() => onViewProfile(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-white/80"><Eye className="w-4 h-4" /> View Profile</button>
          <button onClick={() => onViewRatings(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-white/80"><Star className="w-4 h-4" /> {isSelf ? 'My Ratings' : 'View Ratings'}</button>
          {!isSelf && (
            <button onClick={() => onRateProfile(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-white/80"><MessageSquare className="w-4 h-4" /> Rate Profile</button>
          )}
          
          {isDev && (
            <button onClick={() => onForceSpeak(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-amber-500"><Mic className="w-4 h-4" /> Force Speak</button>
          )}
          
          {isAdmin && (
            <>
              <button onClick={() => onMute(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-red-400"><VolumeX className="w-4 h-4" /> Mute User</button>
              <button onClick={() => onKick(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-red-500"><UserMinus className="w-4 h-4" /> Kick User</button>
              <button onClick={() => onBan(targetUser.uid)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-red-600"><UserX className="w-4 h-4" /> Ban User</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
