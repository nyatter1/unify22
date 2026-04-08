import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Send, ArrowLeft } from 'lucide-react';
import { UserProfile, Message } from '../../../types';
import { supabase } from '../../../supabase';
import { cn } from '../../../lib/utils';
import { DEFAULT_PFP } from '../../../constants';
import ReactMarkdown from 'react-markdown';

interface InboxModalProps {
  showInbox: boolean;
  setShowInbox: (s: boolean) => void;
  user: UserProfile;
  allUsers: UserProfile[];
  privateMessages: Message[];
  currentTheme: any;
  getCardStyles: (u: UserProfile) => any;
  initialActiveChat?: string | null;
  setInitialActiveChat?: (s: string | null) => void;
}

export const InboxModal = ({
  showInbox,
  setShowInbox,
  user,
  allUsers,
  privateMessages,
  currentTheme,
  getCardStyles,
  initialActiveChat,
  setInitialActiveChat
}: InboxModalProps) => {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  useEffect(() => {
    if (initialActiveChat && showInbox) {
      setActiveChat(initialActiveChat);
      if (setInitialActiveChat) setInitialActiveChat(null);
    }
  }, [initialActiveChat, showInbox, setInitialActiveChat]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group messages by conversation partner
  const conversations = React.useMemo(() => {
    const map = new Map<string, Message[]>();
    privateMessages.forEach(msg => {
      const partnerId = msg.senderId === user.uid ? msg.recipientId : msg.senderId;
      if (!partnerId) return;
      if (!map.has(partnerId)) map.set(partnerId, []);
      map.get(partnerId)!.push(msg);
    });
    return Array.from(map.entries()).map(([partnerId, msgs]) => ({
      partnerId,
      partner: allUsers.find(u => u.uid === partnerId),
      messages: msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      lastMessage: msgs[msgs.length - 1]
    })).sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
  }, [privateMessages, user.uid, allUsers]);

  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allUsers.filter(u => u.uid !== user.uid && u.username.toLowerCase().includes(query));
  }, [searchQuery, allUsers, user.uid]);

  const activeConversation = conversations.find(c => c.partnerId === activeChat);

  useEffect(() => {
    if (showInbox) {
      const unreadMsgs = privateMessages.filter(m => m.recipientId === user.uid && !m.read);
      if (unreadMsgs.length > 0) {
        const updateReadStatus = async () => {
          for (const msg of unreadMsgs) {
            await supabase.from('messages').update({ read: true }).eq('id', msg.id);
          }
        };
        updateReadStatus();
      }
    }
  }, [showInbox, privateMessages, user.uid]);

  useEffect(() => {
    if (activeChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat, privateMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const msgText = newMessage.trim();
    setNewMessage('');

    await supabase.from('messages').insert({
      senderId: user.uid,
      senderUsername: user.username,
      senderPfp: user.pfp,
      senderRank: user.rank,
      recipientId: activeChat,
      text: msgText,
      timestamp: new Date().toISOString(),
      type: 'text'
    });
  };

  return (
    <AnimatePresence>
      {showInbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInbox(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl",
              currentTheme.customStyles?.glassEffect ? "backdrop-blur-2xl bg-black/40" : "bg-zinc-900",
              currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
              currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
            )}
            style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-black/20">
              <div className="flex items-center gap-3">
                {activeChat && (
                  <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Inbox</h2>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Private Messages</p>
                </div>
              </div>
              <button
                onClick={() => setShowInbox(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Conversations List */}
              <div className={cn(
                "w-full md:w-1/3 border-r border-white/10 flex flex-col bg-black/20",
                activeChat ? "hidden md:flex" : "flex"
              )}>
                <div className="p-3 border-b border-white/10">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {searchQuery.trim() ? (
                    searchResults.length === 0 ? (
                      <div className="p-8 text-center text-white/40 text-sm">
                        No users found.
                      </div>
                    ) : (
                      searchResults.map(u => {
                        const { className, style, textClass } = getCardStyles(u);
                        return (
                          <button
                            key={u.uid}
                            onClick={() => {
                              setActiveChat(u.uid);
                              setSearchQuery('');
                            }}
                            className="w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 hover:bg-white/5"
                          >
                            <img src={u.pfp || DEFAULT_PFP} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                            <div className="flex-1 min-w-0">
                              <span className={cn("text-sm font-bold truncate", textClass)} style={style}>{u.username}</span>
                            </div>
                          </button>
                        );
                      })
                    )
                  ) : conversations.length === 0 ? (
                    <div className="p-8 text-center text-white/40 text-sm">
                      No private messages yet.
                    </div>
                  ) : (
                    conversations.map(conv => {
                      const partner = conv.partner;
                      const { className, style, textClass } = partner ? getCardStyles(partner) : { className: '', style: {}, textClass: '' };
                      
                      const unreadCount = conv.messages.filter(m => m.recipientId === user.uid && !m.read).length;

                      return (
                        <button
                          key={conv.partnerId}
                          onClick={() => setActiveChat(conv.partnerId)}
                          className={cn(
                            "w-full text-left p-3 rounded-xl transition-all flex items-center gap-3",
                            activeChat === conv.partnerId ? "bg-white/10" : "hover:bg-white/5"
                          )}
                        >
                          <img src={partner?.pfp || DEFAULT_PFP} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <span className={cn("text-sm font-bold truncate", textClass)} style={style}>{partner?.username || 'Unknown User'}</span>
                              <span className="text-[10px] text-white/40">
                                {new Date(conv.lastMessage.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className={cn("text-xs truncate", unreadCount > 0 ? "text-white font-bold" : "text-white/60")}>
                                {conv.lastMessage.senderId === user.uid ? 'You: ' : ''}
                                {conv.lastMessage.text}
                              </p>
                              {unreadCount > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className={cn(
                "w-full md:w-2/3 flex flex-col bg-black/40",
                !activeChat ? "hidden md:flex" : "flex"
              )}>
                {activeChat ? (() => {
                  const partner = activeConversation?.partner || allUsers.find(u => u.uid === activeChat);
                  const messages = activeConversation?.messages || [];
                  
                  return (
                  <>
                    <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-black/20">
                      <img src={partner?.pfp || DEFAULT_PFP} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-bold text-white">{partner?.username || 'Unknown User'}</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                      {messages.map(msg => {
                        const isMe = msg.senderId === user.uid;
                        return (
                          <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                            <div className={cn(
                              "max-w-[80%] rounded-2xl px-4 py-2",
                              isMe ? "bg-blue-500 text-white rounded-br-sm" : "bg-white/10 text-white rounded-bl-sm"
                            )}>
                              <div className="text-sm markdown-body break-words">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                              </div>
                            </div>
                            <span className="text-[10px] text-white/40 mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {user.isMuted ? (
                      <div className="p-4 border-t border-white/10 bg-black/20 text-center">
                        <p className="text-red-400 text-sm font-bold">You are muted and cannot send private messages.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/20">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="absolute right-2 p-2 rounded-lg bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )})() : (
                  <div className="flex-1 flex items-center justify-center text-white/40 flex-col gap-4">
                    <Mail className="w-12 h-12 opacity-20" />
                    <p>Select a conversation to start messaging</p>
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
