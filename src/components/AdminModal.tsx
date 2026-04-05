// AdminModal.tsx — replace src/components/AdminModal.tsx
import React from 'react';
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
      const updates: Record<string, any> = {};
      if (action === 'mute')   updates.is_muted = true;
      if (action === 'unmute') updates.is_muted = false;
      if (action === 'kick')   updates.is_kicked = true;
      if (action === 'unkick') updates.is_kicked = false;
      if (action === 'ban')    updates.is_banned = true;
      if (action === 'unban')  updates.is_banned = false;

      await supabase.from('users').update(updates).eq('uid', targetUid);
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
