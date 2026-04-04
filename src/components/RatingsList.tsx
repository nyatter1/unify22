import React, { useState, useEffect } from 'react';
import { Star, X, Trash2, Edit3, Check } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { ProfileRating } from '../types';
import { cn } from '../lib/utils';

interface RatingsListProps {
  targetUid: string;
  currentUserUid: string;
  onClose: () => void;
}

export const RatingsList: React.FC<RatingsListProps> = ({ targetUid, currentUserUid, onClose }) => {
  const [ratings, setRatings] = useState<ProfileRating[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'ratings'),
      where('targetUid', '==', targetUid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProfileRating[];
      setRatings(data);
    });

    return () => unsubscribe();
  }, [targetUid]);

  const handleUpdate = async (id: string) => {
    try {
      await updateDoc(doc(db, 'ratings', id), {
        rating: editRating,
        comment: editComment
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'ratings', id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Profile Ratings</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {ratings.length === 0 ? (
            <p className="text-center text-white/40 py-8 italic">No ratings yet.</p>
          ) : (
            ratings.map((r) => (
              <div key={r.id} className="bg-black/40 border border-white/5 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <img src={r.authorPfp} className="w-8 h-8 rounded-full border border-white/10" />
                    <div>
                      <p className="text-sm font-bold text-white">{r.authorUsername}</p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={cn("w-3 h-3", s <= (editingId === r.id ? editRating : r.rating) ? "text-amber-500 fill-amber-500" : "text-white/20")}
                            onClick={() => editingId === r.id && setEditRating(s)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {r.authorUid === currentUserUid && (
                    <div className="flex gap-2">
                      {editingId === r.id ? (
                        <button onClick={() => handleUpdate(r.id)} className="text-green-500 hover:text-green-400"><Check className="w-4 h-4" /></button>
                      ) : (
                        <button onClick={() => {
                          setEditingId(r.id);
                          setEditRating(r.rating);
                          setEditComment(r.comment);
                        }} className="text-white/40 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => handleDelete(r.id)} className="text-red-500/60 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
                
                {editingId === r.id ? (
                  <textarea 
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-sm text-white mt-2 h-20"
                  />
                ) : (
                  <p className="text-sm text-white/70 leading-relaxed">{r.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
