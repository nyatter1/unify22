export interface Theme {
  id: string;
  name: string;
  category: string;
  background: string; // URL or CSS color
  textColor: string;
  accentColor: string;
  isCustom?: boolean;
  customStyles?: {
    gradient?: string;
    pattern?: 'none' | 'dots' | 'stripes' | 'noise';
    fontFamily?: 'sans' | 'serif' | 'mono' | 'display';
    glassmorphism?: number; // 0 to 100 blur
    bubbleStyle?: 'rounded' | 'sharp' | 'minimal' | 'bordered';
    borderStyle?: string; // CSS border style
    glassEffect?: boolean;
  };
}

export interface CardStyle {
  id: string;
  name: string;
  category: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  animationClass?: string;
  isCustom?: boolean;
  customStyles?: {
    background?: string;
    border?: string;
    textColor?: string;
    effect?: 'none' | 'glow' | 'pulse' | 'glitch' | 'neon' | 'snake' | 'rainbow';
    badgeIcon?: string;
    title?: string;
    titleColor?: string;
    fontFamily?: 'sans' | 'serif' | 'mono' | 'display';
  };
}

export interface Border {
  id: string;
  name: string;
  category: string;
  className: string;
}

export interface ProfileEffect {
  id: string;
  name: string;
  category: string;
  className: string; // CSS class for the effect container
}

export type UserRank = 
  | 'DEVELOPER' 
  | 'FOUNDER' 
  | 'MOTHER_OF_PURITY' 
  | 'STAR' 
  | 'ADMINISTRATION' 
  | 'MODERATOR' 
  | 'TIGER' 
  | 'DRAGON' 
  | 'MANTIS' 
  | 'SNAKE' 
  | 'MILLIONAIRE' 
  | 'ELITE' 
  | 'SUPER_VIP' 
  | 'GOOD_GIRL'
  | 'BUNNY'
  | 'VIP';

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  pfp: string;
  banner: string;
  onboardingStep: number;
  isOnline: boolean;
  lastSeen: any;
  gold: number;
  rubies: number;
  hasReceivedReset?: boolean;
  theme?: string;
  cardStyle?: string;
  border?: string;
  profileEffect?: string;
  bio?: string;
  likes?: string[]; // Array of UIDs who liked this profile
  customThemes?: Theme[];
  customCardStyles?: CardStyle[];
  rank: UserRank | string;
  customRank?: {
    name: string;
    icon: string;
  };
  invites?: number;
  createdAt?: any;
  xp?: number;
  level?: number;
  lastDailyReward?: any;
  badges?: string[];
  status?: string;
  profileVideoUrl?: string;
  friends?: string[];
  friendRequests?: string[];
  mutedUntil?: any;
  kickedUntil?: any;
  bannedUntil?: any;
  isMuted?: boolean;
  isBanned?: boolean;
  isKicked?: boolean;
  profileSong?: string;
  isRigged?: boolean;
  muteReason?: string;
  kickReason?: string;
  banReason?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  senderPfp: string;
  senderRank?: string;
  recipientId?: string;
  read?: boolean;
  text: string;
  imageUrl?: string;
  timestamp: any;
  type?: 'text' | 'gamble_allin' | 'gamble_dice' | 'gamble_slots' | 'gamble_coinflip' | 'gamble_blackjack' | 'gamble_roulette' | 'gamble_crash' | 'gamble_highlow' | 'gamble_scratch' | 'gamble_plinko' | 'gamble_mines' | 'gamble_tower' | 'poll' | 'rps' | 'trivia' | 'nudge' | 'system';
  reactions?: Record<string, string[]>; // emoji -> array of userIds
  gambleData?: {
    currency: 'gold' | 'rubies';
    amount: number;
    result: 'won' | 'lost';
    multiplier: number;
    winAmount: number;
    diceRoll?: number;
  };
  pollData?: {
    question: string;
    options: { text: string; votes: number; voters?: string[] }[];
  };
}

export interface AppNotification {
  id: string;
  userId: string;
  senderId: string;
  senderUsername: string;
  senderPfp: string;
  type: 'profile_view' | 'profile_like' | 'news_post' | 'mention' | 'custom_admin' | 'global_notification';
  content?: string;
  read: boolean;
  timestamp: any;
}

export interface NewsComment {
  id: string;
  authorId: string;
  authorUsername: string;
  authorPfp: string;
  text: string;
  timestamp: any;
}

export interface NewsPost {
  id: string;
  authorId: string;
  authorUsername: string;
  authorPfp: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  dislikes: string[];
  comments: NewsComment[];
  timestamp: any;
}

export interface AppUpdate {
  id: string;
  version: string;
  title: string;
  content: string;
  timestamp: any;
}

export interface ProfileRating {
  id: string;
  targetUid: string;
  authorUid: string;
  authorUsername: string;
  authorPfp: string;
  rating: number; // 1 to 5
  comment: string;
  timestamp: any;
}

export interface BotTrigger {
  id: string;
  keyword: string;
  response: string;
  type: 'text' | 'image' | 'action';
  action?: string;
}

export interface Bot {
  id: string;
  name: string;
  username: string;
  pfp: string;
  rank: UserRank | string;
  triggers: BotTrigger[];
  isActive: boolean;
  description: string;
  tutorial?: string;
}

export interface RankDefinition {
  id: string;
  name: string;
  icon: string;
  color: string;
  permissions: string[];
  isCustom: boolean;
}
