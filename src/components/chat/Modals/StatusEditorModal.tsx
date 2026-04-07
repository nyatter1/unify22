import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../supabase';
import { UserProfile } from '../../../types';

interface StatusEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onShowToast: (message: string) => void;
}

export const StatusEditorModal: React.FC<StatusEditorModalProps> = ({
  isOpen,
  onClose,
  user,
  onShowToast,
}) => {
  const [newStatus, setNewStatus] = useState(user.status || '');

  if (!isOpen) return null;

  const handleUpdateStatus = async () => {
    await supabase.from('users').update({ status: newStatus }).eq('uid', user.uid);
    onClose();
    onShowToast('Status updated!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Set Status</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <input 
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          placeholder="What's on your mind?"
          maxLength={50}
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white mb-4"
        />
        <button 
          onClick={handleUpdateStatus}
          className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors"
        >
          Update Status
        </button>
      </div>
    </div>
  );
};
