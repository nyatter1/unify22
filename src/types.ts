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
  };
}

export interface CardStyle {
  id: string;
  name: string;
  category: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
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
  rank: UserRank;
  customRank?: {
    name: string;
    icon: string;
  };
  invites?: number;
  createdAt?: any;
}

export interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  senderPfp: string;
  text: string;
  timestamp: any;
  type?: 'text' | 'gamble_allin' | 'gamble_dice';
  gambleData?: {
    currency: 'gold' | 'rubies';
    amount: number;
    result: 'won' | 'lost';
    multiplier: number;
    winAmount: number;
    diceRoll?: number;
  };
}
