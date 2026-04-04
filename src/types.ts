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
