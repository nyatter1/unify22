import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../supabase';

interface PollModalProps {
  onClose: () => void;
  currentUser: any;
}

export const PollModal: React.FC<PollModalProps> = ({ onClose, currentUser }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleCreatePoll = async () => {
    if (!question || options.some(o => !o)) return;
    try {
      const { error } = await supabase.from('messages').insert({
        senderId: currentUser.uid,
        senderUsername: currentUser.username,
        senderPfp: currentUser.pfp,
        text: `Poll: ${question}`,
        type: 'poll',
        pollData: {
          question,
          options: options.map(o => ({ text: o, votes: 0 }))
        },
        timestamp: new Date().toISOString()
      });
      if (error) throw error;
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">Create Poll</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <input 
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Poll question..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white mb-4"
        />
        
        {options.map((o, i) => (
          <input 
            key={i}
            value={o}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[i] = e.target.value;
              setOptions(newOptions);
            }}
            placeholder={`Option ${i + 1}`}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white mb-2"
          />
        ))}
        
        <button onClick={handleCreatePoll} className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors">
          Create Poll
        </button>
      </div>
    </div>
  );
};
