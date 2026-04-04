import React, { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface AdminModalProps {
  targetUid: string;
  targetUsername: string;
  action: 'mute' | 'kick' | 'ban';
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ targetUid, targetUsername, action, onClose }) => {
  const handleAction = async () => {
    try {
      const userRef = doc(db, 'users', targetUid);
      if (action === 'mute') {
        await updateDoc(userRef, { muted: true });
      } else if (action === 'kick') {
        // Kick logic (e.g., set a flag that forces logout)
        await updateDoc(userRef, { kicked: true });
      } else if (action === 'ban') {
        await updateDoc(userRef, { banned: true });
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white uppercase">{action} {targetUsername}?</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <p className="text-white/60 mb-6">Are you sure you want to {action} {targetUsername}?</p>
        
        <button onClick={handleAction} className="w-full py-3 rounded-xl bg-red-600 text-white font-bold uppercase tracking-widest hover:bg-red-500 transition-colors">
          Confirm {action}
        </button>
      </div>
    </div>
  );
};
