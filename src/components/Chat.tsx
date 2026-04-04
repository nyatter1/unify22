import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, where } from 'firebase/firestore';
import { UserProfile, Message } from '../types';
import { Send, LogOut, Users, Infinity, Circle, Shield, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ChatProps {
  user: UserProfile;
}

export default function Chat({ user }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    const usersQ = query(collection(db, 'users'), where('isOnline', '==', true));
    const usersUnsubscribe = onSnapshot(usersQ, (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data() as UserProfile);
      setOnlineUsers(users);
    });

    // Update online status
    updateDoc(doc(db, 'users', user.uid), { isOnline: true, lastSeen: serverTimestamp() });

    return () => {
      unsubscribe();
      usersUnsubscribe();
      updateDoc(doc(db, 'users', user.uid), { isOnline: false, lastSeen: serverTimestamp() });
    };
  }, [user.uid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        text: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#050505] text-amber-100/90 font-sans">
      {/* Luxury Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-amber-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="h-20 border-b border-amber-900/20 flex items-center justify-between px-8 backdrop-blur-2xl z-20 bg-black/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700">
            <Infinity className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-serif italic bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent leading-none">Uni-Fy</h1>
            <p className="text-[10px] text-amber-700/60 uppercase tracking-[0.3em] mt-1">The Unified Universe</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 pl-6 border-l border-amber-900/20">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-serif text-amber-200 leading-none">{user.username}</p>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                <span className="text-[9px] text-amber-600 uppercase tracking-widest font-bold">{user.age}Y</span>
                <span className="w-1 h-1 rounded-full bg-amber-900" />
                <span className="text-[9px] text-amber-600 uppercase tracking-widest font-bold">{user.gender}</span>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={user.pfp} className="relative w-11 h-11 rounded-full border-2 border-amber-500/30 object-cover shadow-xl" />
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="p-2.5 rounded-full hover:bg-red-500/10 text-amber-900/40 hover:text-red-500 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative z-10">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-amber-900/10">
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {messages.map((msg, i) => {
              const isMe = msg.senderId === user.uid;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id || i}
                  className={cn("flex gap-4 max-w-[85%]", isMe ? "ml-auto flex-row-reverse" : "mr-auto")}
                >
                  <div className="relative flex-shrink-0">
                    <img src={msg.senderPfp} className="w-10 h-10 rounded-full border border-amber-900/30 object-cover shadow-lg" />
                    {msg.senderId === 'admin' && <Shield className="w-3 h-3 text-amber-400 absolute -top-1 -right-1" />}
                  </div>
                  <div className={cn("space-y-1.5", isMe ? "items-end" : "items-start")}>
                    <div className={cn("flex items-center gap-2 px-1", isMe && "flex-row-reverse")}>
                      <p className="text-[10px] font-bold text-amber-200/60 uppercase tracking-widest">{msg.senderUsername}</p>
                      <span className="text-[8px] text-amber-900/40 uppercase tracking-tighter">
                        {onlineUsers.find(u => u.uid === msg.senderId)?.age || '??'}Y • {onlineUsers.find(u => u.uid === msg.senderId)?.gender || '??'}
                      </span>
                    </div>
                    <div 
                      className={cn(
                        "px-5 py-3 rounded-2xl shadow-2xl relative overflow-hidden",
                        isMe ? "rounded-tr-none bg-gradient-to-br from-amber-500 to-amber-700 text-black font-medium" : "rounded-tl-none bg-black/40 border border-amber-900/20 text-amber-100/80"
                      )}
                    >
                      {isMe && <div className="absolute inset-0 bg-white/10 opacity-20 pointer-events-none" />}
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 pt-0">
            <form 
              onSubmit={handleSendMessage}
              className="flex gap-3 p-2 rounded-2xl border border-amber-900/20 bg-black/40 backdrop-blur-3xl shadow-2xl"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your thoughts with the universe..."
                className="flex-1 bg-transparent px-6 py-3 focus:outline-none text-amber-100 placeholder:text-amber-900/40 text-sm"
              />
              <button
                type="submit"
                className="group relative px-6 rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600" />
                <div className="relative flex items-center justify-center text-black">
                  <Send className="w-5 h-5" />
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Online Users (Pinned) */}
        <aside className="w-80 bg-black/20 backdrop-blur-md flex flex-col hidden lg:flex">
          <div className="p-8 border-b border-amber-900/10">
            <div className="flex items-center justify-between">
              <h2 className="font-serif italic text-amber-200 text-lg flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-500" />
                Online Now
              </h2>
              <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {onlineUsers.length}
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {onlineUsers.map((u) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={u.uid} 
                className="flex items-center gap-4 group cursor-pointer p-2 rounded-xl hover:bg-amber-500/5 transition-all"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img src={u.pfp} className="relative w-12 h-12 rounded-full border border-amber-900/30 object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-[3px] border-[#050505] rounded-full shadow-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-serif text-amber-100 truncate group-hover:text-amber-400 transition-colors">{u.username}</p>
                    {u.age > 100 && <Crown className="w-3 h-3 text-amber-500" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-amber-900/60 uppercase tracking-widest font-bold">{u.age}Y</span>
                    <span className="w-1 h-1 rounded-full bg-amber-900/30" />
                    <span className="text-[9px] text-amber-600/60 uppercase tracking-widest font-bold">{u.gender}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* User Mini Profile at bottom of sidebar */}
          <div className="p-6 border-t border-amber-900/10 bg-black/40">
            <div className="relative h-24 rounded-xl overflow-hidden border border-amber-900/20 mb-3">
              <img src={user.banner} className="w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              <div className="absolute bottom-2 left-3 flex items-center gap-2">
                <img src={user.pfp} className="w-8 h-8 rounded-full border border-amber-500/30" />
                <p className="text-xs font-serif text-amber-200">{user.username}</p>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
