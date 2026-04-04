import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, where, increment, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { UserProfile, Message, Theme, CardStyle } from '../types';
import { THEMES, CARD_STYLES, AVATARS, BANNERS } from '../constants';
import { Send, LogOut, Users, Infinity, Circle, Shield, Crown, Wallet, Gem, Coins, AlertCircle, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Palette, X, Check, Edit3, Heart, User, Image, Camera, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ChatProps {
  user: UserProfile;
}

const DiceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export default function Chat({ user }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showWallet, setShowWallet] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showCardEditor, setShowCardEditor] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [editTab, setEditTab] = useState<'username' | 'info' | 'bio' | 'pfp' | 'banner' | 'main'>('main');
  const [customizerTab, setCustomizerTab] = useState<'themes' | 'cards'>('themes');
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pfpInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [newTheme, setNewTheme] = useState<Partial<Theme>>({
    name: '',
    background: '#000000',
    textColor: 'text-white',
    accentColor: 'white',
    category: 'Custom',
    isCustom: true,
    customStyles: {
      gradient: '',
      pattern: 'none',
      fontFamily: 'sans',
      glassmorphism: 0,
      bubbleStyle: 'rounded'
    }
  });

  const [newCard, setNewCard] = useState<Partial<CardStyle>>({
    name: '',
    category: 'Custom',
    bgClass: '',
    borderClass: '',
    textClass: '',
    isCustom: true,
    customStyles: {
      background: '#0a0a0a',
      border: '#ffffff20',
      textColor: '#ffffff',
      effect: 'none',
      badgeIcon: '',
      title: '',
      titleColor: '#ffffff',
      fontFamily: 'sans'
    }
  });

  const allThemes = [...THEMES, ...(user.customThemes || [])];
  const allCardStyles = [...CARD_STYLES, ...(user.customCardStyles || [])];
  
  const currentTheme = allThemes.find(t => t.id === user.theme) || THEMES[0];

  const getCardStyles = (u: UserProfile) => {
    const uCardStyles = [...CARD_STYLES, ...(u.customCardStyles || [])];
    const style = uCardStyles.find(s => s.id === u.cardStyle) || CARD_STYLES[0];
    
    if (style.isCustom && style.customStyles) {
      const { background, border, textColor, effect, fontFamily } = style.customStyles;
      let className = "flex items-center gap-4 group cursor-pointer p-3 rounded-2xl border transition-all";
      
      if (effect === 'glow') className += " shadow-[0_0_20px_rgba(255,255,255,0.2)]";
      if (effect === 'pulse') className += " animate-pulse";
      if (effect === 'glitch') className += " skew-x-1 -rotate-1";
      if (effect === 'neon') className += " shadow-[0_0_15px_rgba(255,255,255,0.4)]";
      if (effect === 'snake') className += " border-double border-4 animate-[spin_4s_linear_infinite]";
      if (effect === 'rainbow') className += " animate-[gradient_3s_linear_infinite] bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-[length:200%_auto]";

      const fontClass = fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : fontFamily === 'display' ? 'font-black tracking-tighter' : '';
      className += ` ${fontClass}`;

      return {
        className,
        style: {
          backgroundColor: background,
          borderColor: border,
          color: textColor,
        },
        textClass: "",
        custom: style.customStyles
      };
    }

    return {
      className: cn(
        "flex items-center gap-4 group cursor-pointer p-3 rounded-2xl border transition-all",
        style.bgClass,
        style.borderClass
      ),
      style: {},
      textClass: style.textClass,
      custom: style.customStyles
    };
  };

  useEffect(() => {
    // Auto-fix NaN or 0 balances
    const fixBalances = async () => {
      const updates: any = {};
      let needsUpdate = false;

      // NaN Protection
      if (isNaN(user.gold)) {
        updates.gold = 1000;
        needsUpdate = true;
      }
      if (isNaN(user.rubies)) {
        updates.rubies = 1000; // Prompt said "1000 of that currency" for NaN
        needsUpdate = true;
      }

      // One-time Poverty Reset
      if (!user.hasReceivedReset && (user.gold === 0 && user.rubies === 0)) {
        updates.gold = 1000;
        updates.rubies = 10;
        updates.hasReceivedReset = true;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await updateDoc(doc(db, 'users', user.uid), updates);
      }
    };

    fixBalances();
  }, [user.gold, user.rubies, user.hasReceivedReset, user.uid]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs.reverse());
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    const usersQ = query(collection(db, 'users'), where('isOnline', '==', true));
    const usersUnsubscribe = onSnapshot(usersQ, (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data() as UserProfile);
      setOnlineUsers(users);
    });

    // Update online status
    const setOnline = () => updateDoc(doc(db, 'users', user.uid), { isOnline: true, lastSeen: serverTimestamp() });
    const setOffline = () => updateDoc(doc(db, 'users', user.uid), { isOnline: false, lastSeen: serverTimestamp() });

    setOnline();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setOnline();
      } else {
        // We don't set offline on visibility change to avoid flickering, 
        // but the user specifically asked for "tab closed" logic.
      }
    };

    const handleBeforeUnload = () => {
      // This is the "tab closed" logic
      setOffline();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubscribe();
      usersUnsubscribe();
      setOffline();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user.uid]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const updateCustomization = async (field: 'theme' | 'cardStyle' | 'username' | 'age' | 'gender' | 'bio' | 'pfp' | 'banner', value: any) => {
    try {
      await updateDoc(doc(db, 'users', user.uid), { [field]: value });
      if (selectedProfile?.uid === user.uid) {
        setSelectedProfile(prev => prev ? { ...prev, [field]: value } : null);
      }
    } catch (err) {
      console.error(err);
      showToast(`Failed to update ${field}`);
    }
  };

  const viewProfile = async (uid: string) => {
    try {
      const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', uid)));
      if (!userDoc.empty) {
        setSelectedProfile(userDoc.docs[0].data() as UserProfile);
        setShowProfileModal(true);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load profile');
    }
  };

  const toggleLike = async (targetUid: string) => {
    if (!user.uid) return;
    try {
      const userRef = doc(db, 'users', targetUid);
      const isLiked = selectedProfile?.likes?.includes(user.uid);
      
      const newLikes = isLiked 
        ? (selectedProfile?.likes || []).filter(id => id !== user.uid)
        : [...(selectedProfile?.likes || []), user.uid];

      await updateDoc(userRef, { likes: newLikes });
      setSelectedProfile(prev => prev ? { ...prev, likes: newLikes } : null);
      showToast(isLiked ? 'Unliked profile' : 'Liked profile!');
    } catch (err) {
      console.error(err);
      showToast('Failed to toggle like');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'pfp' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit for base64 storage in Firestore
      showToast('File too large! Max 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateCustomization(field, base64String);
      showToast(`${field.toUpperCase()} updated!`);
    };
    reader.readAsDataURL(file);
  };

  const saveCustomTheme = async () => {
    if (!newTheme.name) return showToast('Theme name is required');
    const themeId = `custom-${Date.now()}`;
    const theme = { ...newTheme, id: themeId } as Theme;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        customThemes: [...(user.customThemes || []), theme],
        theme: themeId
      });
      setShowThemeEditor(false);
      showToast('Custom theme saved!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save theme');
    }
  };

  const saveCustomCard = async () => {
    if (!newCard.name) return showToast('Card name is required');
    const cardId = `custom-card-${Date.now()}`;
    const card = { ...newCard, id: cardId } as CardStyle;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        customCardStyles: [...(user.customCardStyles || []), card],
        cardStyle: cardId
      });
      setShowCardEditor(false);
      showToast('Custom card saved!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save card');
    }
  };

  const pruneMessages = async () => {
    try {
      // Only prune occasionally to save on reads/writes
      if (Math.random() > 0.1) return; 

      const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      
      if (snapshot.size < 100) return;

      // Get all messages and delete those older than the last 50
      const allMsgsQ = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
      const allSnapshot = await getDocs(allMsgsQ);
      
      if (allSnapshot.size > 100) {
        const batch = writeBatch(db);
        const toDelete = allSnapshot.docs.slice(100);
        toDelete.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
      }
    } catch (err) {
      console.error('Pruning error:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const text = newMessage.trim();
    setNewMessage('');

    // Prune old messages to stay within free tier quotas
    pruneMessages();

    // Command Parsing
    if (text.startsWith('/')) {
      const parts = text.split(' ');
      const command = parts[0].toLowerCase();

      if (command === '/allin') {
        const currency = parts[1]?.toLowerCase();
        if (currency !== 'gold' && currency !== 'rubies') {
          showToast('Invalid currency! Use /allin gold or /allin rubies');
          return;
        }

        const balance = currency === 'gold' ? user.gold : user.rubies;
        if (balance <= 0 || isNaN(balance)) {
          showToast(`You have no ${currency} to gamble!`);
          return;
        }

        // Gamble logic
        const multiplier = Math.floor(Math.random() * 101); // 0 to 100
        const winAmount = balance * multiplier;
        const result = multiplier > 0 ? 'won' : 'lost';

        // Update balance
        const userRef = doc(db, 'users', user.uid);
        if (result === 'won') {
          await updateDoc(userRef, { [currency]: winAmount });
        } else {
          await updateDoc(userRef, { [currency]: 0 });
        }

        // Broadcast result
        await addDoc(collection(db, 'messages'), {
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          text: `/allin ${currency}`,
          type: 'gamble_allin',
          gambleData: {
            currency,
            amount: balance,
            result,
            multiplier,
            winAmount: result === 'won' ? winAmount : balance,
          },
          timestamp: serverTimestamp(),
        });
        return;
      }

      if (command === '/dice') {
        const currency = parts[1]?.toLowerCase();
        const amount = parseInt(parts[2]);

        if ((currency !== 'gold' && currency !== 'rubies') || isNaN(amount) || amount <= 0) {
          showToast('Invalid command! Use /dice [gold|rubies] [amount]');
          return;
        }

        const balance = currency === 'gold' ? user.gold : user.rubies;
        if (amount > balance) {
          showToast(`Insufficient ${currency}!`);
          return;
        }

        // Dice logic
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        const multiplier = Math.floor(Math.random() * 50) + 1; // 1 to 50
        const result = diceRoll === 6 ? 'won' : 'lost';
        const winAmount = result === 'won' ? amount * multiplier : amount;

        // Update balance
        const userRef = doc(db, 'users', user.uid);
        if (result === 'won') {
          await updateDoc(userRef, { [currency]: increment(winAmount - amount) });
        } else {
          await updateDoc(userRef, { [currency]: increment(-amount) });
        }

        // Broadcast result
        await addDoc(collection(db, 'messages'), {
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          text: `/dice ${currency} ${amount}`,
          type: 'gamble_dice',
          gambleData: {
            currency,
            amount,
            result,
            multiplier: result === 'won' ? multiplier : 0,
            winAmount,
            diceRoll,
          },
          timestamp: serverTimestamp(),
        });
        return;
      }

      if (command === '/clearchat' && user.email === 'haydensixseven@gmail.com') {
        try {
          const q = query(collection(db, 'messages'));
          const snapshot = await getDocs(q);
          const batch = writeBatch(db);
          snapshot.docs.forEach(doc => batch.delete(doc.ref));
          await batch.commit();
          showToast('Chat cleared!');
        } catch (err) {
          console.error(err);
          showToast('Failed to clear chat');
        }
        return;
      }

      showToast('Invalid command!');
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        text,
        type: 'text',
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      className={cn("h-screen flex flex-col overflow-hidden font-sans relative transition-all duration-500", currentTheme.textColor)}
      style={{ 
        backgroundColor: currentTheme.background.startsWith('#') || currentTheme.background.startsWith('hsl') ? currentTheme.background : undefined,
        backgroundImage: currentTheme.background.startsWith('http') ? `url(${currentTheme.background})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Theme Overlay */}
      {currentTheme.background.startsWith('http') && <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-400/20"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-xs">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 backdrop-blur-2xl z-20 bg-black/40">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl", `bg-${currentTheme.accentColor}`)}>
            <Infinity className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-serif italic bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent leading-none">Uni-Fy</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mt-1">The Unified Universe</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Customizer Toggle */}
          <button 
            onClick={() => setShowCustomizer(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <Palette className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Customise</span>
          </button>

          {/* Wallet Toggle */}
          <div className="relative">
            <button 
              onClick={() => setShowWallet(!showWallet)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                showWallet ? "bg-amber-500 text-black border-amber-400" : "bg-black/40 border-white/10 text-amber-500 hover:border-amber-500/50"
              )}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Wallet</span>
            </button>

            <AnimatePresence>
              {showWallet && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-4 w-64 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 shadow-2xl z-50"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <Coins className="w-5 h-5 text-amber-500" />
                        <span className="text-xs font-bold text-amber-500/60 uppercase tracking-widest">Gold</span>
                      </div>
                      <span className="text-lg font-serif italic text-white">{(user.gold ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <Gem className="w-5 h-5 text-amber-500" />
                        <span className="text-xs font-bold text-amber-500/60 uppercase tracking-widest">Rubies</span>
                      </div>
                      <span className="text-lg font-serif italic text-white">{(user.rubies ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 pl-6 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-serif text-white leading-none">{user.username}</p>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">{user.age}Y</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">{user.gender}</span>
              </div>
            </div>
            <img src={user.pfp} className="w-11 h-11 rounded-full border-2 border-white/20 object-cover shadow-xl" />
            <button 
              onClick={() => auth.signOut()}
              className="p-2.5 rounded-full hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative z-10">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/10">
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {messages.map((msg, i) => {
              const isMe = msg.senderId === user.uid;
              
              if (msg.type === 'gamble_allin' || msg.type === 'gamble_dice') {
                const data = msg.gambleData!;
                const DiceIcon = data.diceRoll ? DiceIcons[data.diceRoll - 1] : null;

                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={msg.id || i}
                    className="flex flex-col items-center justify-center py-8 px-4 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 max-w-2xl mx-auto w-full text-center space-y-4"
                  >
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-[0.3em]">{msg.senderUsername} did {msg.type === 'gamble_allin' ? '/allin' : '/dice'}</p>
                    <img 
                      src={msg.senderPfp} 
                      onClick={() => viewProfile(msg.senderId)}
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

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id || i}
                  className={cn("flex gap-4 max-w-[85%]", isMe ? "ml-auto flex-row-reverse" : "mr-auto")}
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={msg.senderPfp} 
                      onClick={() => viewProfile(msg.senderId)}
                      className="w-10 h-10 rounded-full border border-white/20 object-cover shadow-lg cursor-pointer hover:scale-105 transition-transform" 
                    />
                    {msg.senderId === 'admin' && <Shield className="w-3 h-3 text-amber-400 absolute -top-1 -right-1" />}
                  </div>
                  <div className={cn("space-y-1.5", isMe ? "items-end" : "items-start")}>
                    <div className={cn("flex items-center gap-2 px-1", isMe && "flex-row-reverse")}>
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{msg.senderUsername}</p>
                    </div>
                    <div 
                      className={cn(
                        "px-5 py-3 rounded-2xl shadow-2xl relative overflow-hidden",
                        isMe ? "rounded-tr-none bg-white text-black font-medium" : "rounded-tl-none bg-black/60 border border-white/10 text-white/80 backdrop-blur-md"
                      )}
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
          <div className="p-8 pt-0">
            <form 
              onSubmit={handleSendMessage}
              className="flex gap-3 p-2 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-3xl shadow-2xl"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your thoughts or try /allin gold..."
                className="flex-1 bg-transparent px-6 py-3 focus:outline-none text-white placeholder:text-white/20 text-sm"
              />
              <button
                type="submit"
                className="group relative px-6 rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <div className="absolute inset-0 bg-white" />
                <div className="relative flex items-center justify-center text-black">
                  <Send className="w-5 h-5" />
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar - Online Users (Pinned) */}
        <aside className="w-80 bg-black/40 backdrop-blur-md flex flex-col hidden lg:flex">
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="font-serif italic text-white text-lg flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-500" />
                Online Now
              </h2>
              <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/5 text-white/60 border border-white/10">
                {onlineUsers.length}
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {onlineUsers.map((u) => {
              const { className, style, textClass } = getCardStyles(u);
              return (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={u.uid} 
                  className={className}
                  style={style}
                >
                  <div className="relative">
                    <img 
                      src={u.pfp} 
                      onClick={() => viewProfile(u.uid)}
                      className="relative w-12 h-12 rounded-full border border-white/20 object-cover transition-transform group-hover:scale-105 cursor-pointer" 
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-[3px] border-black rounded-full shadow-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={cn("text-sm font-serif truncate transition-colors", textClass)}>{u.username}</p>
                      {u.age > 100 && <Crown className="w-3 h-3 text-amber-500" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] opacity-60 uppercase tracking-widest font-bold">{u.age}Y</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[9px] opacity-60 uppercase tracking-widest font-bold">{u.gender}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* User Mini Profile at bottom of sidebar */}
          <div className="p-6 border-t border-white/10 bg-black/60">
            <div className="relative h-24 rounded-xl overflow-hidden border border-white/10 mb-3">
              <img src={user.banner} className="w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              <div className="absolute bottom-2 left-3 flex items-center gap-2">
                <img src={user.pfp} className="w-8 h-8 rounded-full border border-white/20" />
                <p className="text-xs font-serif text-white">{user.username}</p>
              </div>
            </div>
            {/* Quick Wallet Stats */}
            <div className="flex gap-2">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center gap-2">
                <Coins className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-bold text-white">{(user.gold ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 flex items-center justify-center gap-2">
                <Gem className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-bold text-white">{(user.rubies ?? 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Customization Modal */}
      <AnimatePresence>
        {showCustomizer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCustomizer(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl h-[80vh] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
              {/* Modal Header */}
              <div className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/20">
                <div className="flex items-center gap-8">
                  <h2 className="text-3xl font-serif italic text-white">Customise</h2>
                  <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    <button 
                      onClick={() => setCustomizerTab('themes')}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                        customizerTab === 'themes' ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"
                      )}
                    >
                      Themes
                    </button>
                    <button 
                      onClick={() => setCustomizerTab('cards')}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                        customizerTab === 'cards' ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"
                      )}
                    >
                      User Cards
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCustomizer(false)}
                  className="p-3 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                {customizerTab === 'themes' ? (
                  <div className="space-y-12">
                    {/* Create Custom Theme Button */}
                    <button 
                      onClick={() => setShowThemeEditor(true)}
                      className="w-full p-8 rounded-3xl border-2 border-dashed border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group flex flex-col items-center justify-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Palette className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold uppercase tracking-widest text-sm">Create Your Own Theme</p>
                        <p className="text-white/40 text-xs mt-1">Design a unique look for your eyes only</p>
                      </div>
                    </button>

                    {['Custom', 'Essentials', 'Aesthetic', 'Street', 'Brain Rot', 'Niche'].map(category => {
                      const categoryThemes = allThemes.filter(t => t.category === category);
                      if (categoryThemes.length === 0) return null;
                      
                      return (
                        <div key={category} className="space-y-6">
                          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-[0.3em] pl-2 border-l-2 border-amber-500">{category}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryThemes.map(t => (
                              <button
                                key={t.id}
                                onClick={() => updateCustomization('theme', t.id)}
                                className={cn(
                                  "group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.02] active:scale-95",
                                  user.theme === t.id ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]" : "border-white/5 hover:border-white/20"
                                )}
                              >
                                <div 
                                  className="absolute inset-0 transition-transform group-hover:scale-110 duration-700"
                                  style={{ 
                                    backgroundColor: t.background,
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                  <span className="text-xs font-bold text-white uppercase tracking-widest">{t.name}</span>
                                  {user.theme === t.id && <Check className="w-4 h-4 text-amber-500" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* Create Custom Card Button */}
                    <button 
                      onClick={() => setShowCardEditor(true)}
                      className="w-full p-8 rounded-3xl border-2 border-dashed border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group flex flex-col items-center justify-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Infinity className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold uppercase tracking-widest text-sm">Create Your Own Card</p>
                        <p className="text-white/40 text-xs mt-1">Stand out with a fully custom player card</p>
                      </div>
                    </button>

                    {['Custom', 'Elite', 'Fun', 'Street', 'Premium', 'Minimal', 'Extreme'].map(category => {
                      const categoryCards = allCardStyles.filter(s => s.category === category);
                      if (categoryCards.length === 0) return null;

                      return (
                        <div key={category} className="space-y-6">
                          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-[0.3em] pl-2 border-l-2 border-amber-500">{category}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryCards.map(s => {
                              const { className, style, textClass } = getCardStyles({ ...user, cardStyle: s.id });
                              return (
                                <button
                                  key={s.id}
                                  onClick={() => updateCustomization('cardStyle', s.id)}
                                  className={cn(
                                    "group relative p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-95 text-left",
                                    user.cardStyle === s.id ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]" : "border-white/5 hover:border-white/20"
                                  )}
                                >
                                  <div className={className} style={style}>
                                    <img src={user.pfp} className="w-10 h-10 rounded-full border border-white/20" />
                                    <div className="flex-1 min-w-0">
                                      <p className={cn("text-sm font-serif truncate", textClass)}>{user.username}</p>
                                      <p className="text-[9px] opacity-40 uppercase tracking-widest font-bold">{user.age}Y • {user.gender}</p>
                                    </div>
                                    {user.cardStyle === s.id && <Check className="w-4 h-4 text-amber-500" />}
                                  </div>
                                  <div className="mt-3 flex items-center justify-between px-1">
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{s.name}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Theme Editor Modal */}
      <AnimatePresence>
        {showThemeEditor && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowThemeEditor(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-serif italic text-white">Design Theme</h3>
                <button onClick={() => setShowThemeEditor(false)} className="p-2 hover:bg-white/5 rounded-full text-white/40"><X /></button>
              </div>
              
              <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                {/* Preview */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Preview</p>
                  <div 
                    className="aspect-video rounded-3xl border-2 border-white/10 overflow-hidden flex flex-col p-6 gap-4"
                    style={{ backgroundColor: newTheme.background }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10" />
                      <div className="space-y-2">
                        <div className="h-2 w-24 rounded-full bg-white/20" />
                        <div className="h-1.5 w-16 rounded-full bg-white/10" />
                      </div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-black/20 border border-white/5 p-4">
                      <p className={cn("text-sm", newTheme.textColor)}>This is how your chat will look.</p>
                    </div>
                    <div className="h-10 rounded-xl bg-white flex items-center justify-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-black">Send Message</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Theme Name</label>
                    <input 
                      type="text" 
                      value={newTheme.name}
                      onChange={e => setNewTheme({...newTheme, name: e.target.value})}
                      placeholder="e.g. Midnight Soul"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Background Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={newTheme.background}
                        onChange={e => setNewTheme({...newTheme, background: e.target.value})}
                        className="w-12 h-12 rounded-xl bg-transparent border-none cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={newTheme.background}
                        onChange={e => setNewTheme({...newTheme, background: e.target.value})}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Text Color</label>
                    <select 
                      value={newTheme.textColor}
                      onChange={e => setNewTheme({...newTheme, textColor: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                    >
                      <option value="text-white" className="bg-zinc-900">White</option>
                      <option value="text-zinc-400" className="bg-zinc-900">Dimmed</option>
                      <option value="text-amber-500" className="bg-zinc-900">Amber</option>
                      <option value="text-emerald-500" className="bg-zinc-900">Emerald</option>
                      <option value="text-sky-500" className="bg-zinc-900">Sky</option>
                      <option value="text-pink-500" className="bg-zinc-900">Pink</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Accent Color</label>
                    <select 
                      value={newTheme.accentColor}
                      onChange={e => setNewTheme({...newTheme, accentColor: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                    >
                      <option value="white" className="bg-zinc-900">White</option>
                      <option value="amber-500" className="bg-zinc-900">Amber</option>
                      <option value="emerald-500" className="bg-zinc-900">Emerald</option>
                      <option value="sky-500" className="bg-zinc-900">Sky</option>
                      <option value="pink-500" className="bg-zinc-900">Pink</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Font Family</label>
                    <select 
                      value={newTheme.customStyles?.fontFamily}
                      onChange={e => setNewTheme({...newTheme, customStyles: { ...newTheme.customStyles, fontFamily: e.target.value as any }})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                    >
                      <option value="sans" className="bg-zinc-900">Sans Serif</option>
                      <option value="serif" className="bg-zinc-900">Serif (Elegant)</option>
                      <option value="mono" className="bg-zinc-900">Monospace (Code)</option>
                      <option value="display" className="bg-zinc-900">Display (Bold)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Background Pattern</label>
                    <select 
                      value={newTheme.customStyles?.pattern}
                      onChange={e => setNewTheme({...newTheme, customStyles: { ...newTheme.customStyles, pattern: e.target.value as any }})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                    >
                      <option value="none" className="bg-zinc-900">None</option>
                      <option value="dots" className="bg-zinc-900">Dots</option>
                      <option value="stripes" className="bg-zinc-900">Stripes</option>
                      <option value="noise" className="bg-zinc-900">Noise</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Glassmorphism (Blur)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="40" 
                      value={newTheme.customStyles?.glassmorphism}
                      onChange={e => setNewTheme({...newTheme, customStyles: { ...newTheme.customStyles, glassmorphism: parseInt(e.target.value) }})}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Bubble Style</label>
                    <select 
                      value={newTheme.customStyles?.bubbleStyle}
                      onChange={e => setNewTheme({...newTheme, customStyles: { ...newTheme.customStyles, bubbleStyle: e.target.value as any }})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                    >
                      <option value="rounded" className="bg-zinc-900">Rounded</option>
                      <option value="sharp" className="bg-zinc-900">Sharp</option>
                      <option value="minimal" className="bg-zinc-900">Minimal</option>
                      <option value="bordered" className="bg-zinc-900">Bordered</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4">
                <button 
                  onClick={() => setShowThemeEditor(false)}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveCustomTheme}
                  className="flex-[2] py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                >
                  Save & Apply Theme
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card Editor Modal */}
      <AnimatePresence>
        {showCardEditor && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCardEditor(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-serif italic text-white">Design Card</h3>
                <button onClick={() => setShowCardEditor(false)} className="p-2 hover:bg-white/5 rounded-full text-white/40"><X /></button>
              </div>
              
              <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                {/* Preview */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Preview</p>
                  <div 
                    className={cn(
                      "flex items-center gap-4 p-6 rounded-2xl border transition-all",
                      newCard.customStyles?.effect === 'glow' && "shadow-[0_0_30px_rgba(255,255,255,0.2)]",
                      newCard.customStyles?.effect === 'pulse' && "animate-pulse",
                      newCard.customStyles?.effect === 'glitch' && "skew-x-2 -rotate-1",
                      newCard.customStyles?.effect === 'neon' && "shadow-[0_0_20px_rgba(255,255,255,0.4)]",
                      newCard.customStyles?.effect === 'snake' && "border-double border-4 animate-[spin_4s_linear_infinite]",
                      newCard.customStyles?.effect === 'rainbow' && "animate-[gradient_3s_linear_infinite] bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-[length:200%_auto]"
                    )}
                    style={{ 
                      backgroundColor: newCard.customStyles?.background,
                      borderColor: newCard.customStyles?.border,
                      color: newCard.customStyles?.textColor,
                      fontFamily: newCard.customStyles?.fontFamily === 'serif' ? 'serif' : newCard.customStyles?.fontFamily === 'mono' ? 'monospace' : 'sans-serif'
                    }}
                  >
                    <img src={user.pfp} className="w-12 h-12 rounded-full border border-white/20" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-lg font-serif truncate", newCard.customStyles?.fontFamily === 'display' && "font-black tracking-tighter")}>{user.username}</p>
                        {newCard.customStyles?.badgeIcon && <div className="w-4 h-4 rounded-full bg-white/10" />}
                      </div>
                      {newCard.customStyles?.title && (
                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: newCard.customStyles.titleColor }}>
                          {newCard.customStyles.title}
                        </p>
                      )}
                      <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">{user.age}Y • {user.gender}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Card Name</label>
                    <input 
                      type="text" 
                      value={newCard.name}
                      onChange={e => setNewCard({...newCard, name: e.target.value})}
                      placeholder="e.g. Elite Member"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Special Effect</label>
                    <select 
                      value={newCard.customStyles?.effect}
                      onChange={e => setNewCard({
                        ...newCard, 
                        customStyles: { ...newCard.customStyles!, effect: e.target.value as any }
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                    >
                      <option value="none" className="bg-zinc-900">None</option>
                      <option value="glow" className="bg-zinc-900">Soft Glow</option>
                      <option value="pulse" className="bg-zinc-900">Pulse</option>
                      <option value="glitch" className="bg-zinc-900">Glitch</option>
                      <option value="neon" className="bg-zinc-900">Neon Aura</option>
                      <option value="snake" className="bg-zinc-900">Snake Border</option>
                      <option value="rainbow" className="bg-zinc-900">Rainbow Flow</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Font Family</label>
                    <select 
                      value={newCard.customStyles?.fontFamily}
                      onChange={e => setNewCard({...newCard, customStyles: { ...newCard.customStyles!, fontFamily: e.target.value as any }})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                    >
                      <option value="sans" className="bg-zinc-900">Sans Serif</option>
                      <option value="serif" className="bg-zinc-900">Serif (Elegant)</option>
                      <option value="mono" className="bg-zinc-900">Monospace (Code)</option>
                      <option value="display" className="bg-zinc-900">Display (Bold)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Custom Title</label>
                    <input 
                      type="text" 
                      value={newCard.customStyles?.title}
                      onChange={e => setNewCard({...newCard, customStyles: { ...newCard.customStyles!, title: e.target.value }})}
                      placeholder="e.g. The Legend"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Background</label>
                    <input 
                      type="color" 
                      value={newCard.customStyles?.background}
                      onChange={e => setNewCard({
                        ...newCard, 
                        customStyles: { ...newCard.customStyles!, background: e.target.value }
                      })}
                      className="w-full h-12 rounded-xl bg-transparent border-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Border</label>
                    <input 
                      type="color" 
                      value={newCard.customStyles?.border}
                      onChange={e => setNewCard({
                        ...newCard, 
                        customStyles: { ...newCard.customStyles!, border: e.target.value }
                      })}
                      className="w-full h-12 rounded-xl bg-transparent border-none cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Text</label>
                    <input 
                      type="color" 
                      value={newCard.customStyles?.textColor}
                      onChange={e => setNewCard({
                        ...newCard, 
                        customStyles: { ...newCard.customStyles!, textColor: e.target.value }
                      })}
                      className="w-full h-12 rounded-xl bg-transparent border-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-black/40 border-t border-white/5 flex gap-4">
                <button 
                  onClick={() => setShowCardEditor(false)}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveCustomCard}
                  className="flex-[2] py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                >
                  Save & Apply Card
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && selectedProfile && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Banner */}
              <div 
                className={cn(
                  "relative h-48 w-full overflow-hidden",
                  selectedProfile.uid === user.uid && "cursor-pointer group"
                )}
                onClick={() => selectedProfile.uid === user.uid && bannerInputRef.current?.click()}
              >
                <img 
                  src={selectedProfile.banner || BANNERS[0]} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                
                {selectedProfile.uid === user.uid && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="absolute top-6 right-6 flex items-center gap-3">
                  {selectedProfile.uid === user.uid && (
                    <button 
                      onClick={() => {
                        setEditTab('main');
                        setShowEditProfile(true);
                      }}
                      className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => setShowProfileModal(false)}
                    className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Profile Info */}
              <div className="px-10 pb-10 -mt-16 relative">
                <div className="flex items-end justify-between mb-6">
                  <div 
                    className={cn(
                      "relative group",
                      selectedProfile.uid === user.uid && "cursor-pointer"
                    )}
                    onClick={() => selectedProfile.uid === user.uid && pfpInputRef.current?.click()}
                  >
                    <img 
                      src={selectedProfile.pfp} 
                      className="w-32 h-32 rounded-full border-4 border-zinc-900 object-cover shadow-2xl transition-transform group-hover:scale-105"
                    />
                    {selectedProfile.uid === user.uid && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-zinc-900 rounded-full" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center px-6 py-2 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-amber-500 font-black text-lg">{(selectedProfile.likes || []).length}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Likes</p>
                    </div>
                    <button 
                      onClick={() => toggleLike(selectedProfile.uid)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all",
                        selectedProfile.likes?.includes(user.uid)
                          ? "bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                          : "bg-white/5 border-white/5 text-white/40 hover:text-red-500 hover:border-red-500/50"
                      )}
                    >
                      <Heart className={cn("w-6 h-6", selectedProfile.likes?.includes(user.uid) && "fill-current")} />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-serif italic text-white flex items-center gap-3">
                      {selectedProfile.username}
                      {selectedProfile.uid === 'admin' && <Shield className="w-5 h-5 text-amber-500" />}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                        {selectedProfile.age} Years Old
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest">
                        {selectedProfile.gender}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Biography</p>
                    <p className="text-white/80 text-sm leading-relaxed italic">
                      {selectedProfile.bio || "This user is too cool for a bio..."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{(selectedProfile.gold || 0).toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Gold</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Gem className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{(selectedProfile.rubies || 0).toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Rubies</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfile && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditProfile(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setEditTab('main')}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      editTab === 'main' ? "hidden" : "block hover:bg-white/5"
                    )}
                  >
                    <ChevronRight className="w-5 h-5 text-white/40 rotate-180" />
                  </button>
                  <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                    {editTab === 'main' ? 'Edit Profile' : `Edit ${editTab}`}
                  </h2>
                </div>
                <button onClick={() => setShowEditProfile(false)} className="p-2 hover:bg-white/5 rounded-full text-white/40"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {editTab === 'main' ? (
                  <div className="space-y-4">
                    <button 
                      onClick={() => setEditTab('username')}
                      className="w-full p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold text-sm">Username</p>
                          <p className="text-white/40 text-xs">{user.username}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-amber-500 transition-colors" />
                    </button>

                    <button 
                      onClick={() => setEditTab('info')}
                      className="w-full p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold text-sm">Personal Info</p>
                          <p className="text-white/40 text-xs">{user.age}Y • {user.gender}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-amber-500 transition-colors" />
                    </button>

                    <button 
                      onClick={() => setEditTab('bio')}
                      className="w-full p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                          <Edit3 className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold text-sm">Biography</p>
                          <p className="text-white/40 text-xs truncate max-w-[200px]">{user.bio || 'No bio set'}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-amber-500 transition-colors" />
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => pfpInputRef.current?.click()}
                        className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex flex-col items-center gap-3 group"
                      >
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <Camera className="w-6 h-6 text-amber-500" />
                        </div>
                        <p className="text-white font-bold text-xs uppercase tracking-widest">Upload PFP</p>
                      </button>
                      <button 
                        onClick={() => bannerInputRef.current?.click()}
                        className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex flex-col items-center gap-3 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                          <Image className="w-6 h-6 text-pink-500" />
                        </div>
                        <p className="text-white font-bold text-xs uppercase tracking-widest">Upload Banner</p>
                      </button>
                    </div>

                    <input 
                      type="file" 
                      ref={pfpInputRef} 
                      onChange={(e) => handleFileUpload(e, 'pfp')} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <input 
                      type="file" 
                      ref={bannerInputRef} 
                      onChange={(e) => handleFileUpload(e, 'banner')} 
                      accept="image/*" 
                      className="hidden" 
                    />

                    <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => {
                          setShowEditProfile(false);
                          setShowCustomizer(true);
                        }}
                        className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-xs uppercase tracking-widest hover:bg-amber-500/20 transition-all"
                      >
                        Customisation
                      </button>
                      <button 
                        onClick={() => {
                          setShowEditProfile(false);
                          setShowWallet(true);
                        }}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                      >
                        Wallet
                      </button>
                    </div>
                  </div>
                ) : editTab === 'username' ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">New Username</label>
                      <input 
                        type="text"
                        defaultValue={user.username}
                        onBlur={(e) => updateCustomization('username', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <button 
                      onClick={() => setEditTab('main')}
                      className="w-full py-4 rounded-2xl bg-amber-500 text-black font-bold uppercase tracking-widest text-sm shadow-xl"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : editTab === 'info' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Age</label>
                        <input 
                          type="number"
                          defaultValue={user.age}
                          onBlur={(e) => updateCustomization('age', parseInt(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Gender</label>
                        <select 
                          defaultValue={user.gender}
                          onChange={(e) => updateCustomization('gender', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none"
                        >
                          <option value="male" className="bg-zinc-900">Male</option>
                          <option value="female" className="bg-zinc-900">Female</option>
                          <option value="other" className="bg-zinc-900">Other</option>
                        </select>
                      </div>
                    </div>
                    <button 
                      onClick={() => setEditTab('main')}
                      className="w-full py-4 rounded-2xl bg-amber-500 text-black font-bold uppercase tracking-widest text-sm shadow-xl"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : editTab === 'bio' ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Biography</label>
                      <textarea 
                        defaultValue={user.bio}
                        onBlur={(e) => updateCustomization('bio', e.target.value)}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500/50 resize-none"
                        placeholder="Tell the world about yourself..."
                      />
                    </div>
                    <button 
                      onClick={() => setEditTab('main')}
                      className="w-full py-4 rounded-2xl bg-amber-500 text-black font-bold uppercase tracking-widest text-sm shadow-xl"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : editTab === 'pfp' ? (
                  <div className="space-y-6 flex flex-col items-center">
                    <div className="relative">
                      <img src={user.pfp} className="w-48 h-48 rounded-full border-4 border-amber-500 object-cover shadow-2xl" />
                      <button 
                        onClick={() => pfpInputRef.current?.click()}
                        className="absolute bottom-2 right-2 p-4 rounded-full bg-amber-500 text-black shadow-xl hover:scale-110 transition-transform"
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                    </div>
                    <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Click the camera to upload a new profile picture</p>
                    <button 
                      onClick={() => setEditTab('main')}
                      className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-sm"
                    >
                      Back to Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 flex flex-col items-center">
                    <div className="relative w-full h-48 rounded-3xl overflow-hidden border-4 border-amber-500 shadow-2xl">
                      <img src={user.banner} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => bannerInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <div className="p-4 rounded-full bg-white text-black">
                          <Camera className="w-6 h-6" />
                        </div>
                      </button>
                    </div>
                    <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Click the banner to upload a new one</p>
                    <button 
                      onClick={() => setEditTab('main')}
                      className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-sm"
                    >
                      Back to Menu
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
