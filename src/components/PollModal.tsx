import React, { useState } from 'react';
import { X, Plus, Trash2, Layout, Sparkles, Send, Check } from 'lucide-react';

// --- BORDERS LOGIC (Self-Contained) ---
interface Border {
  id: string;
  name: string;
  category: 'Basic' | 'Special';
  className: string;
}

const BORDERS: Border[] = (() => {
  const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone'];
  const styles = ['solid', 'dashed', 'dotted', 'double'];
  const widths = ['2', '4', '8'];
  const borders: Border[] = [{ id: 'border-none', name: 'None', category: 'Basic', className: '' }];
  let idCounter = 1;
  for (const color of colors) {
    for (const style of styles) {
      for (const width of widths) {
        borders.push({
          id: `border-${idCounter++}`,
          name: `${color.charAt(0).toUpperCase() + color.slice(1)} ${style.charAt(0).toUpperCase() + style.slice(1)} ${width}px`,
          category: 'Basic',
          className: `border-${color}-500 border-${style} border-${width}`
        });
      }
    }
  }
  borders.push(
    { id: 'border-gold-glow', name: 'Gold Glow', category: 'Special', className: 'border-amber-400 border-4 shadow-[0_0_15px_rgba(251,191,36,0.8)]' },
    { id: 'border-neon-pink', name: 'Neon Pink', category: 'Special', className: 'border-pink-500 border-4 shadow-[0_0_20px_rgba(236,72,153,0.8)]' },
    { id: 'border-cyber-blue', name: 'Cyber Blue', category: 'Special', className: 'border-cyan-400 border-[6px] border-double shadow-[0_0_25px_rgba(34,211,238,0.6)]' },
    { id: 'border-toxic', name: 'Toxic Sludge', category: 'Special', className: 'border-lime-500 border-8 border-dotted shadow-[0_0_30px_rgba(132,204,22,0.5)]' },
    { id: 'border-blood', name: 'Blood Moon', category: 'Special', className: 'border-red-600 border-4 shadow-[inset_0_0_20px_rgba(220,38,38,0.8),0_0_20px_rgba(220,38,38,0.8)]' },
    { id: 'border-rainbow', name: 'Rainbow Flow', category: 'Special', className: 'border-transparent border-4 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-border shadow-[0_0_15px_rgba(255,255,255,0.2)]' },
    { id: 'border-glitch', name: 'Glitch', category: 'Special', className: 'border-white border-4 skew-x-2 -rotate-1 shadow-[2px_2px_0_rgba(255,0,0,0.5),-2px_-2px_0_rgba(0,255,255,0.5)]' },
    { id: 'border-void', name: 'The Void', category: 'Special', className: 'border-black border-8 shadow-[0_0_50px_rgba(0,0,0,1)]' },
    { id: 'border-fire-glow', name: 'Fire Glow', category: 'Special', className: 'border-orange-500 border-4 shadow-[0_0_20px_rgba(249,115,22,0.8),inset_0_0_10px_rgba(249,115,22,0.5)] animate-pulse' },
    { id: 'border-ice-shards', name: 'Ice Shards', category: 'Special', className: 'border-sky-300 border-[6px] border-double shadow-[0_0_15px_rgba(186,230,253,0.6)]' },
    { id: 'border-event-horizon', name: 'Event Horizon', category: 'Special', className: 'border-black border-4 shadow-[0_0_30px_10px_rgba(76,29,149,0.4)] animate-pulse' },
    { id: 'border-stardust', name: 'Stardust Sparkle', category: 'Special', className: 'border-slate-800 border-2 shadow-[0_0_10px_#fff,inset_0_0_10px_#fff] opacity-90' },
    { id: 'border-magma', name: 'Magma Core', category: 'Special', className: 'border-stone-900 border-4 shadow-[inset_0_0_15px_#f97316,0_0_15px_#ef4444] animate-pulse' },
    { id: 'border-comic-pop', name: 'Comic Pop', category: 'Special', className: 'border-black border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]' },
    { id: 'border-vaporwave', name: 'Vaporwave Sunset', category: 'Special', className: 'border-4 border-t-fuchsia-500 border-r-cyan-400 border-b-purple-500 border-l-yellow-400 shadow-[0_0_15px_#f0abfc]' },
    { id: 'border-heartbeat', name: 'Heartbeat Pulse', category: 'Special', className: 'border-red-500 border-4 animate-[pulse_1s_infinite] shadow-[0_0_15px_rgba(239,68,68,0.5)]' }
  );
  return borders;
})();

// --- POLL MODAL COMPONENT ---
interface PollModalProps {
  onClose: () => void;
  currentUser: any;
  onSend?: (pollData: any) => void;
}

export const PollModal: React.FC<PollModalProps> = ({ onClose, currentUser, onSend }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [selectedBorderId, setSelectedBorderId] = useState('border-neon-pink');
  const [isLaunching, setIsLaunching] = useState(false);

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
    // Validation
    if (!question.trim() || options.some(o => !o.trim())) return;
    
    setIsLaunching(true);
    
    // Construct the poll object
    const pollData = {
      type: 'poll', // Explicit type for Chat.tsx to identify the message
      question: question.trim(),
      options: options.map((o, idx) => ({ 
        id: `opt-${idx}-${Date.now()}`,
        text: o.trim(), 
        votes: [] // Store UIDs of voters to prevent double voting
      })),
      theme: activeBorder.className,
      createdBy: currentUser?.uid || 'anonymous',
      creatorName: currentUser?.displayName || 'Anonymous',
      createdAt: new Date().toISOString(),
      totalVotes: 0
    };

    // Simulate a brief delay for "Launching" effect
    setTimeout(() => {
      if (onSend) {
        onSend(pollData); // This passes the data to the handleSendMessage or equivalent in Chat.tsx
      }
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500 text-zinc-300">
      <div className={`relative bg-zinc-950 rounded-[2.5rem] p-1.5 w-full max-w-md shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out ${activeBorder.className} ${isLaunching ? 'scale-95 opacity-50 blur-sm' : 'scale-100'}`}>
        <div className="bg-zinc-950 rounded-[2.3rem] p-8 overflow-hidden relative">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />

          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Premium Polls</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter leading-none">CREATE<br/>VOTE.</h2>
            </div>
            <button 
              onClick={onClose} 
              className="group p-3 bg-white/5 hover:bg-red-500/20 rounded-2xl text-white/40 hover:text-red-500 transition-all active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-8 group">
            <div className="flex justify-between items-center mb-3 px-1">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Question</label>
              <span className={`text-[10px] font-bold transition-colors ${question.length > 50 ? 'text-amber-500' : 'text-zinc-700'}`}>
                {question.length} chars
              </span>
            </div>
            <textarea 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-zinc-900/50 border-2 border-white/5 rounded-3xl p-5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all resize-none h-28 text-xl font-bold leading-tight"
            />
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center mb-1 px-1">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Options</label>
              <span className="text-[10px] font-bold text-zinc-700">{options.length}/6</span>
            </div>
            
            {options.map((o, i) => (
              <div key={i} className="group relative flex items-center" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="absolute left-4 flex items-center justify-center w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-zinc-500">
                  {i + 1}
                </div>
                <input 
                  value={o}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[i] = e.target.value;
                    setOptions(newOptions);
                  }}
                  placeholder={`Choice ${i + 1}`}
                  className="w-full bg-zinc-900/50 border-2 border-white/5 rounded-2xl p-4 pl-14 pr-12 text-white placeholder:text-zinc-800 focus:outline-none focus:border-white/10 focus:bg-zinc-900 transition-all font-semibold"
                />
                {options.length > 2 && (
                  <button 
                    onClick={() => handleRemoveOption(i)}
                    className="absolute right-4 p-1.5 text-zinc-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {options.length < 6 && (
              <button 
                onClick={handleAddOption}
                className="group w-full py-4 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/5 text-zinc-600 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-sm font-bold active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> 
                Add another choice
              </button>
            )}
          </div>

          <div className="mb-10 p-4 bg-white/5 rounded-3xl border border-white/5">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-300">Poll Theme</span>
                </div>
                <span className="text-[10px] font-black text-amber-500/80 px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-500/20">PREMIUM</span>
             </div>
             
             <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar snap-x">
                {specialBorders.map((border) => (
                  <button
                    key={border.id}
                    onClick={() => setSelectedBorderId(border.id)}
                    className={`relative flex-shrink-0 w-12 h-12 rounded-xl transition-all snap-center ${border.className} ${selectedBorderId === border.id ? 'scale-110 ring-2 ring-white z-10' : 'scale-90 opacity-40 hover:opacity-100 hover:scale-100'}`}
                  >
                    {selectedBorderId === border.id && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-lg">
                        <Check className="w-2.5 h-2.5 text-black" />
                      </div>
                    )}
                  </button>
                ))}
             </div>
          </div>

          <button 
            onClick={handleCreatePoll} 
            disabled={!question.trim() || options.some(o => !o.trim()) || isLaunching}
            className={`group relative w-full py-6 rounded-[2rem] flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] transition-all overflow-hidden
              ${(!question.trim() || options.some(o => !o.trim()) || isLaunching) 
                ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed border border-white/5' 
                : 'bg-white text-black hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]'
              }`}
          >
            {isLaunching ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                <span>Launching...</span>
              </div>
            ) : (
              <>
                Launch Poll
                <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </>
            )}
          </button>

        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

// Fixed export to maintain compatibility with both named and default imports
export const App = PollModal;
export default PollModal;
