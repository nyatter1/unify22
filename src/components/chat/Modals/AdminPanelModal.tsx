import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, Shield, Users, MessageSquare, Settings, Coins, Gem } from 'lucide-react';
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
  onSetRank: (uid: string, rank: string) => void;
  onClearChat: () => void;
  onResetStats: (uid: string) => void;
  onForceSpeak: (uid: string, text: string) => void;
  onUpdateUserField: (uid: string, field: string, value: any) => void;
  onToggleMaintenance: () => void;
  onSetGlobalTheme: (theme: string) => void;
  bannedWords: string[];
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
  onUnban,
  onSetRank,
  onClearChat,
  onResetStats,
  onForceSpeak,
  onUpdateUserField,
  onToggleMaintenance,
  onSetGlobalTheme,
  bannedWords
}: AdminPanelModalProps) => {
  const [broadcastMsg, setBroadcastMsg] = React.useState('');
  const [selectedUser, setSelectedUser] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number>(1000);
  const [forceSpeakText, setForceSpeakText] = React.useState('');
  const [newUsername, setNewUsername] = React.useState('');
  const [newRank, setNewRank] = React.useState('VIP');
  const [activeTab, setActiveTab] = React.useState<'users' | 'system' | 'economy'>('system');
  const [selectedGlobalTheme, setSelectedGlobalTheme] = React.useState('luxury-black');

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
            className="relative w-full max-w-5xl bg-zinc-900 border border-red-500/20 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-red-500/10 flex items-center justify-between bg-red-500/5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-red-500/10">
                  <Terminal className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-white">Developer Console</h2>
                  <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">System Administration v2.0</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('system')}
                  className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", activeTab === 'system' ? "bg-red-500 text-white" : "text-white/40 hover:text-white")}
                >
                  System
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", activeTab === 'users' ? "bg-red-500 text-white" : "text-white/40 hover:text-white")}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('economy')}
                  className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", activeTab === 'economy' ? "bg-red-500 text-white" : "text-white/40 hover:text-white")}
                >
                  Economy
                </button>
                <button
                  onClick={() => setShowAdminPanel(false)}
                  className="p-3 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all ml-4"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {activeTab === 'system' && (
                <div className="space-y-8">
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

                  {/* System Tools */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      System Tools
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={onClearChat}
                        className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-red-500/50 transition-all group text-left"
                      >
                        <p className="text-sm font-bold text-white group-hover:text-red-500 transition-colors">Prune Chat</p>
                        <p className="text-[10px] text-white/40 mt-1">Delete messages older than 24h</p>
                      </button>
                      <button
                        onClick={onToggleMaintenance}
                        className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all group text-left"
                      >
                        <p className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">Maintenance</p>
                        <p className="text-[10px] text-white/40 mt-1">Toggle global maintenance mode</p>
                      </button>
                      <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all group text-left space-y-3">
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-cyan-500 transition-colors">Global Theme</p>
                          <p className="text-[10px] text-white/40 mt-1">Set a theme for all users</p>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={selectedGlobalTheme}
                            onChange={(e) => setSelectedGlobalTheme(e.target.value)}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl p-2 text-[10px] text-white appearance-none"
                          >
                            <option value="luxury-black" className="bg-zinc-900 text-white">Luxury Black</option>
                            <option value="royal-gold" className="bg-zinc-900 text-white">Royal Gold</option>
                            <option value="midnight-blue" className="bg-zinc-900 text-white">Midnight Blue</option>
                            <option value="emerald-city" className="bg-zinc-900 text-white">Emerald City</option>
                            <option value="crimson-blood" className="bg-zinc-900 text-white">Crimson Blood</option>
                            <option value="cyber-neon" className="bg-zinc-900 text-white">Cyber Neon</option>
                          </select>
                          <button
                            onClick={() => onSetGlobalTheme(selectedGlobalTheme)}
                            className="px-3 py-2 rounded-xl bg-cyan-500 text-white text-[10px] font-bold uppercase"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Banned Words Section */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Banned Words & Links
                    </h3>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        id="new-banned-word"
                        placeholder="Enter word or link to ban..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-red-500/50"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = e.currentTarget.value.trim();
                            if (val) {
                              onUpdateUserField('BANNED_WORDS_ADD', 'bannedWords', val);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('new-banned-word') as HTMLInputElement;
                          if (input && input.value.trim()) {
                            onUpdateUserField('BANNED_WORDS_ADD', 'bannedWords', input.value.trim());
                            input.value = '';
                          }
                        }}
                        className="px-8 rounded-2xl bg-red-500 text-white font-bold uppercase tracking-widest hover:bg-red-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                      >
                        Add
                      </button>
                    </div>

                    {/* Banned Words List */}
                    <div className="flex flex-wrap gap-2">
                      {bannedWords.length > 0 ? (
                        bannedWords.map((word, idx) => (
                          <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg group">
                            <span className="text-[10px] text-red-500 font-bold">{word}</span>
                            <button 
                              onClick={() => onUpdateUserField('BANNED_WORDS_REMOVE', 'bannedWords', word)}
                              className="p-1 hover:bg-red-500/20 rounded transition-colors"
                            >
                              <X className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-white/20 italic">No banned words set.</p>
                      )}
                    </div>
                    
                    <p className="text-[10px] text-white/40 italic">Note: Banned words are stored in the BANNED_WORDS rank permissions. Add words above and they will be blocked in chat.</p>
                  </div>
                </div>
              )}

              {activeTab === 'economy' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <Coins className="w-4 h-4" />
                      Economy Management
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none appearance-none"
                      >
                        <option value="" className="bg-zinc-900 text-white">Select User...</option>
                        {allUsers.map(u => (
                          <option key={u.uid} value={u.uid} className="bg-zinc-900 text-white">{u.username}</option>
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
                          Give Gold
                        </button>
                        <button
                          onClick={() => handleGiveRubies(selectedUser, amount)}
                          className="flex-1 rounded-2xl bg-purple-500 text-white font-bold uppercase tracking-widest hover:bg-purple-400 transition-all text-[10px]"
                        >
                          Give Rubies
                        </button>
                      </div>
                    </div>
                    {selectedUser && (
                       <button
                         onClick={() => onResetStats(selectedUser)}
                         className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all text-xs"
                       >
                         Reset All Stats (Gold, Rubies, XP, Level)
                       </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      User Moderation
                    </h3>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none appearance-none"
                    >
                      <option value="" className="bg-zinc-900 text-white">Select User...</option>
                      {allUsers.map(u => (
                        <option key={u.uid} value={u.uid} className="bg-zinc-900 text-white">{u.username}</option>
                      ))}
                    </select>

                    {selectedUser && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
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

                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Rank Management</p>
                            <div className="flex gap-2">
                              <select
                                value={newRank}
                                onChange={(e) => setNewRank(e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white appearance-none"
                              >
                                <option value="VIP" className="bg-zinc-900 text-white">VIP</option>
                                <option value="STAR" className="bg-zinc-900 text-white">STAR</option>
                                <option value="MODERATOR" className="bg-zinc-900 text-white">MODERATOR</option>
                                <option value="ADMINISTRATION" className="bg-zinc-900 text-white">ADMINISTRATION</option>
                                <option value="FOUNDER" className="bg-zinc-900 text-white">FOUNDER</option>
                                <option value="DEVELOPER" className="bg-zinc-900 text-white">DEVELOPER</option>
                              </select>
                              <button
                                onClick={() => onSetRank(selectedUser, newRank)}
                                className="px-6 rounded-xl bg-cyan-500 text-white font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all text-[10px]"
                              >
                                Set Rank
                              </button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Force Speak</p>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={forceSpeakText}
                                onChange={(e) => setForceSpeakText(e.target.value)}
                                placeholder="Make user say..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white"
                              />
                              <button
                                onClick={() => {
                                  onForceSpeak(selectedUser, forceSpeakText);
                                  setForceSpeakText('');
                                }}
                                className="px-6 rounded-xl bg-pink-500 text-white font-bold uppercase tracking-widest hover:bg-pink-400 transition-all text-[10px]"
                              >
                                Speak
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Profile Overrides</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="New Username..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white"
                              />
                              <button
                                onClick={() => onUpdateUserField(selectedUser, 'username', newUsername)}
                                className="px-4 rounded-xl bg-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/20 transition-all text-[10px]"
                              >
                                Update
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                const url = prompt('Enter PFP URL:');
                                if (url) onUpdateUserField(selectedUser, 'pfp', url);
                              }}
                              className="py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-[10px]"
                            >
                              Set PFP URL
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
