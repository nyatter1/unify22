import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { ProfileRating } from '../types';
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface RatingModalProps {
  targetUid: string;
  targetUsername: string;
  currentUser: any;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ targetUid, targetUsername, currentUser, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'ratings'), {
        targetUid,
        authorUid: currentUser.uid,
        authorUsername: currentUser.username,
        authorPfp: currentUser.pfp,
        rating,
        comment,
        timestamp: serverTimestamp()
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
          <h2 className="text-lg font-bold text-white">Rate {targetUsername}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star 
              key={s} 
              className={cn("w-8 h-8 cursor-pointer", s <= rating ? "text-amber-500 fill-amber-500" : "text-white/20")}
              onClick={() => setRating(s)}
            />
          ))}
        </div>
        
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white mb-4 h-24"
        />
        
        <button onClick={handleSubmit} className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors">
          Send Rating
        </button>
      </div>
    </div>
  );
};
