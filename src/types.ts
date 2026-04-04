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
  customThemes?: Theme[];
  customCardStyles?: CardStyle[];
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
