import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, where, increment, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { UserProfile, Message, Theme, CardStyle, UserRank } from '../types';
import { THEMES, CARD_STYLES, AVATARS, BANNERS, RANKS, RankInfo, BORDERS, PROFILE_EFFECTS } from '../constants';
import { 
  Send, 
  LogOut, 
  Users, 
  Infinity, 
  Circle, 
  Shield, 
  Crown, 
  Wallet, 
  Gem, 
  Coins, 
  AlertCircle, 
  Dice1, 
  Dice2, 
  Dice3, 
  Dice4, 
  Dice5, 
  Dice6, 
  Palette, 
  X, 
  Check, 
  Edit3, 
  Heart, 
  User, 
  UserPlus,
  Image, 
  Camera, 
  ChevronRight,
  Search,
  ArrowUp,
  Star,
  Bell,
  Newspaper,
  RefreshCw,
  BookOpen,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
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
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newsPosts, setNewsPosts] = useState<any[]>([]);
  const [appUpdates, setAppUpdates] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [editTab, setEditTab] = useState<'username' | 'info' | 'bio' | 'pfp' | 'banner' | 'main' | 'rank'>('main');
  const [customizerTab, setCustomizerTab] = useState<'themes' | 'cards' | 'borders' | 'effects'>('themes');
  const [toast, setToast] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
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

  const [customRankForm, setCustomRankForm] = useState({
    name: user.customRank?.name || '',
    icon: user.customRank?.icon || ''
  });
  const customRankInputRef = useRef<HTMLInputElement>(null);

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

      // Rank Protection
      if (!user.rank) {
        updates.rank = 'VIP';
        needsUpdate = true;
      }

      if (needsUpdate) {
        await updateDoc(doc(db, 'users', user.uid), updates);
      }
    };

    fixBalances();
  }, [user.gold, user.rubies, user.hasReceivedReset, user.uid, user.rank]);

  useEffect(() => {
    const checkRanks = async () => {
      // Force Developer Rank
      const devEmails = ['test@gmail.com', 'dev@gmail.com', 'developer@gmail.com', 'haydensixseven@gmail.com'];
      if (devEmails.includes(user.email.toLowerCase()) && user.rank !== 'DEVELOPER') {
        await updateDoc(doc(db, 'users', user.uid), { rank: 'DEVELOPER' });
        return;
      }

      // Only auto-update if user is currently a lower rank or a standard rank
      const standardRanks: UserRank[] = ['VIP', 'SUPER_VIP', 'ELITE', 'MILLIONAIRE', 'MANTIS', 'TIGER'];
      if (!standardRanks.includes(user.rank)) return;

      let newRank: UserRank = 'VIP';
      
      // Check for Millionaire (Top 3 Gold)
      const sortedByGold = [...allUsers].sort((a, b) => (b.gold || 0) - (a.gold || 0));
      const top3Gold = sortedByGold.slice(0, 3).map(u => u.uid);
      
      if (top3Gold.includes(user.uid)) {
        newRank = 'MILLIONAIRE';
      } else if ((user.invites || 0) >= 20) {
        newRank = 'TIGER';
      } else if ((user.invites || 0) >= 5) {
        newRank = 'MANTIS';
      } else {
        // Check for Super VIP (1 month)
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const createdAt = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
        if (createdAt < oneMonthAgo) {
          newRank = 'SUPER_VIP';
        }
      }

      const currentRankPriority = RANKS.find(r => r.id === user.rank)?.priority || 0;
      const newRankPriority = RANKS.find(r => r.id === newRank)?.priority || 0;

      if (newRank !== user.rank && newRankPriority > currentRankPriority) {
        await updateDoc(doc(db, 'users', user.uid), { rank: newRank });
      }
    };

    if (allUsers.length > 0) {
      checkRanks();
    }
  }, [user.uid, user.invites, user.gold, user.createdAt, user.rank, allUsers]);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setNotifications(notifs);
      setUnreadNotifications(notifs.filter(n => !n.read).length);
    });
    return () => unsubscribe();
  }, [user.uid]);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('timestamp', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setNewsPosts(news);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'updates'), orderBy('timestamp', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updates = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setAppUpdates(updates);
    });
    return () => unsubscribe();
  }, []);

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
      // Sort by rank priority
      const sortedUsers = [...users].sort((a, b) => {
        const rankA = RANKS.find(r => r.id === a.rank)?.priority || 0;
        const rankB = RANKS.find(r => r.id === b.rank)?.priority || 0;
        return rankB - rankA;
      });
      setOnlineUsers(sortedUsers);
    });

    // Fetch all users for admin panel
    const allUsersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data() as UserProfile);
      setAllUsers(users);
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
      allUsersUnsubscribe();
      setOffline();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user.uid]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const updateCustomization = async (field: 'theme' | 'cardStyle' | 'border' | 'profileEffect' | 'username' | 'age' | 'gender' | 'bio' | 'pfp' | 'banner', value: any) => {
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
        
        // Send notification if viewing someone else's profile
        if (uid !== user.uid) {
          await addDoc(collection(db, 'notifications'), {
            userId: uid,
            senderId: user.uid,
            senderUsername: user.username,
            senderPfp: user.pfp,
            type: 'profile_view',
            read: false,
            timestamp: serverTimestamp()
          });
        }
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

      // Send notification if liking someone else's profile
      if (!isLiked && targetUid !== user.uid) {
        await addDoc(collection(db, 'notifications'), {
          userId: targetUid,
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          type: 'profile_like',
          read: false,
          timestamp: serverTimestamp()
        });
      }
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

  const handleRankIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      showToast('File too large! Max 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setCustomRankForm(prev => ({ ...prev, icon: base64String }));
      showToast('Rank icon uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const saveCustomRank = async () => {
    if (!customRankForm.name || !customRankForm.icon) {
      showToast('Name and icon are required for a custom rank');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        customRank: customRankForm
      });
      showToast('Custom rank saved!');
      setEditTab('main');
    } catch (err) {
      console.error(err);
      showToast('Failed to save custom rank');
    }
  };

  const resetCustomRank = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        customRank: null
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
      showToast('Failed to reset custom rank');
    }
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

  const playNotificationSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Audio play failed', e));
  };

  const prevUnreadRef = useRef(unreadNotifications);
  useEffect(() => {
    if (unreadNotifications > prevUnreadRef.current) {
      playNotificationSound();
    }
    prevUnreadRef.current = unreadNotifications;
  }, [unreadNotifications]);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const text = newMessage.trim();
    setNewMessage('');

    // Command Parsing
    if (text.startsWith('/')) {
      const parts = text.split(' ');
      const command = parts[0].toLowerCase();

      if (command === '/ranks') {
        if (user.rank !== 'DEVELOPER') {
          showToast('Only developers can use this command.');
          return;
        }
        const ranksList = RANKS.map(r => r.id).join(', ');
        showToast(`Available ranks: ${ranksList}`);
        return;
      }

      if (command === '/rank') {
        if (user.rank !== 'DEVELOPER') {
          showToast('Only developers can use this command.');
          return;
        }
        const targetUsername = parts[1];
        const targetRankId = parts[2]?.toUpperCase();

        if (!targetUsername || !targetRankId) {
          showToast('Usage: /rank {username} {rank_id}');
          return;
        }

        const targetUser = allUsers.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
        if (!targetUser) {
          showToast('User not found.');
          return;
        }

        const rankExists = RANKS.find(r => r.id === targetRankId);
        if (!rankExists) {
          showToast('Invalid rank. Use /ranks to see available ranks.');
          return;
        }

        try {
          await updateDoc(doc(db, 'users', targetUser.uid), { rank: targetRankId });
          showToast(`Rank updated for ${targetUsername} to ${targetRankId}`);
        } catch (err) {
          console.error(err);
          showToast('Failed to update rank.');
        }
        return;
      }

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

      if (command === '/bank') {
        await addDoc(collection(db, 'messages'), {
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🏦 BANK: I currently have ${user.gold.toLocaleString()} Gold and ${user.rubies.toLocaleString()} Rubies!`,
          type: 'text',
          timestamp: serverTimestamp(),
        });
        return;
      }

      if (command === '/clear' || command === '/clearchat') {
        if (user.rank !== 'DEVELOPER') {
          showToast('Only developers can use this command.');
          return;
        }
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
        senderRank: user.rank || 'VIP',
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
          {/* Sidebar Toggle */}
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/80"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* Rules Toggle */}
          <button 
            onClick={() => setShowRules(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Rules</span>
          </button>

          {/* Updates Toggle */}
          <button 
            onClick={() => setShowUpdates(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Updates</span>
          </button>

          {/* News Toggle */}
          <button 
            onClick={() => setShowNews(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <Newspaper className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">News</span>
          </button>

          {/* Notifications Toggle */}
          <button 
            onClick={() => {
              setShowNotifications(true);
              // Mark all as read
              notifications.filter(n => !n.read).forEach(n => {
                updateDoc(doc(db, 'notifications', n.id), { read: true });
              });
            }}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Notifs</span>
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></span>
            )}
          </button>

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
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 custom-scrollbar">
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
                      {(msg.senderRank || allUsers.find(u => u.uid === msg.senderId)?.rank) && (
                        <img 
                          src={allUsers.find(u => u.uid === msg.senderId)?.customRank?.icon || RANKS.find(r => r.id === (msg.senderRank || allUsers.find(u => u.uid === msg.senderId)?.rank || 'VIP'))?.icon} 
                          className="w-3.5 h-3.5 object-contain"
                          alt="rank"
                        />
                      )}
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
        <aside className={cn(
          "fixed inset-y-0 right-0 z-40 w-80 bg-black/90 backdrop-blur-md flex flex-col transition-transform lg:static lg:transform-none",
          showSidebar ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}>
          <div className="p-8 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-serif italic text-white text-lg flex items-center gap-3">
              <Users className="w-5 h-5 text-amber-500" />
              Online Now
            </h2>
            <button onClick={() => setShowSidebar(false)} className="lg:hidden text-white/60">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-8 py-4 border-b border-white/10">
            <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/5 text-white/60 border border-white/10 inline-block">
              {onlineUsers.length} Online
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
                      <img 
                        src={u.customRank?.icon || RANKS.find(r => r.id === (u.rank || 'VIP'))?.icon} 
                        className="w-3.5 h-3.5 object-contain"
                        alt="rank"
                      />
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
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-serif text-white">{user.username}</p>
                    <img 
                      src={user.customRank?.icon || RANKS.find(r => r.id === (user.rank || 'VIP'))?.icon} 
                      className="w-3.5 h-3.5 object-contain"
                      alt="rank"
                    />
                  </div>
              </div>
            </div>
            {/* Quick Wallet Stats */}
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
                  <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto custom-scrollbar">
                    <button 
                      onClick={() => setCustomizerTab('themes')}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                        customizerTab === 'themes' ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"
                      )}
                    >
                      Themes
                    </button>
                    <button 
                      onClick={() => setCustomizerTab('cards')}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                        customizerTab === 'cards' ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"
                      )}
                    >
                      User Cards
                    </button>
                    <button 
                      onClick={() => setCustomizerTab('borders')}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                        customizerTab === 'borders' ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"
                      )}
                    >
                      Borders
                    </button>
                    <button 
                      onClick={() => setCustomizerTab('effects')}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                        customizerTab === 'effects' ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"
                      )}
                    >
                      Effects
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
                ) : customizerTab === 'cards' ? (
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
                ) : customizerTab === 'borders' ? (
                  <div className="space-y-12">
                    {['Basic', 'Special'].map(category => {
                      const categoryBorders = BORDERS.filter(b => b.category === category);
                      if (categoryBorders.length === 0) return null;

                      return (
                        <div key={category} className="space-y-6">
                          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-[0.3em] pl-2 border-l-2 border-amber-500">{category}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryBorders.map(b => (
                              <button
                                key={b.id}
                                onClick={() => updateCustomization('border', b.id)}
                                className={cn(
                                  "group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-4 bg-white/5",
                                  user.border === b.id ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]" : "border-white/5 hover:border-white/20"
                                )}
                              >
                                <div className={cn("w-16 h-16 rounded-full", b.className)} />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest text-center px-2">{b.name}</span>
                                {user.border === b.id && <Check className="absolute top-2 right-2 w-4 h-4 text-amber-500" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : customizerTab === 'effects' ? (
                  <div className="space-y-12">
                    {['Basic', 'Weather', 'Cyber', 'Material', 'Elements', 'Space', 'Party'].map(category => {
                      const categoryEffects = PROFILE_EFFECTS.filter(e => e.category === category);
                      if (categoryEffects.length === 0) return null;

                      return (
                        <div key={category} className="space-y-6">
                          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-[0.3em] pl-2 border-l-2 border-amber-500">{category}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryEffects.map(e => (
                              <button
                                key={e.id}
                                onClick={() => updateCustomization('profileEffect', e.id)}
                                className={cn(
                                  "group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.02] active:scale-95 bg-zinc-900",
                                  user.profileEffect === e.id ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]" : "border-white/5 hover:border-white/20"
                                )}
                              >
                                <div className={cn("absolute inset-0", e.className)} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                  <span className="text-xs font-bold text-white uppercase tracking-widest">{e.name}</span>
                                  {user.profileEffect === e.id && <Check className="w-4 h-4 text-amber-500" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
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
              className={cn(
                "relative w-full max-w-xl bg-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col",
                BORDERS.find(b => b.id === selectedProfile.border)?.className || "border border-white/10"
              )}
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
                <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
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
                {/* Profile Effect Container */}
                {selectedProfile.profileEffect && (
                  <div className={cn("absolute inset-0 z-0 rounded-b-[3rem] overflow-hidden pointer-events-none", PROFILE_EFFECTS.find(e => e.id === selectedProfile.profileEffect)?.className)} />
                )}
                <div className="relative z-10">
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
                        className="w-32 h-32 rounded-full border-4 border-zinc-900 object-cover shadow-2xl transition-transform group-hover:scale-105 relative z-10"
                      />
                      {selectedProfile.uid === user.uid && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-zinc-900 rounded-full z-30" />
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
                      <img 
                        src={selectedProfile.customRank?.icon || RANKS.find(r => r.id === (selectedProfile.rank || 'VIP'))?.icon} 
                        className="w-6 h-6 object-contain"
                        alt="rank"
                      />
                      {selectedProfile.uid === 'admin' && <Shield className="w-5 h-5 text-amber-500" />}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <img 
                          src={selectedProfile.customRank?.icon || RANKS.find(r => r.id === (selectedProfile.rank || 'VIP'))?.icon} 
                          className="w-3 h-3 object-contain"
                          alt=""
                        />
                        {selectedProfile.customRank?.name || RANKS.find(r => r.id === (selectedProfile.rank || 'VIP'))?.name}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest">
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

                    <button 
                      onClick={() => setEditTab('rank')}
                      className="w-full p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                          <Star className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold text-sm">Custom Rank</p>
                          <p className="text-white/40 text-xs truncate max-w-[200px]">{user.customRank?.name || 'Create custom rank'}</p>
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

                    <div className="pt-4 border-t border-white/10">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">Invites</p>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">{user.invites || 0} Total Invites</p>
                          </div>
                        </div>
                      </div>
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
                ) : editTab === 'rank' ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <img 
                            src={customRankForm.icon || RANKS.find(r => r.id === user.rank)?.icon} 
                            className="w-24 h-24 rounded-xl object-contain bg-black/20 p-2 border border-white/10" 
                          />
                          <button 
                            onClick={() => customRankInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 p-2 rounded-full bg-amber-500 text-black shadow-xl hover:scale-110 transition-transform"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Upload Rank Icon (.gif or image)</p>
                        <input 
                          type="file" 
                          ref={customRankInputRef} 
                          onChange={handleRankIconUpload} 
                          accept="image/*" 
                          className="hidden" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Rank Name</label>
                        <input 
                          type="text" 
                          value={customRankForm.name}
                          onChange={(e) => setCustomRankForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500/50"
                          placeholder="Enter custom rank name..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={resetCustomRank}
                        className="flex-1 py-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold uppercase tracking-widest text-sm hover:bg-red-500/20 transition-colors"
                      >
                        Reset
                      </button>
                      <button 
                        onClick={saveCustomRank}
                        className="flex-1 py-4 rounded-2xl bg-amber-500 text-black font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-amber-400 transition-colors"
                      >
                        Save Rank
                      </button>
                    </div>
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
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-serif italic text-white">Notifications</h2>
                <button onClick={() => setShowNotifications(false)} className="p-2 rounded-full hover:bg-white/10 text-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-center text-white/40 py-8">No notifications yet</p>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <img src={notif.senderPfp} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="text-sm text-white/80">
                          <span className="font-bold text-white">{notif.senderUsername}</span>
                          {notif.type === 'profile_view' && ' viewed your profile'}
                          {notif.type === 'profile_like' && ' liked your profile'}
                          {notif.type === 'news_post' && ' posted a news update'}
                        </p>
                        <p className="text-xs text-white/40 mt-1">
                          {notif.timestamp?.toDate ? notif.timestamp.toDate().toLocaleString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-serif italic text-white">Rules</h2>
                <button onClick={() => setShowRules(false)} className="p-2 rounded-full hover:bg-white/10 text-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-amber-500 mb-4 uppercase tracking-widest">Staff Rules</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/80">
                    <li>Do not abuse your power.</li>
                    <li>Treat all members with respect.</li>
                    <li>Only use commands when necessary.</li>
                    <li>Keep the chat safe and friendly.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-400 mb-4 uppercase tracking-widest">Member Rules</h3>
                  <ul className="list-disc list-inside space-y-2 text-white/80">
                    <li>Be respectful to everyone.</li>
                    <li>No spamming or flooding the chat.</li>
                    <li>No NSFW content.</li>
                    <li>Listen to staff members.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUpdates && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-serif italic text-white">Updates</h2>
                <button onClick={() => setShowUpdates(false)} className="p-2 rounded-full hover:bg-white/10 text-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {user.rank === 'DEVELOPER' || user.rank === 'FOUNDER' ? (
                  <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Add Update</h3>
                    <input type="text" id="updateVersion" placeholder="Version (e.g. v1.1.0)" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white mb-4" />
                    <input type="text" id="updateTitle" placeholder="Title" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white mb-4" />
                    <textarea id="updateContent" placeholder="Content" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 h-24 resize-none"></textarea>
                    <button 
                      onClick={async () => {
                        const version = (document.getElementById('updateVersion') as HTMLInputElement).value;
                        const title = (document.getElementById('updateTitle') as HTMLInputElement).value;
                        const content = (document.getElementById('updateContent') as HTMLTextAreaElement).value;
                        if (!version || !title || !content) return;
                        await addDoc(collection(db, 'updates'), { version, title, content, timestamp: serverTimestamp() });
                        (document.getElementById('updateVersion') as HTMLInputElement).value = '';
                        (document.getElementById('updateTitle') as HTMLInputElement).value = '';
                        (document.getElementById('updateContent') as HTMLTextAreaElement).value = '';
                      }}
                      className="w-full py-3 rounded-xl bg-white text-black font-bold uppercase tracking-widest"
                    >
                      Post Update
                    </button>
                  </div>
                ) : null}

                {appUpdates.length === 0 ? (
                  <p className="text-center text-white/40 py-8">No updates yet</p>
                ) : (
                  appUpdates.map(update => (
                    <div key={update.id} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">{update.title}</h3>
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold">{update.version}</span>
                      </div>
                      <p className="text-white/80 whitespace-pre-wrap">{update.content}</p>
                      <p className="text-xs text-white/40 mt-4">
                        {update.timestamp?.toDate ? update.timestamp.toDate().toLocaleString() : 'Just now'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-serif italic text-white">News</h2>
                <button onClick={() => setShowNews(false)} className="p-2 rounded-full hover:bg-white/10 text-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {user.rank === 'DEVELOPER' || user.rank === 'FOUNDER' ? (
                  <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Add News Post</h3>
                    <textarea id="newsContent" placeholder="What's new?" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 h-24 resize-none"></textarea>
                    <input type="text" id="newsImage" placeholder="Image URL (optional)" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white mb-4" />
                    <button 
                      onClick={async () => {
                        const content = (document.getElementById('newsContent') as HTMLTextAreaElement).value;
                        const imageUrl = (document.getElementById('newsImage') as HTMLInputElement).value;
                        if (!content) return;
                        
                        const newPost = {
                          authorId: user.uid,
                          authorUsername: user.username,
                          authorPfp: user.pfp,
                          content,
                          imageUrl: imageUrl || null,
                          likes: [],
                          dislikes: [],
                          comments: [],
                          timestamp: serverTimestamp()
                        };
                        
                        await addDoc(collection(db, 'news'), newPost);
                        
                        // Notify everyone
                        allUsers.forEach(u => {
                          if (u.uid !== user.uid) {
                            addDoc(collection(db, 'notifications'), {
                              userId: u.uid,
                              senderId: user.uid,
                              senderUsername: user.username,
                              senderPfp: user.pfp,
                              type: 'news_post',
                              read: false,
                              timestamp: serverTimestamp()
                            });
                          }
                        });

                        (document.getElementById('newsContent') as HTMLTextAreaElement).value = '';
                        (document.getElementById('newsImage') as HTMLInputElement).value = '';
                      }}
                      className="w-full py-3 rounded-xl bg-white text-black font-bold uppercase tracking-widest"
                    >
                      Post News
                    </button>
                  </div>
                ) : null}

                {newsPosts.length === 0 ? (
                  <p className="text-center text-white/40 py-8">No news yet</p>
                ) : (
                  newsPosts.map(post => (
                    <div key={post.id} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <img src={post.authorPfp} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-bold text-white">{post.authorUsername}</p>
                          <p className="text-xs text-white/40">
                            {post.timestamp?.toDate ? post.timestamp.toDate().toLocaleString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                      <p className="text-white/80 whitespace-pre-wrap mb-4">{post.content}</p>
                      {post.imageUrl && (
                        <img src={post.imageUrl} alt="" className="w-full rounded-xl mb-4 object-cover max-h-96" />
                      )}
                      
                      <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                        <button 
                          onClick={async () => {
                            const postRef = doc(db, 'news', post.id);
                            const hasLiked = post.likes?.includes(user.uid);
                            const hasDisliked = post.dislikes?.includes(user.uid);
                            
                            let newLikes = post.likes || [];
                            let newDislikes = post.dislikes || [];
                            
                            if (hasLiked) {
                              newLikes = newLikes.filter((id: string) => id !== user.uid);
                            } else {
                              newLikes.push(user.uid);
                              newDislikes = newDislikes.filter((id: string) => id !== user.uid);
                            }
                            
                            await updateDoc(postRef, { likes: newLikes, dislikes: newDislikes });
                          }}
                          className={cn("flex items-center gap-2 text-sm", post.likes?.includes(user.uid) ? "text-amber-500" : "text-white/60 hover:text-white")}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes?.length || 0}
                        </button>
                        
                        <button 
                          onClick={async () => {
                            const postRef = doc(db, 'news', post.id);
                            const hasLiked = post.likes?.includes(user.uid);
                            const hasDisliked = post.dislikes?.includes(user.uid);
                            
                            let newLikes = post.likes || [];
                            let newDislikes = post.dislikes || [];
                            
                            if (hasDisliked) {
                              newDislikes = newDislikes.filter((id: string) => id !== user.uid);
                            } else {
                              newDislikes.push(user.uid);
                              newLikes = newLikes.filter((id: string) => id !== user.uid);
                            }
                            
                            await updateDoc(postRef, { likes: newLikes, dislikes: newDislikes });
                          }}
                          className={cn("flex items-center gap-2 text-sm", post.dislikes?.includes(user.uid) ? "text-red-500" : "text-white/60 hover:text-white")}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          {post.dislikes?.length || 0}
                        </button>

                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <MessageSquare className="w-4 h-4" />
                          {post.comments?.length || 0}
                        </div>
                      </div>

                      {/* Comments Section */}
                      <div className="mt-4 space-y-4">
                        {post.comments?.map((comment: any) => (
                          <div key={comment.id} className="flex gap-3 bg-black/20 p-3 rounded-xl">
                            <img src={comment.authorPfp} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="text-xs font-bold text-white">{comment.authorUsername}</p>
                              <p className="text-sm text-white/80">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            id={`comment-${post.id}`}
                            placeholder="Add a comment..." 
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white"
                            onKeyDown={async (e) => {
                              if (e.key === 'Enter') {
                                const input = e.currentTarget;
                                const text = input.value.trim();
                                if (!text) return;
                                
                                const newComment = {
                                  id: Date.now().toString(),
                                  authorId: user.uid,
                                  authorUsername: user.username,
                                  authorPfp: user.pfp,
                                  text,
                                  timestamp: new Date()
                                };
                                
                                await updateDoc(doc(db, 'news', post.id), {
                                  comments: [...(post.comments || []), newComment]
                                });
                                
                                input.value = '';
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
