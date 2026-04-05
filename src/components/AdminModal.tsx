import React, { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface AdminModalProps {
  targetUid: string;
  targetUsername: string;
  action: 'mute' | 'kick' | 'ban' | 'unmute' | 'unkick' | 'unban';
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ targetUid, targetUsername, action, onClose }) => {
  const [duration, setDuration] = useState(60);
  const [reason, setReason] = useState('');

  const handleAction = async () => {
    try {
      const userRef = doc(db, 'users', targetUid);
      const now = new Date();
      const until = new Date(now.getTime() + duration * 60000);
      
      if (action === 'mute') {
        await updateDoc(userRef, { mutedUntil: until });
      } else if (action === 'unmute') {
        await updateDoc(userRef, { mutedUntil: null });
      } else if (action === 'kick') {
        await updateDoc(userRef, { kickedUntil: until });
      } else if (action === 'unkick') {
        await updateDoc(userRef, { kickedUntil: null });
      } else if (action === 'ban') {
        await updateDoc(userRef, { bannedUntil: until });
      } else if (action === 'unban') {
        await updateDoc(userRef, { bannedUntil: null });
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const isUnAction = action.startsWith('un');
  const actionColor = isUnAction ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white uppercase">{action} {targetUsername}?</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        {!isUnAction && (
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase">Duration</label>
              <select 
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white"
              >
                <option value={15}>15 Minutes</option>
                <option value={60}>1 Hour</option>
                <option value={1440}>24 Hours</option>
                <option value={10080}>7 Days</option>
                <option value={525600}>1 Year</option>
                <option value={99999999}>Permanent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase">Reason (Optional)</label>
              <input 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why are you taking this action?"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white"
              />
            </div>
          </div>
        )}

        {isUnAction && (
          <p className="text-white/60 mb-6">Are you sure you want to {action} {targetUsername}?</p>
        )}
        
        <button onClick={handleAction} className={`w-full py-3 rounded-xl text-white font-bold uppercase tracking-widest transition-colors ${actionColor}`}>
          Confirm {action}
        </button>
      </div>
    </div>
  );
};
