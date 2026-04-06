import React, { useState } from 'react';
import { X, Plus, Trash2, Layout, Sparkles, Send } from 'lucide-react';
import { BORDERS } from './borders';

interface PollModalProps {
  onClose: () => void;
  currentUser: any;
  onSend?: (pollData: any) => void; // Assuming you pass a send handler
}

export const PollModal: React.FC<PollModalProps> = ({ onClose, currentUser, onSend }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [selectedBorderId, setSelectedBorderId] = useState('border-neon-cyan');
  const [showThemes, setShowThemes] = useState(false);

  // Filter only special/fun borders for the "Premium" look
  const specialBorders = BORDERS.filter(b => b.category === 'Special');

  const activeBorder = BORDERS.find(b => b.id === selectedBorderId) || BORDERS[0];

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleCreatePoll = async () => {
    if (!question || options.some(o => !o)) return;
    
    const pollData = {
      question,
      options: options.map(o => ({ text: o, votes: 0 })),
      theme: activeBorder.className,
      createdAt: new Date().toISOString()
    };

    // In a real app, you'd insert to your DB here (Supabase/Firestore)
    // For this example, we call the onSend prop if it exists
    if (onSend) {
      onSend(pollData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`relative bg-zinc-900 rounded-3xl p-1 w-full max-w-md shadow-2xl transition-all duration-500 ${activeBorder.className}`}>
        <div className="bg-zinc-900 rounded-[1.4rem] p-6">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">New Poll</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Question Input */}
          <div className="mb-6">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-2 block">The Question</label>
            <textarea 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What are we deciding?"
              className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all resize-none h-24 text-lg font-medium"
            />
          </div>

          {/* Options List */}
          <div className="space-y-3 mb-6">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 block">Choices</label>
            {options.map((o, i) => (
              <div key={i} className="group relative flex items-center animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                <input 
                  value={o}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[i] = e.target.value;
                    setOptions(newOptions);
                  }}
                  placeholder={`Option ${i + 1}`}
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-3.5 pr-12 text-white placeholder:text-zinc-700 focus:outline-none focus:bg-black/60 focus:border-white/20 transition-all"
                />
                {options.length > 2 && (
                  <button 
                    onClick={() => handleRemoveOption(i)}
                    className="absolute right-3 p-1.5 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {options.length < 6 && (
              <button 
                onClick={handleAddOption}
                className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 text-zinc-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all text-sm font-bold"
              >
                <Plus className="w-4 h-4" /> Add Option
              </button>
            )}
          </div>

          {/* Theme Selector Toggle */}
          <div className="mb-8">
             <button 
                onClick={() => setShowThemes(!showThemes)}
                className="flex items-center gap-2 text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors"
             >
                <Layout className="w-4 h-4" />
                {showThemes ? "Hide Themes" : "Customize Theme"}
             </button>

             {showThemes && (
               <div className="grid grid-cols-5 gap-2 mt-4 max-h-32 overflow-y-auto p-2 bg-black/20 rounded-xl custom-scrollbar">
                  {specialBorders.map((border) => (
                    <button
                      key={border.id}
                      onClick={() => setSelectedBorderId(border.id)}
                      title={border.name}
                      className={`h-10 rounded-lg transition-all ${border.className} ${selectedBorderId === border.id ? 'scale-110 ring-2 ring-white' : 'scale-90 hover:scale-100 opacity-60 hover:opacity-100'}`}
                    />
                  ))}
               </div>
             )}
          </div>

          {/* Action Button */}
          <button 
            onClick={handleCreatePoll} 
            disabled={!question || options.some(o => !o)}
            className={`group w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all
              ${(!question || options.some(o => !o)) 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-amber-400 hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5'
              }`}
          >
            Launch Poll
            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>

        </div>
      </div>
    </div>
  );
};
