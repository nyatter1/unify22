import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, where } from 'firebase/firestore';
import { UserProfile, Message } from '../types';
import { Send, LogOut, Users, MessageSquare, Infinity, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { THEMES } from '../constants';

interface ChatProps {
  user: UserProfile;
}

export default function Chat({ user }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES.find(t => t.id === user.theme) || THEMES[0];

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
    <div 
      className="h-screen flex flex-col overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
    >
      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-6 backdrop-blur-md z-20" style={{ borderColor: `${currentTheme.primary}20` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})` }}>
            <Infinity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Uni-Fy</h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowUsers(!showUsers)}
            className="p-2 rounded-full hover:bg-slate-500/10 relative"
          >
            <Users className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: `${currentTheme.primary}20` }}>
            <img src={user.pfp} className="w-9 h-9 rounded-full border-2" style={{ borderColor: currentTheme.primary }} />
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-none">{user.username}</p>
              <p className="text-[10px] opacity-60 mt-1 uppercase tracking-wider">{user.age}y • {user.gender}</p>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg, i) => {
              const isMe = msg.senderId === user.uid;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id || i}
                  className={cn("flex gap-3 max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "mr-auto")}
                >
                  <img src={msg.senderPfp} className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-slate-500/20 shadow-sm" />
                  <div className={cn("space-y-1", isMe ? "items-end" : "items-start")}>
                    <div className={cn("flex items-center gap-1.5 px-1", isMe && "flex-row-reverse")}>
                      <p className="text-[10px] font-bold opacity-70">{msg.senderUsername}</p>
                      <span className="text-[8px] opacity-40 uppercase tracking-tighter">
                        {onlineUsers.find(u => u.uid === msg.senderId)?.age || '??'}y • {onlineUsers.find(u => u.uid === msg.senderId)?.gender || '??'}
                      </span>
                    </div>
                    <div 
                      className={cn(
                        "px-4 py-2.5 rounded-2xl shadow-sm",
                        isMe ? "rounded-tr-none" : "rounded-tl-none"
                      )}
                      style={{ 
                        backgroundColor: isMe ? currentTheme.primary : `${currentTheme.primary}15`,
                        color: isMe ? '#fff' : currentTheme.text,
                        border: isMe ? 'none' : `1px solid ${currentTheme.primary}20`
                      }}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 pt-0">
            <form 
              onSubmit={handleSendMessage}
              className="flex gap-2 p-2 rounded-2xl border backdrop-blur-xl"
              style={{ borderColor: `${currentTheme.primary}30`, backgroundColor: `${currentTheme.bg}80` }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent px-4 py-2 focus:outline-none"
                style={{ color: currentTheme.text }}
              />
              <button
                type="submit"
                className="p-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`, color: '#fff' }}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Online Users */}
        <AnimatePresence>
          {showUsers && (
            <motion.aside
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="w-72 border-l backdrop-blur-xl absolute right-0 top-0 bottom-0 z-10"
              style={{ borderColor: `${currentTheme.primary}20`, backgroundColor: `${currentTheme.bg}dd` }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Online Now
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-500">
                    {onlineUsers.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {onlineUsers.map((u) => (
                    <div key={u.uid} className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative">
                        <img src={u.pfp} className="w-10 h-10 rounded-full border-2 border-slate-500/20 group-hover:border-amber-500 transition-colors" />
                        <Circle className="w-3 h-3 fill-green-500 text-green-500 absolute -bottom-0.5 -right-0.5 border-2 border-slate-900 rounded-full" />
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-none">{u.username}</p>
                        <p className="text-[10px] opacity-50 mt-1">{u.age}y • {u.gender}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
