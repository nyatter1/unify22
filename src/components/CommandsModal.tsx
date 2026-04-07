import React from 'react';
import { X, Terminal, Coins, Gamepad2, Users, Settings, ShieldAlert } from 'lucide-react';

interface CommandsModalProps {
  onClose: () => void;
  isAdmin: boolean;
}

export const CommandsModal: React.FC<CommandsModalProps> = ({ onClose, isAdmin }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Terminal className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Command Reference</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* Economy & Social */}
          <div>
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Coins className="w-4 h-4" /> Economy & Social
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CommandItem cmd="/bank" desc="Check your current balance" />
              <CommandItem cmd="/pay {user} {amt} {currency}" desc="Send gold or rubies to a user" />
              <CommandItem cmd="/love {user}" desc="Send love to someone" />
              <CommandItem cmd="/hug {user}" desc="Give someone a hug" />
              <CommandItem cmd="/slap {user}" desc="Slap someone" />
              <CommandItem cmd="/kill {user}" desc="Kill someone (in game)" />
            </div>
          </div>

          {/* Gambling */}
          <div>
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" /> Gambling
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CommandItem cmd="/dice {currency} {amt}" desc="Roll dice (4+ wins)" />
              <CommandItem cmd="/allin {currency}" desc="Gamble your entire balance" />
              <CommandItem cmd="/slots {currency} {amt}" desc="Play the slot machine" />
              <CommandItem cmd="/coinflip {currency} {amt} {h|t}" desc="Flip a coin" />
              <CommandItem cmd="/blackjack {currency} {amt}" desc="Play a hand of blackjack" />
              <CommandItem cmd="/roulette {currency} {amt} {bet}" desc="Play roulette (red/black/green/0-36)" />
              <CommandItem cmd="/crash {currency} {amt}" desc="Play crash game" />
              <CommandItem cmd="/highlow {currency} {amt} {h|l}" desc="Guess if next card is higher or lower" />
              <CommandItem cmd="/scratch {currency} {amt}" desc="Scratch a ticket" />
              <CommandItem cmd="/plinko {currency} {amt}" desc="Drop a ball in Plinko" />
              <CommandItem cmd="/mines {currency} {amt} {mines}" desc="Play mines (1-24 mines)" />
              <CommandItem cmd="/tower {currency} {amt}" desc="Climb the tower" />
            </div>
          </div>

          {/* Utility */}
          <div>
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Utility & Fun
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CommandItem cmd="/joke" desc="Tell a random joke" />
              <CommandItem cmd="/fact" desc="Share a random fact" />
              <CommandItem cmd="/weather {city}" desc="Check weather for a city" />
              <CommandItem cmd="/dance" desc="Show off your moves" />
              <CommandItem cmd="/ping" desc="Check your connection latency" />
              <CommandItem cmd="/staff" desc="List online staff members" />
              <CommandItem cmd="/roll {max}" desc="Roll a custom die" />
              <CommandItem cmd="/flip" desc="Flip a coin for fun" />
              <CommandItem cmd="/8ball {question}" desc="Ask the magic 8-ball" />
              <CommandItem cmd="/nudge {user}" desc="Nudge a user" />
              <CommandItem cmd="/trivia" desc="Start a trivia question" />
              <CommandItem cmd="/rps {r|p|s}" desc="Play Rock Paper Scissors" />
            </div>
          </div>

          {/* Admin */}
          {isAdmin && (
            <div>
              <h3 className="text-sm font-bold text-red-400/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Staff & Admin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CommandItem cmd="/announce {msg}" desc="Send a global announcement" admin />
                <CommandItem cmd="/clear" desc="Clear the chat history" admin />
                <CommandItem cmd="/setgold {user} {amt}" desc="Set a user's gold balance" admin />
                <CommandItem cmd="/setrank {user} {rank}" desc="Change a user's rank" admin />
                <CommandItem cmd="/rigged {user}" desc="Rig gambling for a user" admin />
                <CommandItem cmd="/unrigg {user}" desc="Remove rigged status" admin />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const CommandItem = ({ cmd, desc, admin = false }: { cmd: string, desc: string, admin?: boolean }) => (
  <div className={`p-3 rounded-xl border ${admin ? 'bg-red-500/5 border-red-500/10' : 'bg-white/5 border-white/5'} flex flex-col gap-1`}>
    <code className={`text-xs font-mono font-bold ${admin ? 'text-red-400' : 'text-blue-400'}`}>{cmd}</code>
    <span className="text-xs text-white/60">{desc}</span>
  </div>
);
