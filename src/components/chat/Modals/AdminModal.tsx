import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../supabase';

interface AdminModalProps {
  targetUid: string;
  targetUsername: string;
  action: 'mute' | 'kick' | 'ban' | 'unmute' | 'unkick' | 'unban';
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ targetUid, targetUsername, action, onClose }) => {
  const [duration, setDuration] = useState('60'); // default 60 mins
  const [reason, setReason] = useState('');

  const handleAction = async () => {
    try {
      let updateData: any = {};
      const now = new Date();
      
      if (action === 'mute') {
        const until = new Date(now.getTime() + parseInt(duration) * 60000).toISOString();
        updateData = { isMuted: true, mutedUntil: until, muteReason: reason };
      } else if (action === 'unmute') {
        updateData = { isMuted: false, mutedUntil: null, muteReason: null };
      } else if (action === 'kick') {
        const until = new Date(now.getTime() + parseInt(duration) * 60000).toISOString();
        updateData = { isKicked: true, kickedUntil: until, kickReason: reason };
      } else if (action === 'unkick') {
        updateData = { isKicked: false, kickedUntil: null, kickReason: null };
      } else if (action === 'ban') {
        updateData = { isBanned: true, banReason: reason };
      } else if (action === 'unban') {
        updateData = { isBanned: false, banReason: null };
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
  const showDuration = action === 'mute' || action === 'kick';
  const showReason = action === 'mute' || action === 'kick' || action === 'ban';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white uppercase">{action} {targetUsername}?</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="space-y-4 mb-6">
          {showDuration && (
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-white/20"
                placeholder="Minutes"
              />
            </div>
          )}
          
          {showReason && (
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase mb-2">Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-white/20 h-24 resize-none"
                placeholder="Reason for action..."
              />
            </div>
          )}
          
          {!showDuration && !showReason && (
            <p className="text-white/60">Are you sure you want to {action} {targetUsername}?</p>
          )}
        </div>
        
        <button onClick={handleAction} className={`w-full py-3 rounded-xl text-white font-bold uppercase tracking-widest transition-colors ${actionColor}`}>
          Confirm {action}
        </button>
      </div>
    </div>
  );
};
