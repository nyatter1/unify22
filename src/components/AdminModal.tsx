import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../supabase';

interface AdminModalProps {
  targetUid: string;
  targetUsername: string;
  action: 'mute' | 'kick' | 'ban' | 'unmute' | 'unkick' | 'unban';
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ targetUid, targetUsername, action, onClose }) => {
  const handleAction = async () => {
    try {
      let updateData = {};
      if (action === 'mute') {
        updateData = { isMuted: true };
      } else if (action === 'unmute') {
        updateData = { isMuted: false };
      } else if (action === 'kick') {
        updateData = { isKicked: true };
      } else if (action === 'unkick') {
        updateData = { isKicked: false };
      } else if (action === 'ban') {
        updateData = { isBanned: true };
      } else if (action === 'unban') {
        updateData = { isBanned: false };
      }
      
      const { error } = await supabase.from('users').update(updateData).eq('uid', targetUid);
      if (error) throw error;
      
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const isUnAction = action.startsWith('un');
  const actionColor = isUnAction ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white uppercase">{action} {targetUsername}?</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <p className="text-white/60 mb-6">Are you sure you want to {action} {targetUsername}?</p>
        
        <button onClick={handleAction} className={`w-full py-3 rounded-xl text-white font-bold uppercase tracking-widest transition-colors ${actionColor}`}>
          Confirm {action}
        </button>
      </div>
    </div>
  );
};
