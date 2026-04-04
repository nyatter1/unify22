export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  pfp: string;
  banner: string;
  theme: string;
  onboardingStep: number;
  isOnline: boolean;
  lastSeen: any;
}

export interface Message {
  id: string;
  senderId: string;
  senderUsername: string;
  senderPfp: string;
  text: string;
  timestamp: any;
}

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  bg: string;
  text: string;
}
