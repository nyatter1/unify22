import React, { useState } from 'react';
import { X } from 'lucide-react';
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface ForceSpeakModalProps {
  targetUid: string;
  targetUsername: string;
  targetPfp: string;
  onClose: () => void;
}

export const ForceSpeakModal: React.FC<ForceSpeakModalProps> = ({ targetUid, targetUsername, targetPfp, onClose }) => {
  const [content, setContent] = useState('');

  const handleSend = async () => {
    if (!content) return;
    try {
      await addDoc(collection(db, 'messages'), {
        senderId: targetUid,
        senderUsername: targetUsername,
        senderPfp: targetPfp,
        text: content,
        timestamp: serverTimestamp(),
        type: 'text'
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Force Speak as {targetUsername}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex items-center gap-3 mb-4">
          <img src={targetPfp} className="w-10 h-10 rounded-full" />
          <span className="text-white font-bold">{targetUsername}</span>
        </div>
        
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter message..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white mb-4 h-24"
        />
        
        <button onClick={handleSend} className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors">
          Send Message
        </button>
      </div>
    </div>
  );
};
