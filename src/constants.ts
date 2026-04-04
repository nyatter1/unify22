import { Theme } from './types';

export const THEMES: Theme[] = Array.from({ length: 100 }).map((_, i) => ({
  id: `theme-${i}`,
  name: `Theme ${i + 1}`,
  primary: `hsl(${i * 3.6}, 70%, 50%)`,
  secondary: `hsl(${(i * 3.6 + 180) % 360}, 70%, 50%)`,
  bg: i % 2 === 0 ? '#0f172a' : '#ffffff',
  text: i % 2 === 0 ? '#f8fafc' : '#0f172a',
}));

export const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
];

export const BANNERS = [
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
  'https://images.unsplash.com/photo-1557683316-973673baf926',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071',
  'https://images.unsplash.com/photo-1477346611705-65d1883cee1e',
];
