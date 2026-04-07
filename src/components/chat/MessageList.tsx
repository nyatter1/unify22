import React from 'react';
import { motion } from 'motion/react';
import { BarChart2, Shield, Volume2, VolumeX, Send, Coins, Gem } from 'lucide-react';
import Markdown from 'react-markdown';
import { Message, UserProfile } from '../../types';
import { RANKS, BORDERS, DEFAULT_PFP } from '../../constants';
import { cn } from '../../lib/utils';
import { supabase } from '../../supabase';

interface MessageListProps {
  messages: Message[];
  user: UserProfile;
  allUsers: UserProfile[];
  currentTheme: any;
  handleProfileClick: (uid: string) => void;
  handleVote: (messageId: string, optionIndex: number) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  DiceIcons: any[];
}

export const MessageList = ({
  messages,
  user,
  allUsers,
  currentTheme,
  handleProfileClick,
  handleVote,
  scrollRef,
  DiceIcons
}: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 space-y-8 custom-scrollbar">
      {messages.map((msg, i) => {
        const isMe = msg.senderId === user.uid;

        if (msg.type === 'poll' && msg.pollData) {
          const totalVotes = msg.pollData.options.reduce((acc, o) => acc + o.votes, 0);
          const hasVoted = msg.pollData.options.some(o => o.voters?.includes(user.uid));

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={msg.id || i}
              className={cn(
                "flex flex-col items-center justify-center py-8 px-6 max-w-md mx-auto w-full text-center space-y-6 shadow-2xl transition-all",
                currentTheme.customStyles?.glassEffect ? "backdrop-blur-2xl bg-black/20" : "bg-zinc-900/80 backdrop-blur-md",
                currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
                currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
              )}
              style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
            >
              <div className="flex flex-col items-center gap-2">
                <BarChart2 className="w-8 h-8 text-amber-500" />
                <h3 className="text-xl font-bold text-white">{msg.pollData.question}</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Created by {msg.senderUsername}</p>
              </div>

              <div className="w-full space-y-3">
                {msg.pollData.options.map((opt, idx) => {
                  const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                  return (
                    <button
                      key={idx}
                      disabled={hasVoted}
                      onClick={() => handleVote(msg.id, idx)}
                      className={cn(
                        "w-full relative h-12 rounded-xl overflow-hidden border transition-all",
                        hasVoted ? "border-white/5 bg-white/5 cursor-default" : "border-white/10 bg-black/40 hover:border-amber-500/50"
                      )}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-amber-500/20 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative h-full flex items-center justify-between px-4 text-sm font-bold">
                        <span className="text-white/80">{opt.text}</span>
                        <span className="text-amber-500">{percentage}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">{totalVotes} Total Votes</p>
            </motion.div>
          );
        }

        if (msg.type === 'system') {
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={msg.id || i}
              className="flex justify-center my-4"
            >
              <div className="bg-white/10 text-white/60 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md border border-white/5">
                {msg.text}
              </div>
            </motion.div>
          );
        }

        if (msg.type === 'gamble_allin' || msg.type === 'gamble_dice') {
          const data = msg.gambleData!;
          const DiceIcon = data.diceRoll ? DiceIcons[data.diceRoll - 1] : null;

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={msg.id || i}
              className={cn(
                "flex flex-col items-center justify-center py-8 px-4 max-w-2xl mx-auto w-full text-center space-y-4 transition-all",
                currentTheme.customStyles?.glassEffect ? "backdrop-blur-2xl bg-black/20" : "bg-black/40 backdrop-blur-md",
                currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
                currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
              )}
              style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
            >
              <p className="text-xs font-bold text-amber-500 uppercase tracking-[0.3em]">{msg.senderUsername} did {msg.type === 'gamble_allin' ? '/allin' : '/dice'}</p>
              <img
                src={msg.senderPfp}
                onClick={() => handleProfileClick(msg.senderId)}
                className="w-20 h-20 rounded-full border-2 border-white/20 shadow-2xl cursor-pointer hover:scale-105 transition-transform"
              />

              {DiceIcon && (
                <div className="p-4 bg-black/40 rounded-2xl border border-white/10">
                  <DiceIcon className="w-12 h-12 text-amber-500" />
                </div>
              )}

              <div className={cn(
                "text-3xl font-serif italic tracking-wider uppercase",
                data.result === 'won' ? "text-green-400" : "text-red-400"
              )}>
                {data.result === 'won' ? 'Won' : 'Lost'}
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span>All-in:</span>
                  <span className="font-bold">{data.amount.toLocaleString()}</span>
                  {data.currency === 'gold' ? <Coins className="w-4 h-4" /> : <Gem className="w-4 h-4" />}
                </div>
                <div className={cn(
                  "text-xl font-bold flex items-center gap-2",
                  data.result === 'won' ? "text-amber-400" : "text-white/20"
                )}>
                  <span>{data.result === 'won' ? '+' : '-'}{data.winAmount.toLocaleString()}</span>
                  {data.currency === 'gold' ? <Coins className="w-5 h-5" /> : <Gem className="w-5 h-5" />}
                </div>
                {data.result === 'won' && (
                  <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-2">
                    Multiplier: x{data.multiplier}
                  </div>
                )}
              </div>
            </motion.div>
          );
        }

        if (msg.type === 'nudge' || msg.senderUsername === 'SYSTEM') {
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={msg.id || i}
              className="flex justify-center my-4"
            >
              <div className={cn(
                "px-6 py-3 rounded-2xl text-sm font-bold shadow-[0_0_30px_rgba(245,158,11,0.2)] max-w-[80%] text-center",
                (msg.senderUsername === 'SYSTEM' || msg.senderUsername === 'BROADCAST') ? "bg-amber-500/20 text-amber-500 border border-amber-500/30 animate-pulse" : "bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-bounce"
              )}>
                {(msg.senderUsername === 'SYSTEM' || msg.senderUsername === 'BROADCAST') ? (
                  <div className="markdown-body">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                ) : msg.text}
              </div>
            </motion.div>
          );
        }

        const msgUser = allUsers.find(u => u.uid === msg.senderId);
        const userBorder = msgUser?.border ? BORDERS.find(b => b.id === msgUser.border) : null;

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id || i}
            className={cn("flex gap-4 max-w-[85%] group", isMe ? "ml-auto flex-row-reverse" : "mr-auto")}
          >
            <div className="relative flex-shrink-0">
              <img
                src={msg.senderPfp || allUsers.find(u => u.uid === msg.senderId)?.pfp || DEFAULT_PFP}
                onClick={() => handleProfileClick(msg.senderId)}
                className={cn(
                  "w-10 h-10 rounded-full object-cover shadow-lg cursor-pointer hover:scale-105 transition-transform relative z-10",
                  userBorder && userBorder.id !== 'border-none' ? userBorder.className : "border border-white/20"
                )}
              />
              {msg.senderId === 'admin' && <Shield className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 z-20" />}
            </div>
            <div className={cn("space-y-1.5", isMe ? "items-end" : "items-start")}>
              <div className={cn("flex items-center gap-2 px-1", isMe && "flex-row-reverse")}>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{msg.senderUsername}</p>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/10 text-white/40">
                  Lv.{allUsers.find(u => u.uid === msg.senderId)?.level || 1}
                </span>
                {(msg.senderRank || allUsers.find(u => u.uid === msg.senderId)?.rank) && (
                  <img
                    src={allUsers.find(u => u.uid === msg.senderId)?.customRank?.icon || RANKS.find(r => r.id === (msg.senderRank || allUsers.find(u => u.uid === msg.senderId)?.rank || 'VIP'))?.icon || ''}
                    className="w-3.5 h-3.5 object-contain"
                    alt="rank"
                  />
                )}
              </div>
              <div
                className={cn(
                  "px-5 py-3 shadow-2xl relative overflow-hidden transition-all",
                  isMe ? "rounded-tr-none bg-white text-black font-medium" : "rounded-tl-none bg-black/60 border border-white/10 text-white/80 backdrop-blur-md",
                  currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-2xl",
                  !isMe && currentTheme.customStyles?.glassEffect && "backdrop-blur-2xl bg-black/20",
                  !isMe && currentTheme.customStyles?.borderStyle && "border-none"
                )}
                style={{
                  border: !isMe && currentTheme.customStyles?.borderStyle ? currentTheme.customStyles.borderStyle : undefined,
                  fontFamily: currentTheme.customStyles?.fontFamily === 'serif' ? 'serif' : currentTheme.customStyles?.fontFamily === 'mono' ? 'monospace' : 'inherit'
                }}
              >
                <div className="text-sm leading-relaxed prose prose-invert max-w-none [&_p]:m-0 [&_pre]:bg-black/20 [&_pre]:p-2 [&_pre]:rounded-lg [&_code]:bg-black/20 [&_code]:px-1 [&_code]:rounded">
                  <Markdown>{msg.text}</Markdown>
                </div>

                {/* Reactions */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(msg.reactions).map(([emoji, users]) => (
                      <button
                        key={emoji}
                        onClick={async () => {
                          const currentReactions = msg.reactions || {};
                          const userList = currentReactions[emoji] || [];

                          let newUserList;
                          if (userList.includes(user.uid)) {
                            newUserList = userList.filter(id => id !== user.uid);
                          } else {
                            newUserList = [...userList, user.uid];
                          }

                          const newReactions = { ...currentReactions };
                          if (newUserList.length === 0) {
                            delete newReactions[emoji];
                          } else {
                            newReactions[emoji] = newUserList;
                          }

                          await supabase.from('messages').update({ reactions: newReactions }).eq('id', msg.id);
                        }}
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs flex items-center gap-1 transition-colors",
                          users.includes(user.uid) ? "bg-white/20 text-white" : "bg-black/20 text-white/60 hover:bg-white/10"
                        )}
                      >
                        <span>{emoji}</span>
                        <span className="text-[10px]">{users.length}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reaction Picker (Simple implementation) */}
              <div className={cn("opacity-0 group-hover:opacity-100 transition-opacity flex gap-1", isMe ? "flex-row-reverse" : "flex-row")}>
                {['👍', '❤️', '😂', '😮', '😢', '🔥'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={async () => {
                      const currentReactions = msg.reactions || {};
                      const userList = currentReactions[emoji] || [];
                      if (!userList.includes(user.uid)) {
                        await supabase.from('messages').update({
                          reactions: {
                            ...currentReactions,
                            [emoji]: [...userList, user.uid]
                          }
                        }).eq('id', msg.id);
                      }
                    }}
                    className="w-6 h-6 rounded-full bg-black/40 hover:bg-white/20 flex items-center justify-center text-xs transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
      <div ref={scrollRef} />
    </div>
  );
};
