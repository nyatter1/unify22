import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, Shield, Users, MessageSquare, Settings } from 'lucide-react';
import { UserProfile } from '../../../types';
import { cn } from '../../../lib/utils';

interface AdminPanelModalProps {
  showAdminPanel: boolean;
  setShowAdminPanel: (s: boolean) => void;
  allUsers: UserProfile[];
  handleBroadcast: (msg: string) => void;
  handleGiveGold: (uid: string, amount: number) => void;
  handleGiveRubies: (uid: string, amount: number) => void;
  onMute: (uid: string) => void;
  onKick: (uid: string) => void;
  onBan: (uid: string) => void;
  onUnmute: (uid: string) => void;
  onUnkick: (uid: string) => void;
  onUnban: (uid: string) => void;
}

export const AdminPanelModal = ({
  showAdminPanel,
  setShowAdminPanel,
  allUsers,
  handleBroadcast,
  handleGiveGold,
  handleGiveRubies,
  onMute,
  onKick,
  onBan,
  onUnmute,
  onUnkick,
  onUnban
}: AdminPanelModalProps) => {
  const [broadcastMsg, setBroadcastMsg] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number>(1000);

  return (
    <AnimatePresence>
      {showAdminPanel && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAdminPanel(false)}
            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-zinc-900 border border-red-500/20 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-red-500/10 flex items-center justify-between bg-red-500/5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-red-500/10">
                  <Terminal className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-white">Developer Console</h2>
                  <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">System Administration</p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminPanel(false)}
                className="p-3 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Broadcast Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  System Broadcast
                </h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    placeholder="Enter broadcast message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-red-500/50"
                  />
                  <button
                    onClick={() => {
                      handleBroadcast(broadcastMsg);
                      setBroadcastMsg('');
                    }}
                    className="px-8 rounded-2xl bg-red-500 text-white font-bold uppercase tracking-widest hover:bg-red-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  >
                    Send
                  </button>
                </div>
              </div>

              {/* Economy Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  User Management
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none"
                  >
                    <option value="">Select User...</option>
                    {allUsers.map(u => (
                      <option key={u.uid} value={u.uid}>{u.username}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none"
                    placeholder="Amount..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGiveGold(selectedUser, amount)}
                      className="flex-1 rounded-2xl bg-amber-500 text-black font-bold uppercase tracking-widest hover:bg-amber-400 transition-all text-[10px]"
                    >
                      Gold
                    </button>
                    <button
                      onClick={() => handleGiveRubies(selectedUser, amount)}
                      className="flex-1 rounded-2xl bg-purple-500 text-white font-bold uppercase tracking-widest hover:bg-purple-400 transition-all text-[10px]"
                    >
                      Rubies
                    </button>
                  </div>
                </div>

                {selectedUser && (
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Mute</p>
                      <div className="flex gap-2">
                        <button onClick={() => onMute(selectedUser)} className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-500 font-bold uppercase tracking-widest hover:bg-red-500/30 transition-all text-[10px]">Mute</button>
                        <button onClick={() => onUnmute(selectedUser)} className="flex-1 py-3 rounded-xl bg-green-500/20 text-green-500 font-bold uppercase tracking-widest hover:bg-green-500/30 transition-all text-[10px]">Unmute</button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Kick</p>
                      <div className="flex gap-2">
                        <button onClick={() => onKick(selectedUser)} className="flex-1 py-3 rounded-xl bg-orange-500/20 text-orange-500 font-bold uppercase tracking-widest hover:bg-orange-500/30 transition-all text-[10px]">Kick</button>
                        <button onClick={() => onUnkick(selectedUser)} className="flex-1 py-3 rounded-xl bg-green-500/20 text-green-500 font-bold uppercase tracking-widest hover:bg-green-500/30 transition-all text-[10px]">Unkick</button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Ban</p>
                      <div className="flex gap-2">
                        <button onClick={() => onBan(selectedUser)} className="flex-1 py-3 rounded-xl bg-red-600/20 text-red-600 font-bold uppercase tracking-widest hover:bg-red-600/30 transition-all text-[10px]">Ban</button>
                        <button onClick={() => onUnban(selectedUser)} className="flex-1 py-3 rounded-xl bg-green-500/20 text-green-500 font-bold uppercase tracking-widest hover:bg-green-500/30 transition-all text-[10px]">Unban</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
