import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { UserProfile, Message, Theme, CardStyle, UserRank, Border, ProfileEffect, Aura } from '../types';
import { THEMES, CARD_STYLES, AVATARS, BANNERS, RANKS, RankInfo, BORDERS, PROFILE_EFFECTS, AURAS, DEFAULT_PFP, DEFAULT_BANNER } from '../constants';
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
  UserMinus,
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
  ThumbsDown,
  ShieldAlert,
  Gift,
  Zap,
  Award,
  Smile,
  Terminal,
  Trash2,
  BarChart2,
  Youtube,
  Menu,
  Pin,
  PinOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from '@google/genai';
import confetti from 'canvas-confetti';
import Markdown from 'react-markdown';
import { UserOptions } from './UserOptions';
import { RatingModal } from './RatingModal';
import { ForceSpeakModal } from './ForceSpeakModal';
import { AdminModal } from './AdminModal';
import { DeveloperConsole } from './DeveloperConsole';
import { PollModal } from './PollModal';
import { RatingsList } from './RatingsList';
import { CustomizerPreview } from './CustomizerPreview';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface ChatProps {
  user: UserProfile;
}

const DiceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const SidebarItem = ({ 
  icon, 
  label, 
  onClick, 
  expanded, 
  badge, 
  variant = 'default' 
}: { 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void; 
  expanded: boolean; 
  badge?: number; 
  variant?: 'default' | 'danger' 
}) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative",
      expanded ? "px-4" : "justify-center",
      variant === 'danger' 
        ? "text-red-400 hover:bg-red-500/10 hover:text-red-500" 
        : "text-white/60 hover:bg-white/5 hover:text-white"
    )}
  >
    <div className="flex-shrink-0">{icon}</div>
    {expanded && (
      <motion.span 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xs font-bold uppercase tracking-widest whitespace-nowrap"
      >
        {label}
      </motion.span>
    )}
    {badge !== undefined && badge > 0 && (
      <div className={cn(
        "absolute bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black",
        expanded ? "right-4 w-5 h-5" : "top-2 right-2 w-4 h-4"
      )}>
        {badge}
      </div>
    )}
    {!expanded && (
      <div className="absolute left-full ml-4 px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
        {label}
      </div>
    )}
  </button>
);

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function Chat({ user }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showWallet, setShowWallet] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showCardEditor, setShowCardEditor] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showForceSpeakModal, setShowForceSpeakModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showStatusEditor, setShowStatusEditor] = useState(false);
  const [newStatus, setNewStatus] = useState(user.status || '');
  const [showRatingsList, setShowRatingsList] = useState(false);
  const [selectedUserForOptions, setSelectedUserForOptions] = useState<UserProfile | null>(null);
  const [selectedUserForRating, setSelectedUserForRating] = useState<UserProfile | null>(null);
  const [selectedUserForForceSpeak, setSelectedUserForForceSpeak] = useState<UserProfile | null>(null);
  const [selectedUserForAdmin, setSelectedUserForAdmin] = useState<UserProfile | null>(null);
  const [selectedUserForRatingsList, setSelectedUserForRatingsList] = useState<UserProfile | null>(null);
  const [adminAction, setAdminAction] = useState<'mute' | 'kick' | 'ban' | 'unmute' | 'unkick' | 'unban'>('mute');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarView, setSidebarView] = useState<'default' | 'search' | 'friends' | 'staff'>('default');
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [isLeftSidebarPinned, setIsLeftSidebarPinned] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newsPosts, setNewsPosts] = useState<any[]>([]);
  const [appUpdates, setAppUpdates] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [editTab, setEditTab] = useState<'username' | 'info' | 'bio' | 'pfp' | 'banner' | 'main' | 'rank' | 'youtube'>('main');
  const [customizerTab, setCustomizerTab] = useState<'themes' | 'cards' | 'borders' | 'effects' | 'auras'>('themes');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userSort, setUserSort] = useState<'lastOnline' | 'highestRank' | 'lastOffline' | 'newest' | 'lastSeen'>('highestRank');
  const [showFriendsOnly, setShowFriendsOnly] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [triviaActive, setTriviaActive] = useState(false);
  const [triviaQuestion, setTriviaQuestion] = useState<{q: string, a: string} | null>(null);
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

  const filteredUsers = allUsers
    .filter(u => {
      const matchesSearch = u.username.toLowerCase().includes(userSearch.toLowerCase());
      const matchesFriends = !showFriendsOnly || user.friends?.includes(u.uid);
      return matchesSearch && matchesFriends;
    })
    .sort((a, b) => {
      // Current user always first
      if (a.uid === user.uid) return -1;
      if (b.uid === user.uid) return 1;

      const priorityA = RANKS.find(r => r.id === a.rank)?.priority || 0;
      const priorityB = RANKS.find(r => r.id === b.rank)?.priority || 0;

      if (userSort === 'highestRank') {
        if (priorityA !== priorityB) return priorityB - priorityA;
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
        const timeA = a.lastSeen?.toMillis ? a.lastSeen.toMillis() : 0;
        const timeB = b.lastSeen?.toMillis ? b.lastSeen.toMillis() : 0;
        if (timeA !== timeB) return timeB - timeA;
        return a.username.localeCompare(b.username);
      }

      if (userSort === 'lastOnline') {
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
        const timeA = a.lastSeen?.toMillis ? a.lastSeen.toMillis() : 0;
        const timeB = b.lastSeen?.toMillis ? b.lastSeen.toMillis() : 0;
        if (timeA !== timeB) return timeB - timeA;
        return priorityB - priorityA;
      }

      if (userSort === 'lastOffline') {
        if (a.isOnline !== b.isOnline) return a.isOnline ? 1 : -1;
        const timeA = a.lastSeen?.toMillis ? a.lastSeen.toMillis() : 0;
        const timeB = b.lastSeen?.toMillis ? b.lastSeen.toMillis() : 0;
        if (timeA !== timeB) return timeB - timeA;
        return priorityB - priorityA;
      }

      if (userSort === 'newest') {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        if (timeA !== timeB) return timeB - timeA;
        return priorityB - priorityA;
      }

      return priorityB - priorityA;
    });

  const onlineCount = allUsers.filter(u => u.isOnline).length;
  const offlineCount = allUsers.length - onlineCount;

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

    const userBorder = BORDERS.find(b => b.id === u.border);

    return {
      className: cn(
        "flex items-center gap-4 group cursor-pointer p-3 rounded-2xl border transition-all",
        style.bgClass,
        userBorder && userBorder.id !== 'border-none' ? userBorder.className : style.borderClass
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
        await supabase.from('users').update(updates).eq('uid', user.uid);
      }
    };

    fixBalances();
  }, [user.gold, user.rubies, user.hasReceivedReset, user.uid, user.rank]);

  // Online Status & Activity Tracking
  useEffect(() => {
    const updateOnlineStatus = async (online: boolean) => {
      try {
        await supabase.from('users').update({
          isOnline: online,
          lastSeen: new Date().toISOString()
        }).eq('uid', user.uid);
      } catch (error) {
        console.error("Error updating online status:", error);
      }
    };

    const handleVisibilityChange = () => {
      updateOnlineStatus(document.visibilityState === 'visible');
    };

    const handleBeforeUnload = () => {
      updateOnlineStatus(false);
    };

    // Initial status
    updateOnlineStatus(true);

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Activity monitoring
    let activityTimeout: any;
    const resetActivity = () => {
      clearTimeout(activityTimeout);
      updateOnlineStatus(true);
      activityTimeout = setTimeout(() => {
        updateOnlineStatus(false);
      }, 300000); // 5 minutes of inactivity = offline
    };

    window.addEventListener('mousedown', resetActivity);
    window.addEventListener('keydown', resetActivity);
    window.addEventListener('scroll', resetActivity);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('mousedown', resetActivity);
      window.removeEventListener('keydown', resetActivity);
      window.removeEventListener('scroll', resetActivity);
      updateOnlineStatus(false);
    };
  }, [user.uid]);

  useEffect(() => {
    const checkRanks = async () => {
      // Force Developer Rank
      const devEmails = ['test@gmail.com', 'dev@gmail.com', 'developer@gmail.com', 'haydensixseven@gmail.com'];
      if (devEmails.includes(user.email.toLowerCase()) && user.rank !== 'DEVELOPER') {
        await supabase.from('users').update({ rank: 'DEVELOPER' }).eq('uid', user.uid);
        return;
      }

      // Only auto-update if user is currently a lower rank or a standard rank
      const standardRanks: UserRank[] = ['VIP', 'SUPER_VIP', 'ELITE', 'MILLIONAIRE', 'MANTIS', 'TIGER'];
      if (!standardRanks.includes(user.rank as UserRank)) return;

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
        await supabase.from('users').update({ rank: newRank }).eq('uid', user.uid);
      }
    };

    if (allUsers.length > 0) {
      checkRanks();
    }
  }, [user.uid, user.invites, user.gold, user.createdAt, user.rank, allUsers]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('userId', user.uid)
        .order('timestamp', { ascending: false })
        .limit(20);
      
      if (data) {
        setNotifications(data);
        setUnreadNotifications(data.filter(n => !n.read).length);
      }
    };

    fetchNotifications();

    const notifSubscription = supabase
      .channel('chat-notifications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `userId=eq.${user.uid}` }, fetchNotifications)
      .subscribe();

    return () => {
      supabase.removeChannel(notifSubscription);
    };
  }, [user.uid]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);
      if (data) setNewsPosts(data);
    };

    fetchNews();

    const newsSubscription = supabase
      .channel('chat-news-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, fetchNews)
      .subscribe();

    return () => {
      supabase.removeChannel(newsSubscription);
    };
  }, []);

  useEffect(() => {
    const fetchUpdates = async () => {
      const { data } = await supabase
        .from('updates')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);
      if (data) setAppUpdates(data);
    };

    fetchUpdates();

    const updatesSubscription = supabase
      .channel('chat-updates-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'updates' }, fetchUpdates)
      .subscribe();

    return () => {
      supabase.removeChannel(updatesSubscription);
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (data) {
        const newMsgs = data.reverse() as Message[];
        
        // Check if there's a new message that isn't from the current user
        if (messages.length > 0 && newMsgs.length > messages.length) {
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg.senderId !== user.uid && soundEnabled) {
            const receiveAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
            receiveAudio.volume = 0.5;
            receiveAudio.play().catch(() => {});
          }
        }
        
        setMessages(newMsgs);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    };

    fetchMessages();

    const messagesSubscription = supabase
      .channel('chat-messages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, fetchMessages)
      .subscribe();

    // Fetch all users
    const fetchAllUsers = async () => {
      const { data } = await supabase.from('users').select('*');
      if (data) {
        setAllUsers(data as UserProfile[]);
        setOnlineUsers((data as UserProfile[]).filter(u => u.isOnline));
      }
    };

    fetchAllUsers();

    const usersSubscription = supabase
      .channel('chat-users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchAllUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
      supabase.removeChannel(usersSubscription);
    };
  }, [user.uid]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const sendFriendRequest = async (targetUid: string) => {
    if (user.uid === targetUid) return;
    if (user.friends?.includes(targetUid)) {
      showToast('Already friends!');
      return;
    }
    
    const targetUser = allUsers.find(u => u.uid === targetUid);
    if (targetUser?.friendRequests?.includes(user.uid)) {
      showToast('Request already sent!');
      return;
    }

    try {
      const currentRequests = user.friendRequests || [];
      const newRequests = currentRequests.filter(id => id !== targetUid);
      const targetUserRequests = targetUser?.friendRequests || [];
      
      await supabase.from('users').update({
        friendRequests: [...targetUserRequests, user.uid]
      }).eq('uid', targetUid);
      showToast('Friend request sent!');
    } catch (e) {
      console.error(e);
      showToast('Error sending request');
    }
  };

  const acceptFriendRequest = async (targetUid: string) => {
    try {
      const myFriends = [...(user.friends || []), targetUid];
      const myRequests = (user.friendRequests || []).filter(id => id !== targetUid);
      
      const targetUser = allUsers.find(u => u.uid === targetUid);
      const theirFriends = [...(targetUser?.friends || []), user.uid];

      await supabase.from('users').update({
        friends: myFriends,
        friendRequests: myRequests
      }).eq('uid', user.uid);
      
      await supabase.from('users').update({
        friends: theirFriends
      }).eq('uid', targetUid);
      
      showToast('Friend request accepted!');
    } catch (e) {
      console.error(e);
      showToast('Error accepting request');
    }
  };

  const declineFriendRequest = async (targetUid: string) => {
    try {
      const myRequests = (user.friendRequests || []).filter(id => id !== targetUid);
      await supabase.from('users').update({
        friendRequests: myRequests
      }).eq('uid', user.uid);
      showToast('Friend request declined');
    } catch (e) {
      console.error(e);
    }
  };

  const unaddFriend = async (targetUid: string) => {
    try {
      const myFriends = (user.friends || []).filter(id => id !== targetUid);
      const targetUser = allUsers.find(u => u.uid === targetUid);
      const theirFriends = (targetUser?.friends || []).filter(id => id !== user.uid);

      await supabase.from('users').update({
        friends: myFriends
      }).eq('uid', user.uid);
      
      await supabase.from('users').update({
        friends: theirFriends
      }).eq('uid', targetUid);
      
      showToast('Friend removed');
    } catch (e) {
      console.error(e);
    }
  };

  const updateCustomization = async (field: 'theme' | 'cardStyle' | 'border' | 'profileEffect' | 'aura' | 'username' | 'age' | 'gender' | 'bio' | 'pfp' | 'banner' | 'profileVideoUrl', value: any) => {
    try {
      await supabase.from('users').update({ [field]: value }).eq('uid', user.uid);
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
      const { data } = await supabase.from('users').select('*').eq('uid', uid);
      if (data && data.length > 0) {
        setSelectedProfile(data[0] as UserProfile);
        setShowProfileModal(true);
        
        // Send notification if viewing someone else's profile
        if (uid !== user.uid) {
          await supabase.from('notifications').insert({
            userId: uid,
            senderId: user.uid,
            senderUsername: user.username,
            senderPfp: user.pfp,
            type: 'profile_view',
            read: false,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load profile');
    }
  };

  const handleProfileClick = (uid: string) => {
    const targetUser = allUsers.find(u => u.uid === uid);
    if (targetUser) {
      setSelectedUserForOptions(targetUser);
    }
  };

  const handleOpenNotifications = async () => {
    setShowNotifications(true);
    const unreadNotifs = notifications.filter(n => !n.read);
    if (unreadNotifs.length > 0) {
      for (const n of unreadNotifs) {
        await supabase.from('notifications').update({ read: true }).eq('id', n.id);
      }
    }
  };

  const handleVote = async (messageId: string, optionIndex: number) => {
    const msg = messages.find(m => m.id === messageId);
    if (!msg || !msg.pollData) return;
    
    const hasVoted = msg.pollData.options.some(o => o.voters?.includes(user.uid));
    if (hasVoted) return;

    const newOptions = [...msg.pollData.options];
    const option = { ...newOptions[optionIndex] };
    option.votes += 1;
    option.voters = [...(option.voters || []), user.uid];
    newOptions[optionIndex] = option;

    try {
      await supabase.from('messages').update({
        'pollData': { ...msg.pollData, options: newOptions }
      }).eq('id', messageId);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (targetUid: string) => {
    if (!user.uid) return;
    try {
      const isLiked = selectedProfile?.likes?.includes(user.uid);
      
      const newLikes = isLiked 
        ? (selectedProfile?.likes || []).filter(id => id !== user.uid)
        : [...(selectedProfile?.likes || []), user.uid];

      await supabase.from('users').update({ likes: newLikes }).eq('uid', targetUid);
      setSelectedProfile(prev => prev ? { ...prev, likes: newLikes } : null);
      showToast(isLiked ? 'Unliked profile' : 'Liked profile!');

      // Send notification if liking someone else's profile
      if (!isLiked && targetUid !== user.uid) {
        await supabase.from('notifications').insert({
          userId: targetUid,
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          type: 'profile_like',
          read: false,
          timestamp: new Date().toISOString()
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
      await supabase.from('users').update({
        customRank: customRankForm
      }).eq('uid', user.uid);
      showToast('Custom rank saved!');
      setEditTab('main');
    } catch (err) {
      console.error(err);
      showToast('Failed to save custom rank');
    }
  };

  const resetCustomRank = async () => {
    try {
      await supabase.from('users').update({
        customRank: null
      }).eq('uid', user.uid);
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
      await supabase.from('users').update({
        customThemes: [...(user.customThemes || []), theme],
        theme: themeId
      }).eq('uid', user.uid);
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
      await supabase.from('users').update({
        customCardStyles: [...(user.customCardStyles || []), card],
        cardStyle: cardId
      }).eq('uid', user.uid);
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

    // Moderation Check
    const now = new Date();
    if (user.bannedUntil && new Date(user.bannedUntil) > now) {
      showToast('You are banned and cannot send messages.');
      return;
    }
    if (user.kickedUntil && new Date(user.kickedUntil) > now) {
      showToast('You have been kicked and cannot send messages.');
      return;
    }
    if (user.mutedUntil && new Date(user.mutedUntil) > now) {
      showToast('You are muted and cannot send messages.');
      return;
    }

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
          await supabase.from('users').update({ rank: targetRankId }).eq('uid', targetUser.uid);
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

        const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
        const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
        
        if (balance <= 0 || isNaN(balance)) {
          showToast(`You have no ${currency} to gamble!`);
          return;
        }

        // Gamble logic
        const isDev = user.email === 'dev@gmail.com';
        const winChance = Math.random();
        const isWin = isDev ? true : winChance > 0.7; // 30% win chance (70% loss)
        const multiplier = isWin ? (isDev ? 100 : Math.floor(Math.random() * 99) + 2) : 0; // 2 to 100 if win
        const winAmount = balance * multiplier;
        const result = isWin ? 'won' : 'lost';

        // Update balance
        if (result === 'won') {
          await supabase.from('users').update({ [currency]: balance + winAmount }).eq('uid', user.uid);
        } else {
          await supabase.from('users').update({ [currency]: 0 }).eq('uid', user.uid);
        }

        // Broadcast result
        await supabase.from('messages').insert({
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
          timestamp: new Date().toISOString(),
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

        const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
        const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
        
        if (amount > balance) {
          showToast(`Insufficient ${currency}!`);
          return;
        }

        // Dice logic
        const isDev = user.email === 'dev@gmail.com';
        const diceRoll = isDev ? 6 : Math.floor(Math.random() * 6) + 1;
        const isWin = diceRoll === 6;
        let multiplier = isDev ? 50 : Math.floor(Math.random() * 50) + 1; // 1 to 50
        
        // Jackpot logic (1% chance for x1000 if win)
        const isJackpot = isWin && (isDev || Math.random() < 0.01);
        if (isJackpot) {
          multiplier = 1000;
        }

        const result = isWin ? 'won' : 'lost';
        const winAmount = result === 'won' ? amount * multiplier : amount;

        // Update balance
        const { data: currentUser } = await supabase.from('users').select(currency).eq('uid', user.uid).single();
        const currentBalance = currentUser?.[currency] || 0;
        
        if (result === 'won') {
          await supabase.from('users').update({ [currency]: currentBalance + (winAmount - amount) }).eq('uid', user.uid);
        } else {
          await supabase.from('users').update({ [currency]: currentBalance - amount }).eq('uid', user.uid);
        }

        // Broadcast result
        await supabase.from('messages').insert({
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
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (command === '/bank') {
        const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
        const currentGold = latestUser?.gold ?? user.gold;
        const currentRubies = latestUser?.rubies ?? user.rubies;

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🏦 BANK: I currently have ${currentGold.toLocaleString()} Gold and ${currentRubies.toLocaleString()} Rubies!`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (command === '/clear' || command === '/clearchat') {
        const isAdmin = user.rank === 'DEVELOPER' || user.rank === 'ADMINISTRATION' || user.rank === 'STAR' || user.rank === 'FOUNDER';
        if (!isAdmin) {
          showToast('Only admins can use this command.');
          return;
        }
        try {
          const { data: snapshot } = await supabase.from('messages').select('id');
          if (snapshot) {
            for (const doc of snapshot) {
              await supabase.from('messages').delete().eq('id', doc.id);
            }
          }
          showToast('Chat cleared!');
        } catch (err) {
          console.error(err);
          showToast('Failed to clear chat.');
        }
        return;
      }

      if (command === '/roll') {
        const isDev = user.email === 'dev@gmail.com';
        const max = parseInt(parts[1]) || 100;
        const result = isDev ? max : Math.floor(Math.random() * max) + 1;
        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🎲 Rolled a ${result} (1-${max})`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (command === '/flip') {
        const isDev = user.email === 'dev@gmail.com';
        const result = isDev ? 'Heads' : (Math.random() > 0.5 ? 'Heads' : 'Tails');
        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🪙 Flipped a coin: ${result}`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (command === '/8ball') {
        const question = parts.slice(1).join(' ');
        if (!question) {
          showToast('Ask a question! /8ball [question]');
          return;
        }
        const answers = ['Yes', 'No', 'Maybe', 'Definitely', 'Absolutely not', 'Ask again later', 'I doubt it', 'Without a doubt'];
        const answer = answers[Math.floor(Math.random() * answers.length)];
        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🎱 Question: ${question}\nAnswer: ${answer}`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (command === '/give' || command === '/pay') {
        const targetUsername = parts[1];
        const amount = parseInt(parts[2]);
        const currency = parts[3]?.toLowerCase() || 'gold';

        if (!targetUsername || isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies')) {
          showToast(`Usage: ${command} [username] [amount] [gold|rubies]`);
          return;
        }

        const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
        const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

        if (amount > balance) {
          showToast(`Insufficient ${currency}!`);
          return;
        }

        const targetUser = allUsers.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
        if (!targetUser) {
          showToast('User not found.');
          return;
        }

        if (targetUser.uid === user.uid) {
          showToast('You cannot pay yourself.');
          return;
        }

        try {
          const { data: currentUser } = await supabase.from('users').select(currency).eq('uid', user.uid).single();
          const { data: targetUserDb } = await supabase.from('users').select(currency).eq('uid', targetUser.uid).single();
          
          const currentBalance = currentUser?.[currency] || 0;
          const targetBalance = targetUserDb?.[currency] || 0;

          await supabase.from('users').update({ [currency]: currentBalance - amount }).eq('uid', user.uid);
          await supabase.from('users').update({ [currency]: targetBalance + amount }).eq('uid', targetUser.uid);
          
          await supabase.from('messages').insert({
            senderId: user.uid,
            senderUsername: user.username,
            senderPfp: user.pfp,
            senderRank: user.rank || 'VIP',
            text: `💸 Paid ${amount.toLocaleString()} ${currency} to ${targetUser.username}!`,
            type: 'text',
            timestamp: new Date().toISOString(),
          });
        } catch (err) {
          console.error(err);
          showToast('Failed to transfer currency');
        }
        return;
      }

      if (command === '/help') {
        const helpText = [
          "📜 **COMMANDS:**",
          "• `/pay {user} {amt} {gold|rubies}` - Transfer currency",
          "• `/dice {gold|rubies} {amt}` - Gamble with dice",
          "• `/allin {gold|rubies}` - Gamble everything",
          "• `/bank` - Show your balance",
          "• `/roll {max}` - Roll a random number",
          "• `/flip` - Flip a coin",
          "• `/8ball {q}` - Ask the magic 8-ball",
          "• `/shrug {msg}` - Add a shrug to your message",
          "• `/nudge` - Send a nudge to everyone",
          "• `/staff` - List online staff"
        ].join('\n');
        showToast('Check chat for help!');
        await supabase.from('messages').insert({
          senderId: null,
          senderUsername: 'SYSTEM',
          senderPfp: DEFAULT_PFP,
          text: helpText,
          type: 'system',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (command === '/staff') {
        const staffRanks = ['DEVELOPER', 'ADMINISTRATION', 'STAR', 'FOUNDER', 'MODERATOR'];
        const onlineStaff = allUsers.filter(u => u.isOnline && staffRanks.includes(u.rank || ''));
        const staffList = onlineStaff.length > 0 
          ? onlineStaff.map(s => `${s.username} (${s.rank})`).join(', ')
          : 'No staff online.';
        
        showToast('Online staff listed in chat.');
        await supabase.from('messages').insert({
          senderId: null,
          senderUsername: 'SYSTEM',
          senderPfp: DEFAULT_PFP,
          text: `🛡️ **ONLINE STAFF:** ${staffList}`,
          type: 'system',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (['/mute', '/unmute', '/kick', '/unkick', '/ban', '/unban'].includes(command)) {
        const isAdmin = user.rank === 'DEVELOPER' || user.rank === 'ADMINISTRATION' || user.rank === 'STAR' || user.rank === 'FOUNDER' || user.rank === 'MODERATOR';
        if (!isAdmin) {
          showToast('You do not have permission to use moderation commands.');
          return;
        }

        const targetUsername = parts[1];
        if (!targetUsername) {
          showToast(`Usage: ${command} [username]`);
          return;
        }

        const targetUser = allUsers.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
        if (!targetUser) {
          showToast('User not found.');
          return;
        }

        setSelectedUserForAdmin(targetUser);
        setAdminAction(command.substring(1) as any);
        setShowAdminModal(true);
        return;
      }

      if (command === '/nudge') {
        const targetUsername = parts[1];
        if (!targetUsername) {
          showToast('Usage: /nudge [username]');
          return;
        }

        const targetUser = allUsers.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
        if (!targetUser) {
          showToast('User not found.');
          return;
        }

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          text: `👉 ${user.username} nudged ${targetUser.username}!`,
          type: 'nudge',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (command === '/trivia') {
        if (triviaActive) {
          showToast('Trivia is already active!');
          return;
        }

        const questions = [
          { q: "What is the capital of France?", a: "paris" },
          { q: "What is 7 x 8?", a: "56" },
          { q: "Who wrote Romeo and Juliet?", a: "shakespeare" },
          { q: "What is the largest planet in our solar system?", a: "jupiter" },
          { q: "What is the chemical symbol for gold?", a: "au" }
        ];
        
        const randomQ = questions[Math.floor(Math.random() * questions.length)];
        setTriviaActive(true);
        setTriviaQuestion(randomQ);

        await supabase.from('messages').insert({
          senderId: null,
          senderUsername: 'System',
          senderPfp: DEFAULT_PFP,
          text: `🧠 TRIVIA TIME! First to answer correctly wins 50 Gold!\n\nQuestion: ${randomQ.q}`,
          type: 'system',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (command === '/rps') {
        const choice = parts[1]?.toLowerCase();
        if (!['rock', 'paper', 'scissors'].includes(choice)) {
          showToast('Usage: /rps [rock|paper|scissors]');
          return;
        }

        const choices = ['rock', 'paper', 'scissors'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        
        let result = 'tied';
        let winAmount = 0;
        if (
          (choice === 'rock' && botChoice === 'scissors') ||
          (choice === 'paper' && botChoice === 'rock') ||
          (choice === 'scissors' && botChoice === 'paper')
        ) {
          result = 'won';
          winAmount = 10;
        } else if (choice !== botChoice) {
          result = 'lost';
        }

        if (result === 'won') {
          const { data: currentUser } = await supabase.from('users').select('gold').eq('uid', user.uid).single();
          const currentGold = currentUser?.gold || 0;
          await supabase.from('users').update({ gold: currentGold + winAmount }).eq('uid', user.uid);
        }

        const emojiMap: Record<string, string> = { rock: '🪨', paper: '📄', scissors: '✂️' };

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          text: `Played RPS: ${emojiMap[choice]} vs ${emojiMap[botChoice]} (System)\nResult: You ${result}! ${result === 'won' ? `(+${winAmount} Gold)` : ''}`,
          type: 'rps',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      showToast('Invalid command!');
      return;
    }

    // Check for trivia answer
    if (triviaActive && triviaQuestion) {
      if (text.toLowerCase() === triviaQuestion.a) {
        setTriviaActive(false);
        setTriviaQuestion(null);
        
        const { data: currentUser } = await supabase.from('users').select('gold').eq('uid', user.uid).single();
        const currentGold = currentUser?.gold || 0;
        await supabase.from('users').update({ gold: currentGold + 50 }).eq('uid', user.uid);
        
        await supabase.from('messages').insert({
          senderId: null,
          senderUsername: 'System',
          senderPfp: DEFAULT_PFP,
          text: `🎉 ${user.username} answered correctly and won 50 Gold!\n\nAnswer: ${triviaQuestion.a}`,
          type: 'system',
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    try {
      // Add XP
      const currentXp = user.xp || 0;
      const currentLevel = user.level || 1;
      const xpGained = Math.floor(Math.random() * 10) + 5; // 5-15 XP per message
      const newXp = currentXp + xpGained;
      const xpNeeded = currentLevel * 100;
      
      let newLevel = currentLevel;
      if (newXp >= xpNeeded) {
        newLevel++;
        showToast(`🎉 Level Up! You are now level ${newLevel}!`);
        // Level up sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3');
        audio.play().catch(() => {});
      }

      await supabase.from('users').update({
        xp: newLevel > currentLevel ? newXp - xpNeeded : newXp,
        level: newLevel
      }).eq('uid', user.uid);

      // Easter Eggs
      const lowerText = text.toLowerCase();
      if (lowerText.includes('congrats') || lowerText.includes('congratulations')) {
         confetti({
           particleCount: 100,
           spread: 70,
           origin: { y: 0.6 }
         });
         showToast('🎉 CONGRATULATIONS! 🎉');
      } else if (lowerText.includes('happy birthday')) {
         confetti({
           particleCount: 150,
           spread: 100,
           origin: { y: 0.6 },
           colors: ['#FFC0CB', '#FF69B4', '#FF1493']
         });
         showToast('🎂 HAPPY BIRTHDAY! 🎈');
      } else if (lowerText.includes('stonks')) {
         showToast('📈 STONKS GO UP! 🚀');
      }

      // Play send sound
      const sendAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
      sendAudio.volume = 0.5;
      sendAudio.play().catch(() => {});

      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        senderRank: user.rank || 'VIP',
        text,
        type: 'text',
        timestamp: new Date().toISOString(),
      });

      // Mentions Logic
      const mentionRegex = /@([a-zA-Z0-9_]+)/g;
      const mentions = [...text.matchAll(mentionRegex)].map(m => m[1]);
      
      if (mentions.length > 0) {
        mentions.forEach(async (mentionedUsername) => {
          const targetUser = allUsers.find(u => u.username.toLowerCase() === mentionedUsername.toLowerCase());
          if (targetUser && targetUser.uid !== user.uid) {
            await supabase.from('notifications').insert({
              userId: targetUser.uid,
              senderId: user.uid,
              senderUsername: user.username,
              senderPfp: user.pfp,
              type: 'mention',
              read: false,
              timestamp: new Date().toISOString()
            });
          }
        });
      }

      // Bot Logic
      // UniBot is just a player now, no AI response logic.


    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      className={cn("h-screen flex flex-col overflow-hidden font-sans relative transition-all duration-500", currentTheme.textColor)}
      style={{ 
        background: currentTheme.background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: currentTheme.customStyles?.borderStyle || 'none',
        cursor: 'auto'
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
      <header 
        className={cn(
          "h-20 border-b flex items-center justify-between px-4 sm:px-8 z-20",
          currentTheme.customStyles?.glassEffect ? "backdrop-blur-2xl bg-black/20" : "bg-black/40",
          currentTheme.customStyles?.borderStyle ? "" : "border-white/10"
        )}
        style={{ borderBottom: currentTheme.customStyles?.borderStyle || undefined }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-serif italic bg-gradient-to-b from-amber-50 to-amber-200 bg-clip-text text-transparent tracking-tight drop-shadow-xl">
            Uni-Fy
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Wallet Display - Always Visible */}
          <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] sm:text-xs font-bold text-white">{(user.gold ?? 0).toLocaleString()}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Gem className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] sm:text-xs font-bold text-white">{(user.rubies ?? 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-white/10">
            <div className="text-right hidden md:block">
              <p className="text-sm font-serif text-white leading-none">{user.username}</p>
              <div className="flex items-center justify-end gap-1.5 mt-1">
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">{user.status || user.rank}</span>
              </div>
            </div>
            <img src={user.pfp || DEFAULT_PFP} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-white/20 object-cover shadow-xl" />
            <button 
              onClick={() => {
                setShowSidebar(true);
                setShowFriendsOnly(!showFriendsOnly);
              }}
              className={cn(
                "p-2 rounded-xl border transition-all flex items-center gap-2",
                showFriendsOnly 
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-500" 
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
              )}
            >
              <Heart className={cn("w-5 h-5", showFriendsOnly && "fill-current")} />
            </button>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        {/* Desktop Sidebar - Navigation */}
        <aside 
          onMouseEnter={() => !isLeftSidebarPinned && setShowLeftSidebar(true)}
          onMouseLeave={() => !isLeftSidebarPinned && setShowLeftSidebar(false)}
          className={cn(
            "hidden lg:flex flex-col transition-all duration-300",
            currentTheme.customStyles?.glassEffect ? "backdrop-blur-xl bg-black/20" : "bg-black/40",
            currentTheme.customStyles?.borderStyle ? "border-r" : "border-r border-white/10",
            (isLeftSidebarPinned || showLeftSidebar) ? "w-64" : "w-20"
          )}
          style={{ borderRight: currentTheme.customStyles?.borderStyle || undefined }}
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between overflow-hidden">
            <AnimatePresence>
              {(isLeftSidebarPinned || showLeftSidebar) && (
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="font-serif italic text-white text-lg whitespace-nowrap"
                >
                  Navigation
                </motion.h2>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsLeftSidebarPinned(!isLeftSidebarPinned)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isLeftSidebarPinned ? "text-amber-500 bg-amber-500/10" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <Pin className={cn("w-4 h-4", isLeftSidebarPinned ? "fill-current" : "")} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            <SidebarItem icon={<Gift className="w-5 h-5" />} label="Daily Reward" onClick={() => setShowDailyReward(true)} expanded={isLeftSidebarPinned || showLeftSidebar} />
            <SidebarItem 
              icon={<UserPlus className="w-5 h-5" />} 
              label="Friend Requests" 
              onClick={() => setShowFriendRequests(true)} 
              expanded={isLeftSidebarPinned || showLeftSidebar}
              badge={user.friendRequests?.length || undefined}
            />
            <SidebarItem icon={<Palette className="w-5 h-5" />} label="Customise" onClick={() => setShowCustomizer(true)} expanded={isLeftSidebarPinned || showLeftSidebar} />
            <SidebarItem 
              icon={<Bell className="w-5 h-5" />} 
              label="Notifications" 
              onClick={handleOpenNotifications} 
              expanded={isLeftSidebarPinned || showLeftSidebar}
              badge={unreadNotifications > 0 ? unreadNotifications : undefined}
            />
            <SidebarItem icon={<Newspaper className="w-5 h-5" />} label="News" onClick={() => setShowNews(true)} expanded={isLeftSidebarPinned || showLeftSidebar} />
            <SidebarItem icon={<RefreshCw className="w-5 h-5" />} label="Updates" onClick={() => setShowUpdates(true)} expanded={isLeftSidebarPinned || showLeftSidebar} />
            <SidebarItem icon={<BookOpen className="w-5 h-5" />} label="Rules" onClick={() => setShowRules(true)} expanded={isLeftSidebarPinned || showLeftSidebar} />
            {user.rank === 'DEVELOPER' && (
              <SidebarItem icon={<Terminal className="w-5 h-5" />} label="Dev Console" onClick={() => setShowAdminPanel(true)} expanded={isLeftSidebarPinned || showLeftSidebar} variant="danger" />
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0 overflow-x-hidden">
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
                    {/* Aura Layer */}
                    {msgUser?.aura && msgUser.aura !== 'aura-none' && (
                      <div className={cn("absolute -inset-1.5 z-0 rounded-full", AURAS.find(a => a.id === msgUser.aura)?.className)} />
                    )}
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
                      {/* Removed pet */}
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
                placeholder="Share your thoughts or try /roll..."
                className="flex-1 bg-transparent px-6 py-3 focus:outline-none text-white placeholder:text-white/20 text-sm"
              />
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={cn(
                  "px-4 transition-colors",
                  soundEnabled ? "text-amber-500 hover:text-amber-400" : "text-white/40 hover:text-white"
                )}
                title={soundEnabled ? "Mute sounds" : "Enable sounds"}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => setShowPollModal(true)}
                className="px-4 text-white/40 hover:text-white transition-colors"
              >
                <BarChart2 className="w-5 h-5" />
              </button>
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

        {/* Sidebar - Online Users */}
        <aside 
          className={cn(
            "fixed inset-y-0 right-0 z-50 w-80 flex flex-col transition-transform lg:static lg:transform-none",
            currentTheme.customStyles?.glassEffect ? "backdrop-blur-2xl bg-black/20" : "bg-black/95 lg:bg-black/40 lg:backdrop-blur-xl",
            currentTheme.customStyles?.borderStyle ? "border-l" : "border-l border-white/10",
            showSidebar ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          )}
          style={{ borderLeft: currentTheme.customStyles?.borderStyle || undefined }}
        >
          <div className="p-6 border-b border-white/10 space-y-4 min-h-[160px] flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSidebarView('default')}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    sidebarView === 'default' ? "text-amber-500 bg-amber-500/10" : "text-white/40 hover:text-white"
                  )}
                >
                  <Users className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSidebarView('search')}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    sidebarView === 'search' ? "text-amber-500 bg-amber-500/10" : "text-white/40 hover:text-white"
                  )}
                >
                  <Search className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSidebarView('friends')}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    sidebarView === 'friends' ? "text-amber-500 bg-amber-500/10" : "text-white/40 hover:text-white"
                  )}
                  title="Friends"
                >
                  <UserPlus className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSidebarView('staff')}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    sidebarView === 'staff' ? "text-amber-500 bg-amber-500/10" : "text-white/40 hover:text-white"
                  )}
                  title="Staff"
                >
                  <Shield className="w-5 h-5" />
                </button>
              </div>
              <button onClick={() => setShowSidebar(false)} className="p-2 text-white/40 hover:text-white lg:hidden">
                <X className="w-6 h-6" />
              </button>
            </div>

            {sidebarView === 'default' && (
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                <span className="text-green-500">Online: {onlineCount}</span>
                <span className="text-white/20">•</span>
                <span className="text-white/40">Offline: {offlineCount}</span>
              </div>
            )}

            {sidebarView === 'staff' && (
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                🛡️ Staff Members
              </div>
            )}

            {sidebarView === 'search' && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
                <select 
                  value={userSort}
                  onChange={(e) => setUserSort(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/60 focus:outline-none focus:border-amber-500/50 transition-colors"
                >
                  <option value="lastOnline">Last Online</option>
                  <option value="highestRank">Highest Rank</option>
                  <option value="lastOffline">Last Offline</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            )}

            {sidebarView === 'friends' && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Your Friends
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {(sidebarView === 'friends' ? allUsers.filter(u => user.friends?.includes(u.uid)) : filteredUsers).map((u) => {
              const { className, style, textClass } = getCardStyles(u);
              return (
                <div 
                  key={u.uid} 
                  className={cn(className, "cursor-pointer")}
                  style={style}
                  onClick={() => {
                    handleProfileClick(u.uid);
                    if (window.innerWidth < 1024) setShowSidebar(false);
                  }}
                >
                  <div className="relative">
                    {/* Aura Layer */}
                    {u.aura && u.aura !== 'aura-none' && (
                      <div className={cn("absolute -inset-1.5 z-0 rounded-full", AURAS.find(a => a.id === u.aura)?.className)} />
                    )}
                    <img 
                      src={u.pfp} 
                      className="w-10 h-10 rounded-full border border-white/20 object-cover relative z-10" 
                    />
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-black rounded-full z-20",
                      u.isOnline ? "bg-green-500" : "bg-zinc-600"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={cn("text-sm font-serif truncate", textClass)}>{u.username}</p>
                      <img 
                        src={u.customRank?.icon || RANKS.find(r => r.id === (u.rank || 'VIP'))?.icon || ''} 
                        className="w-3.5 h-3.5 object-contain"
                        alt="rank"
                      />
                      {/* Removed pet */}
                    </div>
                    <p className="text-[10px] opacity-40 uppercase tracking-widest mt-0.5">{u.status || u.rank}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* User Mini Profile */}
          <div className="p-6 border-t border-white/10 bg-black/60">
            <div className="relative h-28 rounded-xl overflow-hidden border border-white/10 mb-3 group">
              <img src={user.banner || DEFAULT_BANNER} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-3">
                <div className="relative">
                  {/* Aura Layer */}
                  {user.aura && user.aura !== 'aura-none' && (
                    <div className={cn("absolute -inset-2 z-0 rounded-full", AURAS.find(a => a.id === user.aura)?.className)} />
                  )}
                  <img src={user.pfp || DEFAULT_PFP} className="w-12 h-12 rounded-full border-2 border-white/30 shadow-2xl object-cover relative z-10" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-serif text-white font-bold drop-shadow-md">{user.username}</p>
                    <img 
                      src={user.customRank?.icon || RANKS.find(r => r.id === (user.rank || 'VIP'))?.icon || ''} 
                      className="w-3.5 h-3.5 object-contain"
                      alt="rank"
                    />
                    {/* Removed pet */}
                  </div>
                  <button 
                    onClick={() => setShowStatusEditor(true)}
                    className="text-[10px] text-white/40 hover:text-white/60 text-left truncate max-w-[120px]"
                  >
                    {user.status || 'Set status...'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-4 z-40">
          <button onClick={() => setShowDailyReward(true)} className="flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
            <Gift className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Daily</span>
          </button>
          <button onClick={() => setShowCustomizer(true)} className="flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
            <Palette className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Style</span>
          </button>
          <button onClick={handleOpenNotifications} className="relative flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
            <Bell className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Notifs</span>
            {unreadNotifications > 0 && <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full" />}
          </button>
          <button onClick={() => setShowNews(true)} className="flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
            <Newspaper className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">News</span>
          </button>
          <button onClick={() => setShowSidebar(true)} className="flex flex-col items-center gap-1 text-white/60 hover:text-amber-500 transition-all">
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Users</span>
          </button>
        </nav>
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
              className={cn(
                "relative w-full max-w-5xl h-[80vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all",
                currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-[#0a0a0a]",
                currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-[2.5rem]",
                currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
              )}
              style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
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
                    <button 
                      onClick={() => setCustomizerTab('auras')}
                      className={cn(
                        "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                        customizerTab === 'auras' ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"
                      )}
                    >
                      Auras
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
              <div className="flex-1 overflow-hidden flex">
                {/* Left: Preview Area */}
                <div className="w-1/3 border-r border-white/5 p-6 bg-black/20">
                  <CustomizerPreview 
                    user={user} 
                    tab={customizerTab} 
                    selectedTheme={allThemes.find(t => t.id === user.theme)}
                    selectedCard={allCardStyles.find(s => s.id === user.cardStyle)}
                    selectedBorder={BORDERS.find(b => b.id === user.border)}
                    selectedEffect={PROFILE_EFFECTS.find(e => e.id === user.profileEffect)}
                    selectedAura={AURAS.find(a => a.id === user.aura)}
                  />
                </div>

                {/* Right: Options Area */}
                <div className="w-2/3 overflow-y-auto p-10 custom-scrollbar">
                  <div className="mb-8">
                    <input 
                      type="text"
                      placeholder={`Search ${customizerTab}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
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

                    {['Custom', 'Essentials', 'Aesthetic', 'Street', 'Brain Rot', 'Niche', 'Pop Culture', 'Special'].map(category => {
                      const categoryThemes = allThemes.filter(t => t.category === category && t.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
                                    background: t.background,
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
                      const categoryCards = allCardStyles.filter(s => s.category === category && s.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
                                    <img src={user.pfp || DEFAULT_PFP} className="w-10 h-10 rounded-full border border-white/20" />
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
                    {['Basic', 'Weather', 'Cyber', 'Elements', 'Space', 'Party', 'Funny'].map(category => {
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
                ) : customizerTab === 'auras' ? (
                  <div className="space-y-12">
                    {['Basic', 'Divine', 'Dark', 'Cyber', 'Space', 'Elements', 'Special'].map(category => {
                      const categoryAuras = AURAS.filter(a => a.category === category && a.name.toLowerCase().includes(searchQuery.toLowerCase()));
                      if (categoryAuras.length === 0) return null;

                      return (
                        <div key={category} className="space-y-6">
                          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-[0.3em] pl-2 border-l-2 border-amber-500">{category}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryAuras.map(a => (
                              <button
                                key={a.id}
                                onClick={() => updateCustomization('aura', a.id)}
                                className={cn(
                                  "group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-4 bg-white/5",
                                  user.aura === a.id ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]" : "border-white/5 hover:border-white/20"
                                )}
                              >
                                <div className="relative w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                                  <div className={cn("absolute -inset-4 rounded-full", a.className)} />
                                  <div className="w-8 h-8 rounded-full bg-white/20" />
                                </div>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest text-center px-2 z-10">{a.name}</span>
                                {user.aura === a.id && <Check className="absolute top-2 right-2 w-4 h-4 text-amber-500 z-10" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
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
                    <div className="flex-1 bg-white/5 rounded-xl" />
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
                    <img src={user.pfp || DEFAULT_PFP} className="w-12 h-12 rounded-full border border-white/20" />
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

            {/* YouTube Background Video (Full Screen Behind Card) */}
            {selectedProfile.profileVideoUrl && (
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <iframe
                  className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  src={`https://www.youtube.com/embed/${getYouTubeId(selectedProfile.profileVideoUrl)}?autoplay=1&mute=0&loop=1&playlist=${getYouTubeId(selectedProfile.profileVideoUrl)}&controls=0&showinfo=0&rel=0&enablejsapi=1&playsinline=1`}
                  allow="autoplay; encrypted-media"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn(
                "relative w-full max-w-xl overflow-hidden shadow-2xl flex flex-col transition-all",
                currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
                currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-[3rem]",
                selectedProfile.border ? BORDERS.find(b => b.id === selectedProfile.border)?.className : (currentTheme.customStyles?.borderStyle ? "" : "border border-white/10")
              )}
              style={{ border: !selectedProfile.border && currentTheme.customStyles?.borderStyle ? currentTheme.customStyles.borderStyle : undefined }}
            >
              {/* Profile Effect Container */}
              {selectedProfile.profileEffect && (
                <div className={cn("absolute inset-x-0 bottom-0 top-48 z-0 rounded-b-[3rem] overflow-hidden pointer-events-none", PROFILE_EFFECTS.find(e => e.id === selectedProfile.profileEffect)?.className)} />
              )}

              {/* Banner */}
              <div 
                className={cn(
                  "relative h-48 w-full overflow-hidden z-10",
                  selectedProfile.uid === user.uid && "cursor-pointer group"
                )}
                onClick={() => selectedProfile.uid === user.uid && bannerInputRef.current?.click()}
              >
                <img 
                  src={selectedProfile.banner || DEFAULT_BANNER} 
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
                <div className="absolute top-6 right-6 flex items-center gap-3 z-30">
                  {selectedProfile.uid !== user.uid && (
                    <button 
                      onClick={() => {
                        if (user.friends?.includes(selectedProfile.uid)) {
                          unaddFriend(selectedProfile.uid);
                        } else {
                          sendFriendRequest(selectedProfile.uid);
                        }
                      }}
                      className={cn(
                        "p-3 rounded-full backdrop-blur-md border transition-all hover:scale-110 active:scale-95",
                        user.friends?.includes(selectedProfile.uid)
                          ? "bg-red-500/20 border-red-500/50 text-red-500"
                          : (selectedProfile.friendRequests?.includes(user.uid) 
                              ? "bg-amber-500/20 border-amber-500/50 text-amber-500" 
                              : "bg-black/40 border-white/10 text-white/60 hover:text-white hover:bg-black/60")
                      )}
                      title={user.friends?.includes(selectedProfile.uid) ? "Unfriend" : (selectedProfile.friendRequests?.includes(user.uid) ? "Request Sent" : "Add Friend")}
                    >
                      {user.friends?.includes(selectedProfile.uid) ? <UserMinus className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    </button>
                  )}
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
              <div className="px-10 pb-10 -mt-16 relative z-20">
                <div className="relative z-10">
                  <div className="flex items-end justify-between mb-6">
                    <div 
                      className={cn(
                        "relative group",
                        selectedProfile.uid === user.uid && "cursor-pointer"
                      )}
                      onClick={() => selectedProfile.uid === user.uid && pfpInputRef.current?.click()}
                    >
                      {/* Aura Layer */}
                      {selectedProfile.aura && selectedProfile.aura !== 'aura-none' && (
                        <div className={cn("absolute -inset-4 z-0 rounded-full", AURAS.find(a => a.id === selectedProfile.aura)?.className)} />
                      )}
                      
                      <img 
                        src={selectedProfile.pfp || DEFAULT_PFP} 
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

                  {/* Recent Visitors */}
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Recent Visitors</p>
                    <div className="flex -space-x-2 overflow-hidden">
                      {notifications
                        .filter(n => n.type === 'profile_view' && n.userId === selectedProfile.uid)
                        .slice(0, 5)
                        .map((n, i) => {
                          const visitor = allUsers.find(u => u.uid === n.senderId);
                          const pfp = n.senderPfp || visitor?.pfp || DEFAULT_PFP;
                          return (
                            <img 
                              key={i}
                              src={pfp} 
                              title={n.senderUsername}
                              className="inline-block h-8 w-8 rounded-full ring-2 ring-zinc-900 object-cover" 
                            />
                          );
                        })}
                      {notifications.filter(n => n.type === 'profile_view' && n.userId === selectedProfile.uid).length === 0 && (
                        <p className="text-[10px] text-white/20 italic">No recent visitors</p>
                      )}
                    </div>
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

                    <button 
                      onClick={() => setEditTab('youtube')}
                      className="w-full p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center">
                          <Youtube className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-bold text-sm">YouTube Integration</p>
                          <p className="text-white/40 text-xs">Music or Video Background</p>
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
                ) : editTab === 'youtube' ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Video Background (YouTube URL)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="https://www.youtube.com/watch?v=..."
                            defaultValue={user.profileVideoUrl}
                            onBlur={(e) => {
                              const url = e.target.value;
                              updateCustomization('profileVideoUrl', url);
                            }}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500/50"
                          />
                          {user.profileVideoUrl && (
                            <button 
                              onClick={() => updateCustomization('profileVideoUrl', '')}
                              className="p-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-white/20 italic">Plays video in full background with audio.</p>
                      </div>
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
                      <img src={user.pfp || DEFAULT_PFP} className="w-48 h-48 rounded-full border-4 border-amber-500 object-cover shadow-2xl" />
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
                      <img src={user.banner || DEFAULT_BANNER} className="w-full h-full object-cover" />
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
              className={cn(
                "w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh] transition-all",
                currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
                currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
                currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
              )}
              style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
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
                          {notif.type === 'news_post' && ` posted: "${notif.content || 'News'}"`}
                          {notif.type === 'global_notification' && `: ${notif.content || 'Notification'}`}
                          {notif.type === 'mention' && ' mentioned you in chat'}
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

        {showFriendRequests && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh] transition-all",
                currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
                currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
                currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
              )}
              style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-serif italic text-white">Friend Requests</h2>
                <button onClick={() => setShowFriendRequests(false)} className="p-2 rounded-full hover:bg-white/10 text-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 space-y-2">
                {!user.friendRequests || user.friendRequests.length === 0 ? (
                  <p className="text-center text-white/40 py-8">No pending requests</p>
                ) : (
                  user.friendRequests.map(uid => {
                    const requester = allUsers.find(u => u.uid === uid);
                    if (!requester) return null;
                    return (
                      <div key={uid} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <img src={requester.pfp} alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white">{requester.username}</p>
                          <p className="text-xs text-white/40 uppercase tracking-widest">{requester.rank}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => acceptFriendRequest(uid)}
                            className="p-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => declineFriendRequest(uid)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
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
              className={cn(
                "w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] transition-all",
                currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
                currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
                currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
              )}
              style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
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
              className={cn(
                "w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] transition-all",
                currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
                currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
                currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
              )}
              style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
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
                        await supabase.from('updates').insert({ version, title, content, timestamp: new Date().toISOString() });
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
                        {update.timestamp ? new Date(update.timestamp).toLocaleString() : 'Just now'}
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
              className={cn(
                "w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-all",
                currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
                currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
                currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
              )}
              style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
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
                          timestamp: new Date().toISOString()
                        };
                        
                        await supabase.from('news').insert(newPost);
                        
                        // Notify everyone
                        allUsers.forEach(async (u) => {
                          if (u.uid !== user.uid) {
                            await supabase.from('notifications').insert({
                              userId: u.uid,
                              senderId: user.uid,
                              senderUsername: user.username,
                              senderPfp: user.pfp,
                              type: 'news_post',
                              content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
                              read: false,
                              timestamp: new Date().toISOString()
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
                            {post.timestamp ? new Date(post.timestamp).toLocaleString() : 'Just now'}
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
                            
                            await supabase.from('news').update({ likes: newLikes, dislikes: newDislikes }).eq('id', post.id);
                          }}
                          className={cn("flex items-center gap-2 text-sm", post.likes?.includes(user.uid) ? "text-amber-500" : "text-white/60 hover:text-white")}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes?.length || 0}
                        </button>
                        
                        <button 
                          onClick={async () => {
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
                            
                            await supabase.from('news').update({ likes: newLikes, dislikes: newDislikes }).eq('id', post.id);
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
                                
                                await supabase.from('news').update({
                                  comments: [...(post.comments || []), newComment]
                                }).eq('id', post.id);
                                
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
      <DeveloperConsole 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
        currentUser={user} 
      />

      <AnimatePresence>
        {showDailyReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "w-full max-w-sm overflow-hidden shadow-2xl flex flex-col transition-all",
                currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
                currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
                currentTheme.customStyles?.borderStyle ? "" : "border border-amber-500/30"
              )}
              style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
            >
              <div className="p-6 text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/50">
                  <Gift className="w-10 h-10 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-white mb-2">Daily Reward</h2>
                  <p className="text-sm text-white/60">Claim your daily login bonus!</p>
                </div>
                
                <div className="flex justify-center gap-4 py-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-500">+500</p>
                    <p className="text-xs text-white/40 uppercase tracking-widest">Gold</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">+10</p>
                    <p className="text-xs text-white/40 uppercase tracking-widest">Rubies</p>
                  </div>
                </div>

                <button 
                  onClick={async () => {
                    const lastClaim = user.lastDailyReward ? new Date(user.lastDailyReward) : new Date(0);
                    const now = new Date();
                    const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
                    
                    if (hoursSinceLastClaim < 24) {
                      showToast(`You can claim again in ${Math.ceil(24 - hoursSinceLastClaim)} hours`);
                      return;
                    }

                    const { data: currentUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
                    const currentGold = currentUser?.gold || 0;
                    const currentRubies = currentUser?.rubies || 0;

                    await supabase.from('users').update({
                      gold: currentGold + 500,
                      rubies: currentRubies + 10,
                      lastDailyReward: new Date().toISOString()
                    }).eq('uid', user.uid);

                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: ['#eab308', '#ef4444']
                    });

                    showToast('Daily reward claimed!');
                    setShowDailyReward(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  Claim Reward
                </button>
                <button 
                  onClick={() => setShowDailyReward(false)}
                  className="w-full py-3 rounded-2xl bg-white/5 text-white/60 font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {selectedUserForOptions && (
        <UserOptions 
          targetUser={selectedUserForOptions}
          currentUser={user}
          onClose={() => setSelectedUserForOptions(null)}
          onViewProfile={viewProfile}
          onRateProfile={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForRating(targetUser);
              setShowRatingModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onForceSpeak={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForForceSpeak(targetUser);
              setShowForceSpeakModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onMute={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForAdmin(targetUser);
              setAdminAction('mute');
              setShowAdminModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onUnmute={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForAdmin(targetUser);
              setAdminAction('unmute');
              setShowAdminModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onKick={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForAdmin(targetUser);
              setAdminAction('kick');
              setShowAdminModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onUnkick={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForAdmin(targetUser);
              setAdminAction('unkick');
              setShowAdminModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onBan={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForAdmin(targetUser);
              setAdminAction('ban');
              setShowAdminModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onUnban={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForAdmin(targetUser);
              setAdminAction('unban');
              setShowAdminModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onChangeRank={async (uid, rankId, isCustom) => {
            try {
              if (isCustom) {
                const { data: ranks } = await supabase.from('ranks').select('*');
                const customRank = ranks?.find((d: any) => d.id === rankId);
                if (customRank) {
                  await supabase.from('users').update({ rank: rankId, customRank: { name: customRank.name, icon: customRank.icon } }).eq('uid', uid);
                }
              } else {
                await supabase.from('users').update({ rank: rankId, customRank: null }).eq('uid', uid);
              }
            } catch (e) {
              console.error(e);
            }
            setSelectedUserForOptions(null);
          }}
          onViewRatings={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForRatingsList(targetUser);
              setShowRatingsList(true);
            }
            setSelectedUserForOptions(null);
          }}
        />
      )}

      {showRatingModal && selectedUserForRating && (
        <RatingModal
          targetUid={selectedUserForRating.uid}
          targetUsername={selectedUserForRating.username}
          currentUser={user}
          onClose={() => setShowRatingModal(false)}
        />
      )}

      {showForceSpeakModal && selectedUserForForceSpeak && (
        <ForceSpeakModal
          targetUid={selectedUserForForceSpeak.uid}
          targetUsername={selectedUserForForceSpeak.username}
          targetPfp={selectedUserForForceSpeak.pfp}
          onClose={() => setShowForceSpeakModal(false)}
        />
      )}
      {showAdminModal && selectedUserForAdmin && (
        <AdminModal
          targetUid={selectedUserForAdmin.uid}
          targetUsername={selectedUserForAdmin.username}
          action={adminAction}
          onClose={() => setShowAdminModal(false)}
        />
      )}

      {showPollModal && (
        <PollModal
          currentUser={user}
          onClose={() => setShowPollModal(false)}
        />
      )}

      {showRatingsList && selectedUserForRatingsList && (
        <RatingsList
          targetUid={selectedUserForRatingsList.uid}
          currentUserUid={user.uid}
          onClose={() => setShowRatingsList(false)}
        />
      )}

      {showStatusEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Set Status</h2>
              <button onClick={() => setShowStatusEditor(false)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <input 
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={50}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white mb-4"
            />
            <button 
              onClick={async () => {
                await supabase.from('users').update({ status: newStatus }).eq('uid', user.uid);
                setShowStatusEditor(false);
                showToast('Status updated!');
              }}
              className="w-full py-3 rounded-xl bg-amber-500 text-black font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors"
            >
              Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
