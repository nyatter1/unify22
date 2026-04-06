import { Theme, CardStyle, UserRank, Border, ProfileEffect } from './types';

export interface RankInfo {
  id: UserRank;
  name: string;
  icon: string;
  priority: number;
}

export const RANKS: RankInfo[] = [
  { id: 'DEVELOPER', name: 'DEVELOPER', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/verified.gif', priority: 100 },
  { id: 'FOUNDER', name: 'FOUNDER', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/founder.gif', priority: 90 },
  { id: 'MOTHER_OF_PURITY', name: 'Mother Of Purity', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/MoP.gif', priority: 85 },
  { id: 'STAR', name: 'STAR', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/superadmin.png', priority: 80 },
  { id: 'ADMINISTRATION', name: 'ADMINISTRATION', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/admin.png', priority: 70 },
  { id: 'MODERATOR', name: 'MODERATOR', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/mod.png', priority: 60 },
  { id: 'TIGER', name: 'T.I.G.E.R', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/tiger.png', priority: 50 },
  { id: 'DRAGON', name: 'Dragon', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/dragon.png', priority: 45 },
  { id: 'MANTIS', name: 'Mantis', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/mantis.png', priority: 40 },
  { id: 'SNAKE', name: 'Snake', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/snake.png', priority: 35 },
  { id: 'MILLIONAIRE', name: 'Millionaire', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/gold.png', priority: 30 },
  { id: 'ELITE', name: 'The ELITE', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/elite.png', priority: 25 },
  { id: 'SUPER_VIP', name: 'Super VIP', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/super-vip.gif', priority: 20 },
  { id: 'GOOD_GIRL', name: 'Good Girl', icon: 'https://api.dicebear.com/7.x/icons/svg?seed=heart&backgroundColor=ffb6c1', priority: 15 },
  { id: 'BUNNY', name: 'Bunny', icon: 'https://api.dicebear.com/7.x/icons/svg?seed=rabbit&backgroundColor=ff69b4', priority: 12 },
  { id: 'VIP', name: 'VIP', icon: 'https://raw.githubusercontent.com/nyatter1/ranks/main/vip.gif', priority: 10 },
];

export const DEFAULT_PFP = 'https://api.dicebear.com/7.x/avataaars/svg?seed=human&mood[]=happy';
export const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1557683316-973673baf926';

export const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
];

export const BANNERS = [
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
  'https://images.unsplash.com/photo-1614850523296-d8c1af93d400',
  'https://images.unsplash.com/photo-1557683316-973673baf926',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071',
  'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0',
];

export const THEMES: Theme[] = [
  // ── Essentials ──────────────────────────────────────────────────────────────
  { id: 'vanta', name: 'Vantablack', category: 'Essentials', background: '#000000', textColor: 'text-white', accentColor: 'white' },
  { id: 'pure-white', name: 'Pure White', category: 'Essentials', background: '#ffffff', textColor: 'text-black', accentColor: 'black' },
  { id: 'slate-raw', name: 'Raw Slate', category: 'Essentials', background: '#0f172a', textColor: 'text-slate-200', accentColor: 'slate-400' },
  { id: 'zinc-raw', name: 'Raw Zinc', category: 'Essentials', background: '#18181b', textColor: 'text-zinc-200', accentColor: 'zinc-500' },
  { id: 'stone-raw', name: 'Raw Stone', category: 'Essentials', background: '#1c1917', textColor: 'text-stone-200', accentColor: 'stone-500' },
  { id: 'slate-night', name: 'Slate Night', category: 'Essentials', background: '#0f172a', textColor: 'text-slate-300', accentColor: 'slate-500' },
  { id: 'zinc-night', name: 'Zinc Night', category: 'Essentials', background: '#18181b', textColor: 'text-zinc-300', accentColor: 'zinc-500' },
  { id: 'stone-night', name: 'Stone Night', category: 'Essentials', background: '#1c1917', textColor: 'text-stone-300', accentColor: 'stone-500' },
  { id: 'neutral-night', name: 'Neutral Night', category: 'Essentials', background: '#171717', textColor: 'text-neutral-300', accentColor: 'neutral-500' },
  { id: 'gray-night', name: 'Gray Night', category: 'Essentials', background: '#111827', textColor: 'text-gray-300', accentColor: 'gray-500' },
  // NEW Essentials
  { id: 'charcoal', name: 'Charcoal', category: 'Essentials', background: '#1a1a1a', textColor: 'text-white', accentColor: 'white' },
  { id: 'warm-dark', name: 'Warm Dark', category: 'Essentials', background: '#1a1208', textColor: 'text-amber-100', accentColor: 'amber-400' },
  { id: 'cool-dark', name: 'Cool Dark', category: 'Essentials', background: '#080c14', textColor: 'text-blue-100', accentColor: 'blue-400' },
  { id: 'newspaper', name: 'Newspaper', category: 'Essentials', background: '#f5f0e8', textColor: 'text-stone-800', accentColor: 'stone-600', customStyles: { fontFamily: 'serif' } },
  { id: 'typewriter', name: 'Typewriter', category: 'Essentials', background: '#faf8f0', textColor: 'text-stone-900', accentColor: 'stone-700', customStyles: { fontFamily: 'mono', bubbleStyle: 'sharp' } },

  // ── Aesthetic ────────────────────────────────────────────────────────────────
  { id: 'lofi-night', name: 'Lofi Night', category: 'Aesthetic', background: '#1e1b4b', textColor: 'text-indigo-100', accentColor: 'indigo-500' },
  { id: 'cyber-pink', name: 'Cyber Pink', category: 'Aesthetic', background: '#4c0519', textColor: 'text-pink-100', accentColor: 'pink-500' },
  { id: 'deep-sea', name: 'Deep Sea', category: 'Aesthetic', background: '#083344', textColor: 'text-cyan-100', accentColor: 'cyan-500' },
  { id: 'emerald-dream', name: 'Emerald Dream', category: 'Aesthetic', background: '#022c22', textColor: 'text-emerald-100', accentColor: 'emerald-500' },
  { id: 'royal-velvet', name: 'Royal Velvet', category: 'Aesthetic', background: '#3b0764', textColor: 'text-purple-100', accentColor: 'purple-500' },
  { id: 'blood-moon', name: 'Blood Moon', category: 'Aesthetic', background: '#450a0a', textColor: 'text-red-100', accentColor: 'red-500' },
  { id: 'desert-dusk', name: 'Desert Dusk', category: 'Aesthetic', background: '#431407', textColor: 'text-orange-100', accentColor: 'orange-500' },
  { id: 'deep-purple', name: 'Deep Purple', category: 'Aesthetic', background: '#1e1b4b', textColor: 'text-purple-300', accentColor: 'purple-500' },
  { id: 'ocean-breeze', name: 'Ocean Breeze', category: 'Aesthetic', background: '#0c4a6e', textColor: 'text-sky-200', accentColor: 'sky-400' },
  { id: 'forest-mist', name: 'Forest Mist', category: 'Aesthetic', background: '#064e3b', textColor: 'text-emerald-200', accentColor: 'emerald-500' },
  { id: 'sunset-glow', name: 'Sunset Glow', category: 'Aesthetic', background: '#431407', textColor: 'text-orange-200', accentColor: 'orange-500' },
  { id: 'midnight-blue', name: 'Midnight Blue', category: 'Aesthetic', background: '#020617', textColor: 'text-blue-200', accentColor: 'blue-500' },
  { id: 'rose-quartz', name: 'Rose Quartz', category: 'Aesthetic', background: '#450a0a', textColor: 'text-rose-200', accentColor: 'rose-500' },
  // NEW Aesthetic
  { id: 'cottagecore', name: 'Cottagecore', category: 'Aesthetic', background: '#2d1b0e', textColor: 'text-amber-200', accentColor: 'amber-400', customStyles: { fontFamily: 'serif' } },
  { id: 'dark-academia', name: 'Dark Academia', category: 'Aesthetic', background: '#1a1209', textColor: 'text-amber-300', accentColor: 'amber-500', customStyles: { fontFamily: 'serif', borderStyle: '1px solid #78350f' } },
  { id: 'light-academia', name: 'Light Academia', category: 'Aesthetic', background: '#fdf6e3', textColor: 'text-stone-700', accentColor: 'stone-500', customStyles: { fontFamily: 'serif' } },
  { id: 'vaporwave', name: 'Vaporwave', category: 'Aesthetic', background: 'linear-gradient(135deg, #ff71ce 0%, #01cdfe 50%, #05ffa1 100%)', textColor: 'text-white', accentColor: 'pink-300', customStyles: { glassEffect: true } },
  { id: 'dreamcore', name: 'Dreamcore', category: 'Aesthetic', background: 'linear-gradient(to bottom, #1a0533, #0d1b4a)', textColor: 'text-purple-200', accentColor: 'purple-400', customStyles: { borderStyle: '1px solid #6d28d9', glassEffect: true } },
  { id: 'weirdcore', name: 'Weirdcore', category: 'Aesthetic', background: '#f0e6d3', textColor: 'text-red-700', accentColor: 'red-500', customStyles: { bubbleStyle: 'sharp', fontFamily: 'mono' } },
  { id: 'liminal-space', name: 'Liminal Space', category: 'Aesthetic', background: '#f5f0dc', textColor: 'text-yellow-800', accentColor: 'yellow-600' },
  { id: 'goblincore', name: 'Goblincore', category: 'Aesthetic', background: '#1a2e0a', textColor: 'text-lime-300', accentColor: 'lime-500', customStyles: { borderStyle: '1px solid #4d7c0f' } },
  { id: 'fairycore', name: 'Fairycore', category: 'Aesthetic', background: 'linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)', textColor: 'text-pink-600', accentColor: 'pink-400', customStyles: { borderStyle: '1px solid #f9a8d4' } },
  { id: 'witchcraft', name: 'Witchcraft', category: 'Aesthetic', background: '#0f0a1e', textColor: 'text-violet-300', accentColor: 'violet-500', customStyles: { borderStyle: '1px solid #5b21b6', glassEffect: true } },
  { id: 'angel-core', name: 'Angel Core', category: 'Aesthetic', background: 'linear-gradient(to bottom, #fefce8, #fff7ed)', textColor: 'text-amber-700', accentColor: 'amber-500', customStyles: { borderStyle: '1px solid #fde68a' } },

  // ── Street ───────────────────────────────────────────────────────────────────
  { id: 'the-block', name: 'The Block', category: 'Street', background: '#0a0a0a', textColor: 'text-zinc-100', accentColor: 'zinc-800' },
  { id: 'drill-grey', name: 'Drill Grey', category: 'Street', background: '#27272a', textColor: 'text-zinc-200', accentColor: 'zinc-600' },
  { id: 'london-fog', name: 'London Fog', category: 'Street', background: '#1e293b', textColor: 'text-slate-200', accentColor: 'slate-500' },
  { id: 'shadow-realm', name: 'Shadow Realm', category: 'Street', background: '#000000', textColor: 'text-zinc-500', accentColor: 'zinc-900' },
  { id: 'hustle-gold', name: 'Hustle Gold', category: 'Street', background: '#1a1a1a', textColor: 'text-amber-100', accentColor: 'amber-600' },
  // NEW Street
  { id: 'chicago-night', name: 'Chicago Night', category: 'Street', background: '#0c0c10', textColor: 'text-slate-300', accentColor: 'slate-500', customStyles: { borderStyle: '1px solid #1e293b' } },
  { id: 'trap-house', name: 'Trap House', category: 'Street', background: '#111111', textColor: 'text-red-400', accentColor: 'red-600', customStyles: { borderStyle: '1px solid #450a0a' } },
  { id: 'plug-walk', name: 'Plug Walk', category: 'Street', background: '#0f0f0f', textColor: 'text-green-400', accentColor: 'green-600', customStyles: { borderStyle: '1px solid #14532d' } },
  { id: 'no-days-off', name: 'No Days Off', category: 'Street', background: '#18181b', textColor: 'text-white', accentColor: 'zinc-300', customStyles: { fontFamily: 'display' } },
  { id: 'midnight-grind', name: 'Midnight Grind', category: 'Street', background: '#09090b', textColor: 'text-amber-400', accentColor: 'amber-500', customStyles: { borderStyle: '1px solid #451a03' } },

  // ── Brain Rot ────────────────────────────────────────────────────────────────
  { id: 'skibidi-toilet', name: 'Skibidi Toilet', category: 'Brain Rot', background: '#334155', textColor: 'text-slate-100', accentColor: 'slate-400' },
  { id: 'sigma-grindset', name: 'Sigma Grindset', category: 'Brain Rot', background: '#171717', textColor: 'text-amber-200', accentColor: 'amber-500' },
  { id: 'rizzler-pink', name: 'Rizzler Pink', category: 'Brain Rot', background: '#500724', textColor: 'text-pink-100', accentColor: 'pink-400' },
  { id: 'gyatt-red', name: 'Gyatt Red', category: 'Brain Rot', background: '#450a0a', textColor: 'text-red-100', accentColor: 'red-400' },
  { id: 'ohio-state', name: 'Ohio State', category: 'Brain Rot', background: '#0f172a', textColor: 'text-slate-300', accentColor: 'slate-500' },
  // NEW Brain Rot
  { id: 'fanum-tax', name: 'Fanum Tax', category: 'Brain Rot', background: '#1a0a2e', textColor: 'text-purple-300', accentColor: 'purple-500' },
  { id: 'no-cap', name: 'No Cap Fr Fr', category: 'Brain Rot', background: '#0c1a0c', textColor: 'text-green-400', accentColor: 'green-500' },
  { id: 'rizz-lord', name: 'Rizz Lord', category: 'Brain Rot', background: 'linear-gradient(135deg, #1a0030 0%, #300010 100%)', textColor: 'text-fuchsia-300', accentColor: 'fuchsia-500', customStyles: { glassEffect: true } },
  { id: 'slay', name: 'Slay', category: 'Brain Rot', background: '#3d0030', textColor: 'text-pink-200', accentColor: 'pink-400', customStyles: { borderStyle: '2px solid #be185d' } },
  { id: 'bussin', name: 'Bussin', category: 'Brain Rot', background: '#1c0a00', textColor: 'text-orange-300', accentColor: 'orange-500' },
  { id: 'lowkey-highkey', name: 'Lowkey Highkey', category: 'Brain Rot', background: '#09090b', textColor: 'text-cyan-400', accentColor: 'cyan-500', customStyles: { fontFamily: 'mono' } },

  // ── Niche ────────────────────────────────────────────────────────────────────
  { id: 'toxic-waste', name: 'Toxic Waste', category: 'Niche', background: '#052e16', textColor: 'text-lime-400', accentColor: 'lime-500' },
  { id: 'absolute-zero', name: 'Absolute Zero', category: 'Niche', background: '#0c4a6e', textColor: 'text-sky-100', accentColor: 'sky-400' },
  { id: 'savage-mode', name: 'Savage Mode', category: 'Niche', background: '#450a0a', textColor: 'text-red-500', accentColor: 'red-600' },
  { id: 'the-abyss', name: 'The Abyss', category: 'Niche', background: '#000000', textColor: 'text-zinc-600', accentColor: 'zinc-800' },
  { id: 'zen-garden', name: 'Zen Garden', category: 'Niche', background: '#f8fafc', textColor: 'text-slate-400', accentColor: 'slate-300' },
  { id: 'ink-blot', name: 'Ink Blot', category: 'Niche', background: '#0a0a0a', textColor: 'text-zinc-500', accentColor: 'zinc-800' },
  { id: 'ash-tray', name: 'Ash Tray', category: 'Niche', background: '#18181b', textColor: 'text-zinc-400', accentColor: 'zinc-600' },
  { id: 'storm-cloud', name: 'Storm Cloud', category: 'Niche', background: '#0f172a', textColor: 'text-slate-400', accentColor: 'slate-500' },
  // NEW Niche
  { id: 'fish-tank', name: 'Fish Tank', category: 'Niche', background: 'linear-gradient(to bottom, #0c4a6e, #164e63)', textColor: 'text-cyan-300', accentColor: 'cyan-400', customStyles: { borderStyle: '2px solid #22d3ee', glassEffect: true } },
  { id: 'chess-board', name: 'Chess Board', category: 'Niche', background: '#1a1a1a', textColor: 'text-white', accentColor: 'white', customStyles: { bubbleStyle: 'sharp', borderStyle: '2px solid #ffffff20' } },
  { id: '404-error', name: '404 Not Found', category: 'Niche', background: '#0a0a0a', textColor: 'text-red-500', accentColor: 'red-600', customStyles: { fontFamily: 'mono', bubbleStyle: 'sharp', borderStyle: '1px solid #ef4444' } },
  { id: 'ancient-scroll', name: 'Ancient Scroll', category: 'Niche', background: '#2d1b0e', textColor: 'text-amber-300', accentColor: 'amber-500', customStyles: { fontFamily: 'serif', borderStyle: '2px solid #78350f' } },
  { id: 'laboratory', name: 'Laboratory', category: 'Niche', background: '#f0f9ff', textColor: 'text-blue-900', accentColor: 'blue-600', customStyles: { fontFamily: 'mono', bubbleStyle: 'sharp' } },
  { id: 'haunted', name: 'Haunted', category: 'Niche', background: '#0a0010', textColor: 'text-purple-400', accentColor: 'purple-600', customStyles: { borderStyle: '1px solid #581c87', glassEffect: true } },

  // ── Pop Culture ───────────────────────────────────────────────────────────────
  { id: 'cartoon-vibe', name: 'Cartoon', category: 'Pop Culture', background: '#fef08a', textColor: 'text-zinc-900', accentColor: 'blue-500', customStyles: { borderStyle: '4px solid #000', bubbleStyle: 'sharp' } },
  { id: 'avengers-hq', name: 'Avengers HQ', category: 'Pop Culture', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', textColor: 'text-white', accentColor: 'red-600', customStyles: { borderStyle: '1px solid #ef4444', glassEffect: true } },
  { id: 'matrix-code', name: 'The Matrix', category: 'Pop Culture', background: '#000000', textColor: 'text-green-500', accentColor: 'green-600', customStyles: { borderStyle: '1px solid #22c55e', fontFamily: 'mono' } },
  { id: 'barbie-world', name: 'Barbie World', category: 'Pop Culture', background: 'linear-gradient(to bottom, #fdf2f8, #fbcfe8)', textColor: 'text-pink-600', accentColor: 'pink-500', customStyles: { borderStyle: '2px solid #ec4899' } },
  { id: 'minecraft-dirt', name: 'Minecraft', category: 'Pop Culture', background: '#4b3621', textColor: 'text-green-400', accentColor: 'green-600', customStyles: { borderStyle: '4px solid #3f2e1d', bubbleStyle: 'sharp' } },
  { id: 'star-wars-dark', name: 'Sith Lord', category: 'Pop Culture', background: '#0a0a0a', textColor: 'text-red-600', accentColor: 'red-700', customStyles: { borderStyle: '1px solid #dc2626', glassEffect: true } },
  { id: 'star-wars-light', name: 'Jedi Master', category: 'Pop Culture', background: '#f8fafc', textColor: 'text-blue-600', accentColor: 'blue-500', customStyles: { borderStyle: '1px solid #3b82f6' } },
  { id: 'spider-verse', name: 'Spider-Verse', category: 'Pop Culture', background: 'linear-gradient(45deg, #0f172a 0%, #1e1b4b 100%)', textColor: 'text-red-500', accentColor: 'blue-600', customStyles: { borderStyle: '2px solid #ef4444', glassEffect: true } },
  { id: 'batman-dark', name: 'The Bat', category: 'Pop Culture', background: '#000000', textColor: 'text-zinc-400', accentColor: 'zinc-700', customStyles: { borderStyle: '1px solid #3f3f46' } },
  { id: 'pokemon-red', name: 'Pokedex', category: 'Pop Culture', background: '#dc2626', textColor: 'text-white', accentColor: 'white', customStyles: { borderStyle: '4px solid #000', bubbleStyle: 'sharp' } },
  // NEW Pop Culture
  { id: 'gta-loading', name: 'GTA Loading', category: 'Pop Culture', background: 'linear-gradient(135deg, #000000 0%, #1a1a2e 100%)', textColor: 'text-orange-400', accentColor: 'orange-500', customStyles: { borderStyle: '2px solid #f97316', fontFamily: 'display' } },
  { id: 'among-us', name: 'Sus', category: 'Pop Culture', background: '#1a1a2e', textColor: 'text-red-400', accentColor: 'red-500', customStyles: { borderStyle: '2px solid #dc2626' } },
  { id: 'roblox-vibes', name: 'Roblox Vibes', category: 'Pop Culture', background: '#ffffff', textColor: 'text-red-600', accentColor: 'red-500', customStyles: { borderStyle: '3px solid #dc2626', bubbleStyle: 'sharp', fontFamily: 'display' } },
  { id: 'fortnite-storm', name: 'Fortnite Storm', category: 'Pop Culture', background: 'linear-gradient(135deg, #1a0033 0%, #0d1a4a 100%)', textColor: 'text-purple-300', accentColor: 'purple-500', customStyles: { borderStyle: '2px solid #7c3aed', glassEffect: true } },
  { id: 'halo-ring', name: 'Halo Ring', category: 'Pop Culture', background: 'linear-gradient(to bottom, #0c1c2c, #0a3040)', textColor: 'text-teal-300', accentColor: 'teal-400', customStyles: { borderStyle: '1px solid #2dd4bf' } },
  { id: 'cyberpunk-2077', name: 'Night City', category: 'Pop Culture', background: '#0a0014', textColor: 'text-yellow-400', accentColor: 'yellow-500', customStyles: { borderStyle: '2px solid #facc15', glassEffect: true, fontFamily: 'display' } },
  { id: 'dragon-ball', name: 'Power Level', category: 'Pop Culture', background: '#451a03', textColor: 'text-orange-300', accentColor: 'orange-500', customStyles: { borderStyle: '2px solid #f97316' } },
  { id: 'attack-on-titan', name: 'Survey Corps', category: 'Pop Culture', background: '#1a1209', textColor: 'text-amber-200', accentColor: 'amber-400', customStyles: { borderStyle: '1px solid #92400e', fontFamily: 'serif' } },
  { id: 'demon-slayer', name: 'Demon Slayer', category: 'Pop Culture', background: 'linear-gradient(135deg, #1a0000 0%, #0d0020 100%)', textColor: 'text-red-300', accentColor: 'red-500', customStyles: { borderStyle: '2px solid #7f1d1d', glassEffect: true } },
  { id: 'jujutsu-kaisen', name: 'Cursed Energy', category: 'Pop Culture', background: '#0a0a0a', textColor: 'text-blue-300', accentColor: 'blue-500', customStyles: { borderStyle: '2px solid #1d4ed8', glassEffect: true } },
  { id: 'breaking-bad', name: 'Say My Name', category: 'Pop Culture', background: '#1a1a00', textColor: 'text-green-400', accentColor: 'green-500', customStyles: { borderStyle: '1px solid #166534', fontFamily: 'mono' } },
  { id: 'stranger-things', name: 'Upside Down', category: 'Pop Culture', background: '#0a0014', textColor: 'text-red-400', accentColor: 'red-600', customStyles: { borderStyle: '2px solid #991b1b', glassEffect: true } },

  // ── Special ──────────────────────────────────────────────────────────────────
  { id: 'royal-gold', name: 'Royal Gold', category: 'Special', background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)', textColor: 'text-amber-400', accentColor: 'amber-500', customStyles: { borderStyle: '2px solid #f59e0b', glassEffect: true } },
  { id: 'frozen-tundra', name: 'Frozen', category: 'Special', background: 'linear-gradient(to bottom, #e0f2fe, #bae6fd)', textColor: 'text-sky-600', accentColor: 'sky-400', customStyles: { borderStyle: '1px solid #38bdf8' } },
  { id: 'neon-night', name: 'Neon Night', category: 'Special', background: '#020617', textColor: 'text-fuchsia-400', accentColor: 'fuchsia-500', customStyles: { borderStyle: '2px solid #d946ef', glassEffect: true } },
  { id: 'ocean-deep', name: 'Deep Ocean', category: 'Special', background: 'linear-gradient(to bottom, #0c4a6e, #082f49)', textColor: 'text-sky-100', accentColor: 'sky-400', customStyles: { borderStyle: '1px solid #0ea5e9' } },
  { id: 'lava-cave', name: 'Lava Cave', category: 'Special', background: 'linear-gradient(45deg, #450a0a 0%, #7f1d1d 100%)', textColor: 'text-orange-500', accentColor: 'orange-600', customStyles: { borderStyle: '2px solid #ea580c' } },
  { id: 'forest-spirit', name: 'Forest Spirit', category: 'Special', background: '#064e3b', textColor: 'text-emerald-100', accentColor: 'emerald-500', customStyles: { borderStyle: '1px solid #10b981' } },
  { id: 'galaxy-far', name: 'Galaxy', category: 'Special', background: 'radial-gradient(circle at center, #1e1b4b 0%, #000000 100%)', textColor: 'text-purple-100', accentColor: 'purple-500', customStyles: { borderStyle: '1px solid #8b5cf6', glassEffect: true } },
  { id: 'sunset-strip', name: 'Sunset', category: 'Special', background: 'linear-gradient(to top, #7c2d12, #ea580c)', textColor: 'text-orange-100', accentColor: 'orange-500', customStyles: { borderStyle: '1px solid #f97316' } },
  { id: 'midnight-oil', name: 'Midnight', category: 'Special', background: '#000000', textColor: 'text-zinc-500', accentColor: 'zinc-800', customStyles: { borderStyle: '1px solid #27272a' } },
  { id: 'ghost-town', name: 'Ghost Town', category: 'Special', background: '#18181b', textColor: 'text-zinc-400', accentColor: 'zinc-600', customStyles: { borderStyle: '1px solid #52525b' } },
  { id: 'candy-land', name: 'Candy Land', category: 'Special', background: 'linear-gradient(135deg, #fdf2f8 0%, #fbcfe8 100%)', textColor: 'text-pink-500', accentColor: 'pink-400', customStyles: { borderStyle: '2px solid #f472b6' } },
  { id: 'toxic-zone', name: 'Toxic Zone', category: 'Special', background: '#052e16', textColor: 'text-lime-400', accentColor: 'lime-500', customStyles: { borderStyle: '2px solid #84cc16' } },
  { id: 'crimson-tide', name: 'Crimson Tide', category: 'Special', background: '#7f1d1d', textColor: 'text-red-100', accentColor: 'red-500', customStyles: { borderStyle: '2px solid #ef4444' } },
  { id: 'golden-era', name: 'Golden Era', category: 'Special', background: '#451a03', textColor: 'text-amber-100', accentColor: 'amber-500', customStyles: { borderStyle: '2px solid #f59e0b' } },
  { id: 'emerald-city', name: 'Emerald City', category: 'Special', background: '#064e3b', textColor: 'text-emerald-100', accentColor: 'emerald-500', customStyles: { borderStyle: '2px solid #10b981' } },
  { id: 'sapphire-sky', name: 'Sapphire Sky', category: 'Special', background: '#1e3a8a', textColor: 'text-blue-100', accentColor: 'blue-500', customStyles: { borderStyle: '2px solid #3b82f6' } },
  { id: 'amethyst-dream', name: 'Amethyst Dream', category: 'Special', background: '#4c1d95', textColor: 'text-purple-100', accentColor: 'purple-500', customStyles: { borderStyle: '2px solid #8b5cf6' } },
  { id: 'obsidian-flow', name: 'Obsidian Flow', category: 'Special', background: '#0a0a0a', textColor: 'text-zinc-400', accentColor: 'zinc-600', customStyles: { borderStyle: '2px solid #3f3f46' } },
  { id: 'ivory-tower', name: 'Ivory Tower', category: 'Special', background: '#f8fafc', textColor: 'text-slate-600', accentColor: 'slate-400', customStyles: { borderStyle: '2px solid #cbd5e1' } },
  { id: 'ruby-red', name: 'Ruby Red', category: 'Special', background: '#991b1b', textColor: 'text-red-100', accentColor: 'red-400', customStyles: { borderStyle: '2px solid #f87171' } },
  { id: 'topaz-glow', name: 'Topaz Glow', category: 'Special', background: '#92400e', textColor: 'text-amber-100', accentColor: 'amber-400', customStyles: { borderStyle: '2px solid #fbbf24' } },
  { id: 'jade-mist', name: 'Jade Mist', category: 'Special', background: '#065f46', textColor: 'text-emerald-100', accentColor: 'emerald-400', customStyles: { borderStyle: '2px solid #34d399' } },
  { id: 'cobalt-blue', name: 'Cobalt Blue', category: 'Special', background: '#1e40af', textColor: 'text-blue-100', accentColor: 'blue-400', customStyles: { borderStyle: '2px solid #60a5fa' } },
  { id: 'violet-vibe', name: 'Violet Vibe', category: 'Special', background: '#5b21b6', textColor: 'text-purple-100', accentColor: 'purple-400', customStyles: { borderStyle: '2px solid #a78bfa' } },
  { id: 'onyx-black', name: 'Onyx Black', category: 'Special', background: '#000000', textColor: 'text-zinc-500', accentColor: 'zinc-700', customStyles: { borderStyle: '2px solid #52525b' } },
  { id: 'pearl-white', name: 'Pearl White', category: 'Special', background: '#ffffff', textColor: 'text-slate-400', accentColor: 'slate-200', customStyles: { borderStyle: '2px solid #e2e8f0' } },
  // NEW Special
  { id: 'dragon-fire', name: 'Dragon Fire', category: 'Special', background: 'radial-gradient(circle at 30% 70%, #7f1d1d 0%, #1a0000 100%)', textColor: 'text-orange-400', accentColor: 'orange-500', customStyles: { borderStyle: '2px solid #ea580c', glassEffect: true } },
  { id: 'ice-palace', name: 'Ice Palace', category: 'Special', background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)', textColor: 'text-blue-800', accentColor: 'blue-600', customStyles: { borderStyle: '2px solid #0284c7', glassEffect: true } },
  { id: 'void-matter', name: 'Void Matter', category: 'Special', background: 'radial-gradient(ellipse at center, #0d0221 0%, #000000 100%)', textColor: 'text-violet-300', accentColor: 'violet-500', customStyles: { borderStyle: '1px solid #4c1d95', glassEffect: true } },
  { id: 'solar-flare', name: 'Solar Flare', category: 'Special', background: 'radial-gradient(circle at 50% 120%, #f97316 0%, #1a0800 100%)', textColor: 'text-amber-300', accentColor: 'amber-500', customStyles: { borderStyle: '2px solid #f59e0b' } },
  { id: 'aurora-borealis', name: 'Aurora Borealis', category: 'Special', background: 'linear-gradient(135deg, #022c22 0%, #0c4a6e 50%, #1e1b4b 100%)', textColor: 'text-emerald-300', accentColor: 'teal-400', customStyles: { borderStyle: '1px solid #34d399', glassEffect: true } },
  { id: 'black-hole', name: 'Black Hole', category: 'Special', background: 'radial-gradient(circle at center, #3b0764 0%, #000000 80%)', textColor: 'text-purple-200', accentColor: 'purple-400', customStyles: { borderStyle: '1px solid #6d28d9', glassEffect: true } },
  { id: 'prismatic', name: 'Prismatic', category: 'Special', background: 'linear-gradient(45deg, #0f0c29, #302b63, #24243e)', textColor: 'text-white', accentColor: 'purple-400', customStyles: { borderStyle: '1px solid rgba(255,255,255,0.2)', glassEffect: true } },
  { id: 'sakura', name: 'Sakura', category: 'Special', background: 'linear-gradient(to bottom, #fff0f5, #fce7f3)', textColor: 'text-pink-700', accentColor: 'pink-500', customStyles: { borderStyle: '2px solid #fbcfe8' } },
  { id: 'thunderstorm', name: 'Thunderstorm', category: 'Special', background: '#0f172a', textColor: 'text-slate-200', accentColor: 'yellow-400', customStyles: { borderStyle: '2px solid #facc15', glassEffect: true } },
  { id: 'molten-core', name: 'Molten Core', category: 'Special', background: 'radial-gradient(circle at 50% 100%, #7c2d12 0%, #0a0000 100%)', textColor: 'text-red-400', accentColor: 'red-500', customStyles: { borderStyle: '2px solid #dc2626' } },

  // ── Cyber ────────────────────────────────────────────────────────────────────
  { id: 'cyber-neon', name: 'Cyber Neon', category: 'Cyber', background: '#000000', textColor: 'text-cyan-400', accentColor: 'cyan-500', customStyles: { borderStyle: '1px solid #22d3ee', glassEffect: true } },
  { id: 'synth-wave', name: 'Synthwave', category: 'Cyber', background: 'linear-gradient(to bottom, #2e026d, #15162c)', textColor: 'text-pink-400', accentColor: 'pink-500', customStyles: { borderStyle: '1px solid #ec4899' } },
  { id: 'retro-terminal', name: 'Terminal', category: 'Cyber', background: '#0c0c0c', textColor: 'text-green-500', accentColor: 'green-600', customStyles: { fontFamily: 'mono', borderStyle: '1px solid #16a34a' } },
  { id: 'cyber-gold', name: 'Cyber Gold', category: 'Cyber', background: '#1a1a1a', textColor: 'text-amber-400', accentColor: 'amber-500', customStyles: { borderStyle: '1px solid #fbbf24', glassEffect: true } },
  { id: 'cyber-silver', name: 'Cyber Silver', category: 'Cyber', background: '#1a1a1a', textColor: 'text-slate-400', accentColor: 'slate-500', customStyles: { borderStyle: '1px solid #94a3b8', glassEffect: true } },
  { id: 'neon-green', name: 'Neon Green', category: 'Cyber', background: '#022c22', textColor: 'text-green-400', accentColor: 'green-500', customStyles: { borderStyle: '1px solid #4ade80', glassEffect: true } },
  { id: 'neon-red', name: 'Neon Red', category: 'Cyber', background: '#450a0a', textColor: 'text-red-400', accentColor: 'red-500', customStyles: { borderStyle: '1px solid #f87171', glassEffect: true } },
  { id: 'neon-purple', name: 'Neon Purple', category: 'Cyber', background: '#3b0764', textColor: 'text-purple-400', accentColor: 'purple-500', customStyles: { borderStyle: '1px solid #c084fc', glassEffect: true } },
  { id: 'neon-yellow', name: 'Neon Yellow', category: 'Cyber', background: '#422006', textColor: 'text-yellow-400', accentColor: 'yellow-500', customStyles: { borderStyle: '1px solid #facc15', glassEffect: true } },
  { id: 'neon-orange', name: 'Neon Orange', category: 'Cyber', background: '#431407', textColor: 'text-orange-400', accentColor: 'orange-500', customStyles: { borderStyle: '1px solid #fb923c', glassEffect: true } },
  { id: 'neon-blue', name: 'Neon Blue', category: 'Cyber', background: '#082f49', textColor: 'text-blue-400', accentColor: 'blue-500', customStyles: { borderStyle: '1px solid #60a5fa', glassEffect: true } },
  { id: 'neon-pink-cyber', name: 'Neon Pink', category: 'Cyber', background: '#4c0519', textColor: 'text-pink-400', accentColor: 'pink-500', customStyles: { borderStyle: '1px solid #f472b6', glassEffect: true } },
  { id: 'neon-cyan', name: 'Neon Cyan', category: 'Cyber', background: '#083344', textColor: 'text-cyan-400', accentColor: 'cyan-500', customStyles: { borderStyle: '1px solid #22d3ee', glassEffect: true } },
  { id: 'neon-lime', name: 'Neon Lime', category: 'Cyber', background: '#052e16', textColor: 'text-lime-400', accentColor: 'lime-500', customStyles: { borderStyle: '1px solid #a3e635', glassEffect: true } },
  { id: 'neon-teal', name: 'Neon Teal', category: 'Cyber', background: '#042f2e', textColor: 'text-teal-400', accentColor: 'teal-500', customStyles: { borderStyle: '1px solid #2dd4bf', glassEffect: true } },
  { id: 'neon-indigo', name: 'Neon Indigo', category: 'Cyber', background: '#1e1b4b', textColor: 'text-indigo-400', accentColor: 'indigo-500', customStyles: { borderStyle: '1px solid #818cf8', glassEffect: true } },
  { id: 'neon-violet', name: 'Neon Violet', category: 'Cyber', background: '#2e1065', textColor: 'text-violet-400', accentColor: 'violet-500', customStyles: { borderStyle: '1px solid #a78bfa', glassEffect: true } },
  { id: 'neon-fuchsia', name: 'Neon Fuchsia', category: 'Cyber', background: '#4a044e', textColor: 'text-fuchsia-400', accentColor: 'fuchsia-500', customStyles: { borderStyle: '1px solid #e879f9', glassEffect: true } },
  { id: 'neon-rose', name: 'Neon Rose', category: 'Cyber', background: '#4c0519', textColor: 'text-rose-400', accentColor: 'rose-500', customStyles: { borderStyle: '1px solid #fb7185', glassEffect: true } },
  { id: 'neon-sky', name: 'Neon Sky', category: 'Cyber', background: '#082f49', textColor: 'text-sky-400', accentColor: 'sky-500', customStyles: { borderStyle: '1px solid #38bdf8', glassEffect: true } },
  { id: 'neon-emerald', name: 'Neon Emerald', category: 'Cyber', background: '#064e3b', textColor: 'text-emerald-400', accentColor: 'emerald-500', customStyles: { borderStyle: '1px solid #34d399', glassEffect: true } },
  { id: 'neon-amber', name: 'Neon Amber', category: 'Cyber', background: '#451a03', textColor: 'text-amber-400', accentColor: 'amber-500', customStyles: { borderStyle: '1px solid #fbbf24', glassEffect: true } },
  { id: 'neon-slate', name: 'Neon Slate', category: 'Cyber', background: '#0f172a', textColor: 'text-slate-400', accentColor: 'slate-500', customStyles: { borderStyle: '1px solid #94a3b8', glassEffect: true } },
  { id: 'neon-zinc', name: 'Neon Zinc', category: 'Cyber', background: '#18181b', textColor: 'text-zinc-400', accentColor: 'zinc-500', customStyles: { borderStyle: '1px solid #a1a1aa', glassEffect: true } },
  { id: 'neon-stone', name: 'Neon Stone', category: 'Cyber', background: '#1c1917', textColor: 'text-stone-400', accentColor: 'stone-500', customStyles: { borderStyle: '1px solid #a8a29e', glassEffect: true } },
  // NEW Cyber
  { id: 'tron-legacy', name: 'Tron Legacy', category: 'Cyber', background: '#000000', textColor: 'text-cyan-300', accentColor: 'cyan-400', customStyles: { borderStyle: '2px solid #06b6d4', glassEffect: true, fontFamily: 'display' } },
  { id: 'blade-runner', name: 'Blade Runner', category: 'Cyber', background: '#0a0014', textColor: 'text-orange-300', accentColor: 'orange-500', customStyles: { borderStyle: '1px solid #ea580c', glassEffect: true } },
  { id: 'ghost-shell', name: 'Ghost in Shell', category: 'Cyber', background: '#000a14', textColor: 'text-teal-300', accentColor: 'teal-400', customStyles: { borderStyle: '1px solid #14b8a6', glassEffect: true, fontFamily: 'mono' } },
  { id: 'neon-tokyo', name: 'Neon Tokyo', category: 'Cyber', background: '#0a0014', textColor: 'text-pink-300', accentColor: 'pink-400', customStyles: { borderStyle: '2px solid #ec4899', glassEffect: true } },
  { id: 'digital-rain', name: 'Digital Rain', category: 'Cyber', background: '#000800', textColor: 'text-green-400', accentColor: 'green-500', customStyles: { borderStyle: '1px solid #16a34a', fontFamily: 'mono', glassEffect: true } },
  { id: 'overclocked', name: 'Overclocked', category: 'Cyber', background: '#0a0000', textColor: 'text-red-400', accentColor: 'red-500', customStyles: { borderStyle: '2px solid #dc2626', fontFamily: 'mono', glassEffect: true } },
  { id: 'quantum', name: 'Quantum', category: 'Cyber', background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)', textColor: 'text-cyan-200', accentColor: 'cyan-400', customStyles: { borderStyle: '1px solid #22d3ee', glassEffect: true } },
];

export const CARD_STYLES: CardStyle[] = [
  // ── Elite ────────────────────────────────────────────────────────────────────
  { id: 'the-boss', name: 'The Boss', category: 'Elite', bgClass: 'bg-black', borderClass: 'border-amber-500 border-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]', textClass: 'text-amber-500 font-black uppercase tracking-tighter' },
  { id: 'the-goat', name: 'The GOAT', category: 'Elite', bgClass: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20', borderClass: 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]', textClass: 'text-amber-400 font-black italic' },
  { id: 'the-menace', name: 'The Menace', category: 'Elite', bgClass: 'bg-red-950', borderClass: 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]', textClass: 'text-red-500 font-black uppercase' },
  { id: 'the-ghost', name: 'The Ghost', category: 'Elite', bgClass: 'bg-white/5 backdrop-blur-2xl', borderClass: 'border-white/10 shadow-inner', textClass: 'text-white/40 font-light tracking-[0.5em]' },
  { id: 'the-hacker', name: 'The Hacker', category: 'Elite', bgClass: 'bg-black', borderClass: 'border-green-500/60 shadow-[0_0_15px_rgba(34,197,94,0.3)]', textClass: 'text-green-500 font-mono text-xs' },

  // ── Fun ──────────────────────────────────────────────────────────────────────
  { id: 'skibidi-card', name: 'Skibidi', category: 'Fun', bgClass: 'bg-slate-800', borderClass: 'border-slate-400 border-4 rounded-none', textClass: 'text-slate-100 font-bold uppercase' },
  { id: 'rizzler-card', name: 'The Rizzler', category: 'Fun', bgClass: 'bg-pink-500/10', borderClass: 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.4)]', textClass: 'text-pink-400 font-black italic' },
  { id: 'sigma-card', name: 'Sigma', category: 'Fun', bgClass: 'bg-zinc-900', borderClass: 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]', textClass: 'text-amber-200 font-black uppercase tracking-widest' },
  { id: 'retro-gamer', name: 'Retro Gamer', category: 'Fun', bgClass: 'bg-blue-600', borderClass: 'border-yellow-400 border-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]', textClass: 'text-yellow-400 font-mono uppercase' },
  { id: 'glitch-mode', name: 'Glitch Mode', category: 'Fun', bgClass: 'bg-zinc-900', borderClass: 'border-zinc-100/30 skew-x-3 -rotate-1', textClass: 'text-zinc-100 font-mono line-through decoration-red-500' },
  { id: 'toxic-card', name: 'Toxic', category: 'Fun', bgClass: 'bg-lime-500/10', borderClass: 'border-lime-400/60 shadow-[0_0_25px_rgba(163,230,53,0.5)]', textClass: 'text-lime-400 font-bold' },
  { id: 'bubblegum-card', name: 'Bubblegum', category: 'Fun', bgClass: 'bg-pink-500/10', borderClass: 'border-pink-300/40 rounded-full', textClass: 'text-pink-300 font-medium' },
  // NEW Fun
  { id: 'clown-nose', name: '🤡 Honk Honk', category: 'Fun', bgClass: 'bg-yellow-300', borderClass: 'border-red-500 border-8 border-dotted', textClass: 'text-red-600 font-black uppercase italic' },
  { id: 'sus-red', name: '📮 Very Sus', category: 'Fun', bgClass: 'bg-red-700', borderClass: 'border-black border-4', textClass: 'text-white font-black tracking-widest uppercase' },
  { id: 'yolo-mode', name: 'YOLO Mode', category: 'Fun', bgClass: 'bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400', borderClass: 'border-white border-4 shadow-[0_0_30px_rgba(255,255,255,0.4)]', textClass: 'text-white font-black uppercase drop-shadow-lg' },
  { id: '404-card', name: '404 Not Found', category: 'Fun', bgClass: 'bg-black', borderClass: 'border-red-500 border-dashed border-2', textClass: 'text-red-500 font-mono' },
  { id: 'loading-card', name: '⏳ Loading...', category: 'Fun', bgClass: 'bg-zinc-900', borderClass: 'border-blue-400/40 animate-pulse', textClass: 'text-blue-400/60 font-mono' },
  { id: 'certified-real', name: 'Certified Real', category: 'Fun', bgClass: 'bg-green-600', borderClass: 'border-green-400 border-4 shadow-[0_0_20px_rgba(74,222,128,0.5)]', textClass: 'text-white font-black uppercase tracking-widest' },
  { id: 'npc-mode', name: 'NPC Mode', category: 'Fun', bgClass: 'bg-gray-700', borderClass: 'border-gray-500 border-2', textClass: 'text-gray-400 font-mono uppercase' },
  { id: 'overpowered', name: '⚡ Overpowered', category: 'Fun', bgClass: 'bg-black', borderClass: 'border-yellow-400 border-2 shadow-[0_0_30px_rgba(250,204,21,0.8)]', textClass: 'text-yellow-300 font-black uppercase' },
  { id: 'touch-grass', name: 'Touch Grass', category: 'Fun', bgClass: 'bg-green-800', borderClass: 'border-green-400 border-2', textClass: 'text-green-300 font-bold' },
  { id: 'big-brain', name: 'Big Brain', category: 'Fun', bgClass: 'bg-purple-900', borderClass: 'border-purple-400 shadow-[0_0_20px_rgba(167,139,250,0.6)]', textClass: 'text-purple-200 font-black' },
  { id: 'main-character', name: 'Main Character', category: 'Fun', bgClass: 'bg-gradient-to-br from-amber-900/40 to-red-900/40', borderClass: 'border-amber-500 border-2 shadow-[0_0_25px_rgba(245,158,11,0.5)]', textClass: 'text-amber-300 font-black italic' },
  { id: 'plot-armor', name: 'Plot Armor', category: 'Fun', bgClass: 'bg-slate-800', borderClass: 'border-sky-400 border-2 shadow-[0_0_20px_rgba(56,189,248,0.5)]', textClass: 'text-sky-300 font-bold italic' },
  { id: 'delete-system32', name: 'del system32', category: 'Fun', bgClass: 'bg-black', borderClass: 'border-white/20 border border-dashed', textClass: 'text-white/50 font-mono text-xs' },
  { id: 'stonks-only-up', name: '📈 STONKS', category: 'Fun', bgClass: 'bg-green-900', borderClass: 'border-green-400 border-2', textClass: 'text-green-400 font-black uppercase' },
  { id: 'its-giving', name: "It's Giving", category: 'Fun', bgClass: 'bg-gradient-to-r from-pink-500/20 to-purple-500/20', borderClass: 'border-pink-400/50 border-2', textClass: 'text-pink-300 font-bold italic' },

  // ── Street ───────────────────────────────────────────────────────────────────
  { id: 'drill-card', name: 'Drill', category: 'Street', bgClass: 'bg-zinc-900', borderClass: 'border-zinc-700 border-2', textClass: 'text-zinc-400 font-black uppercase' },
  { id: 'block-card', name: 'The Block', category: 'Street', bgClass: 'bg-black', borderClass: 'border-zinc-800', textClass: 'text-zinc-600 font-bold' },
  { id: 'london-card', name: 'London Fog', category: 'Street', bgClass: 'bg-slate-900/80', borderClass: 'border-slate-700', textClass: 'text-slate-400' },
  { id: 'hustle-card', name: 'Hustle', category: 'Street', bgClass: 'bg-amber-950/20', borderClass: 'border-amber-600/40', textClass: 'text-amber-500 font-black italic' },
  // NEW Street
  { id: 'graffiti-wall', name: 'Graffiti Wall', category: 'Street', bgClass: 'bg-zinc-800', borderClass: 'border-fuchsia-500 border-2 shadow-[2px_2px_0_#ff0,_-2px_-2px_0_#0ff]', textClass: 'text-fuchsia-400 font-black uppercase italic' },
  { id: 'back-alley', name: 'Back Alley', category: 'Street', bgClass: 'bg-zinc-950', borderClass: 'border-zinc-600 border border-dashed', textClass: 'text-zinc-500 font-mono' },
  { id: 'underground', name: 'Underground', category: 'Street', bgClass: 'bg-stone-900', borderClass: 'border-stone-600 border', textClass: 'text-stone-400 font-bold' },

  // ── Premium ──────────────────────────────────────────────────────────────────
  { id: 'platinum-card', name: 'Platinum', category: 'Premium', bgClass: 'bg-slate-200/10', borderClass: 'border-slate-300/40', textClass: 'text-slate-100 font-bold' },
  { id: 'diamond-card', name: 'Diamond', category: 'Premium', bgClass: 'bg-white/5', borderClass: 'border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)]', textClass: 'text-white font-black' },
  { id: 'gold-card', name: 'Gold', category: 'Premium', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]', textClass: 'text-amber-400 font-bold' },
  { id: 'royal-card', name: 'Royal', category: 'Premium', bgClass: 'bg-purple-900/40', borderClass: 'border-amber-400/60', textClass: 'text-amber-200 font-serif italic' },
  // NEW Premium
  { id: 'black-card', name: 'Black Card', category: 'Premium', bgClass: 'bg-zinc-950', borderClass: 'border-zinc-700 border shadow-[inset_0_0_20px_rgba(255,255,255,0.03)]', textClass: 'text-zinc-300 font-bold tracking-widest uppercase' },
  { id: 'obsidian-card', name: 'Obsidian', category: 'Premium', bgClass: 'bg-gradient-to-br from-zinc-900 to-black', borderClass: 'border-zinc-600 border shadow-[0_0_15px_rgba(0,0,0,0.8)]', textClass: 'text-zinc-300 font-bold' },
  { id: 'midnight-luxury', name: 'Midnight Luxury', category: 'Premium', bgClass: 'bg-gradient-to-br from-slate-900 to-indigo-950', borderClass: 'border-indigo-700/40 shadow-[0_0_20px_rgba(99,102,241,0.2)]', textClass: 'text-indigo-200 font-bold tracking-wider' },
  { id: 'vip-lounge', name: 'VIP Lounge', category: 'Premium', bgClass: 'bg-gradient-to-r from-amber-950 to-zinc-900', borderClass: 'border-amber-600/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]', textClass: 'text-amber-300 font-serif italic tracking-wide' },
  { id: 'titanium', name: 'Titanium', category: 'Premium', bgClass: 'bg-gradient-to-br from-slate-700 to-slate-900', borderClass: 'border-slate-400/50 shadow-[0_0_10px_rgba(148,163,184,0.3)]', textClass: 'text-slate-200 font-bold tracking-widest' },

  // ── Extreme ──────────────────────────────────────────────────────────────────
  { id: 'the-giant', name: 'The Giant', category: 'Extreme', bgClass: 'bg-zinc-800 scale-110 z-10', borderClass: 'border-zinc-600 border-4', textClass: 'text-white font-black text-lg' },
  { id: 'the-tiny', name: 'The Tiny', category: 'Extreme', bgClass: 'bg-zinc-900 scale-90', borderClass: 'border-zinc-800', textClass: 'text-zinc-500 text-[10px]' },
  { id: 'the-slanted', name: 'The Slanted', category: 'Extreme', bgClass: 'bg-zinc-900 -rotate-2 skew-x-2', borderClass: 'border-amber-500/30', textClass: 'text-amber-500 italic' },
  { id: 'the-comic', name: 'The Comic', category: 'Extreme', bgClass: 'bg-yellow-400', borderClass: 'border-black border-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)]', textClass: 'text-black font-black uppercase italic' },
  { id: 'the-neon-pulse', name: 'Neon Pulse', category: 'Extreme', bgClass: 'bg-black', borderClass: 'border-cyan-400 animate-pulse shadow-[0_0_30px_rgba(34,211,238,0.6)]', textClass: 'text-cyan-300 font-bold tracking-tighter' },
  { id: 'the-matrix', name: 'The Matrix', category: 'Extreme', bgClass: 'bg-black/90', borderClass: 'border-green-500/20', textClass: 'text-green-500 font-mono text-[10px] leading-none' },
  { id: 'the-gold-bar', name: 'Gold Bar', category: 'Extreme', bgClass: 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600', borderClass: 'border-yellow-700 border-b-4 border-r-4', textClass: 'text-yellow-950 font-black uppercase' },
  { id: 'the-void-walker', name: 'Void Walker', category: 'Extreme', bgClass: 'bg-black', borderClass: 'border-purple-900/50 shadow-[0_0_40px_rgba(88,28,135,0.4)]', textClass: 'text-purple-500 font-thin tracking-[0.3em]' },
  { id: 'glitch-ultra', name: 'Ultra Glitch', category: 'Extreme', bgClass: 'bg-zinc-900 animate-pulse', borderClass: 'border-red-500 skew-x-6 -rotate-2 shadow-[4px_4px_0_#0ff,-4px_-4px_0_#f0f]', textClass: 'text-white font-mono uppercase italic' },
  { id: 'void-deep', name: 'Deep Void', category: 'Extreme', bgClass: 'bg-black', borderClass: 'border-white/5 shadow-[0_0_50px_rgba(255,255,255,0.1)_inset]', textClass: 'text-white/20 font-thin tracking-[1em]' },
  { id: 'rainbow-extreme', name: 'Rainbow Overload', category: 'Extreme', bgClass: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-[length:200%_auto] animate-[gradient_1s_linear_infinite]', borderClass: 'border-white border-4', textClass: 'text-white font-black drop-shadow-lg' },
  { id: 'blood-moon-card', name: 'Blood Moon', category: 'Extreme', bgClass: 'bg-red-950', borderClass: 'border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.6)]', textClass: 'text-red-500 font-black italic' },
  // NEW Extreme
  { id: 'epilepsy-warning', name: '⚠️ Warning', category: 'Extreme', bgClass: 'bg-yellow-400 animate-bounce', borderClass: 'border-black border-4', textClass: 'text-black font-black uppercase' },
  { id: 'upside-down-card', name: 'Upside Down', category: 'Extreme', bgClass: 'bg-zinc-900 rotate-180', borderClass: 'border-red-500 border-2', textClass: 'text-red-400 font-bold' },
  { id: 'super-saiyan', name: 'Super Saiyan', category: 'Extreme', bgClass: 'bg-black', borderClass: 'border-yellow-400 border-4 shadow-[0_0_40px_rgba(250,204,21,0.9)] animate-pulse', textClass: 'text-yellow-300 font-black uppercase tracking-widest' },
  { id: 'ban-hammer', name: '🔨 Ban Hammer', category: 'Extreme', bgClass: 'bg-red-900', borderClass: 'border-red-400 border-4 shadow-[0_0_30px_rgba(248,113,113,0.7)]', textClass: 'text-red-200 font-black uppercase' },
  { id: 'absolute-cinema', name: 'Absolute Cinema', category: 'Extreme', bgClass: 'bg-black', borderClass: 'border-white/10', textClass: 'text-white/30 font-serif italic tracking-[0.4em]' },
  { id: 'world-ender', name: 'World Ender', category: 'Extreme', bgClass: 'bg-gradient-to-br from-red-950 to-black', borderClass: 'border-orange-600 border-2 shadow-[0_0_30px_rgba(234,88,12,0.6),inset_0_0_30px_rgba(234,88,12,0.2)]', textClass: 'text-orange-400 font-black uppercase tracking-widest' },

  // ── Minimal ──────────────────────────────────────────────────────────────────
  // NEW Minimal
  { id: 'clean-white', name: 'Clean White', category: 'Minimal', bgClass: 'bg-white', borderClass: 'border-gray-200 border', textClass: 'text-gray-800 font-medium' },
  { id: 'clean-black', name: 'Clean Black', category: 'Minimal', bgClass: 'bg-zinc-950', borderClass: 'border-zinc-800 border', textClass: 'text-zinc-300 font-medium' },
  { id: 'paper', name: 'Paper', category: 'Minimal', bgClass: 'bg-stone-50', borderClass: 'border-stone-300 border', textClass: 'text-stone-700 font-serif' },
  { id: 'invisible', name: 'Invisible', category: 'Minimal', bgClass: 'bg-transparent', borderClass: 'border-transparent', textClass: 'text-white/40 font-light' },
  { id: 'hairline', name: 'Hairline', category: 'Minimal', bgClass: 'bg-zinc-950', borderClass: 'border-white border-[0.5px]', textClass: 'text-white font-thin tracking-widest' },

  // ── Cyber cards ──────────────────────────────────────────────────────────────
  { id: 'card-neon-blue', name: 'Neon Blue', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]', textClass: 'text-blue-400 font-bold' },
  { id: 'card-neon-red', name: 'Neon Red', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]', textClass: 'text-red-400 font-bold' },
  { id: 'card-neon-green', name: 'Neon Green', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]', textClass: 'text-green-400 font-bold' },
  { id: 'card-neon-purple', name: 'Neon Purple', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]', textClass: 'text-purple-400 font-bold' },
  { id: 'card-neon-pink', name: 'Neon Pink', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]', textClass: 'text-pink-400 font-bold' },
  { id: 'card-neon-yellow', name: 'Neon Yellow', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]', textClass: 'text-yellow-400 font-bold' },
  { id: 'card-neon-orange', name: 'Neon Orange', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]', textClass: 'text-orange-400 font-bold' },
  { id: 'card-neon-cyan', name: 'Neon Cyan', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]', textClass: 'text-cyan-400 font-bold' },
  { id: 'card-neon-lime', name: 'Neon Lime', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-lime-500 shadow-[0_0_15px_rgba(132,204,22,0.5)]', textClass: 'text-lime-400 font-bold' },
  { id: 'card-neon-teal', name: 'Neon Teal', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]', textClass: 'text-teal-400 font-bold' },
  { id: 'card-neon-fuchsia', name: 'Neon Fuchsia', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)]', textClass: 'text-fuchsia-400 font-bold' },
  { id: 'card-neon-amber', name: 'Neon Amber', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]', textClass: 'text-amber-400 font-bold' },
  { id: 'card-hacker-green', name: 'Mainframe', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.4)]', textClass: 'text-green-500 font-mono text-xs' },
  { id: 'card-royal-diamond', name: 'Royal Diamond', category: 'Cyber', bgClass: 'bg-white/10 backdrop-blur-2xl', borderClass: 'border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.3)]', textClass: 'text-white font-black tracking-widest' },

  // ── Glass ─────────────────────────────────────────────────────────────────────
  { id: 'card-glass-blue', name: 'Glass Blue', category: 'Premium', bgClass: 'bg-blue-500/10 backdrop-blur-md', borderClass: 'border-blue-500/20', textClass: 'text-blue-200' },
  { id: 'card-glass-red', name: 'Glass Red', category: 'Premium', bgClass: 'bg-red-500/10 backdrop-blur-md', borderClass: 'border-red-500/20', textClass: 'text-red-200' },
  { id: 'card-glass-green', name: 'Glass Green', category: 'Premium', bgClass: 'bg-green-500/10 backdrop-blur-md', borderClass: 'border-green-500/20', textClass: 'text-green-200' },
  { id: 'card-glass-purple', name: 'Glass Purple', category: 'Premium', bgClass: 'bg-purple-500/10 backdrop-blur-md', borderClass: 'border-purple-500/20', textClass: 'text-purple-200' },
  { id: 'card-glass-amber', name: 'Glass Amber', category: 'Premium', bgClass: 'bg-amber-500/10 backdrop-blur-md', borderClass: 'border-amber-500/20', textClass: 'text-amber-200' },
  { id: 'card-glass-pink', name: 'Glass Pink', category: 'Premium', bgClass: 'bg-pink-500/10 backdrop-blur-md', borderClass: 'border-pink-500/20', textClass: 'text-pink-200' },
  { id: 'card-glass-cyan', name: 'Glass Cyan', category: 'Premium', bgClass: 'bg-cyan-500/10 backdrop-blur-md', borderClass: 'border-cyan-500/20', textClass: 'text-cyan-200' },
  { id: 'card-glass-emerald', name: 'Glass Emerald', category: 'Premium', bgClass: 'bg-emerald-500/10 backdrop-blur-md', borderClass: 'border-emerald-500/20', textClass: 'text-emerald-200' },

  // ── Basic Solids ─────────────────────────────────────────────────────────────
  { id: 'card-solid-blue', name: 'Solid Blue', category: 'Basic', bgClass: 'bg-blue-600', borderClass: 'border-blue-400', textClass: 'text-white' },
  { id: 'card-solid-red', name: 'Solid Red', category: 'Basic', bgClass: 'bg-red-600', borderClass: 'border-red-400', textClass: 'text-white' },
  { id: 'card-solid-green', name: 'Solid Green', category: 'Basic', bgClass: 'bg-green-600', borderClass: 'border-green-400', textClass: 'text-white' },
  { id: 'card-solid-purple', name: 'Solid Purple', category: 'Basic', bgClass: 'bg-purple-600', borderClass: 'border-purple-400', textClass: 'text-white' },
  { id: 'card-solid-pink', name: 'Solid Pink', category: 'Basic', bgClass: 'bg-pink-600', borderClass: 'border-pink-400', textClass: 'text-white' },
  { id: 'card-solid-orange', name: 'Solid Orange', category: 'Basic', bgClass: 'bg-orange-600', borderClass: 'border-orange-400', textClass: 'text-white' },
  { id: 'card-solid-cyan', name: 'Solid Cyan', category: 'Basic', bgClass: 'bg-cyan-600', borderClass: 'border-cyan-400', textClass: 'text-white' },
  { id: 'card-solid-teal', name: 'Solid Teal', category: 'Basic', bgClass: 'bg-teal-600', borderClass: 'border-teal-400', textClass: 'text-white' },
];

export const PROFILE_EFFECTS: ProfileEffect[] = [
  { id: 'effect-none', name: 'None', category: 'Basic', className: '' },

  // ── Weather ──────────────────────────────────────────────────────────────────
  { id: 'effect-snow', name: 'Snowfall', category: 'Weather', className: 'effect-snow' },
  { id: 'effect-rain', name: 'Rainstorm', category: 'Weather', className: 'effect-rain' },
  { id: 'effect-lightning', name: 'Lightning', category: 'Weather', className: 'effect-lightning' },
  { id: 'effect-snow-heavy', name: 'Heavy Snow', category: 'Weather', className: 'effect-snow-heavy' },
  { id: 'effect-rain-heavy', name: 'Heavy Rain', category: 'Weather', className: 'effect-rain-heavy' },
  { id: 'effect-storm', name: 'Storm', category: 'Weather', className: 'effect-storm' },
  { id: 'effect-fog', name: 'Fog', category: 'Weather', className: 'effect-fog' },
  { id: 'effect-hail', name: 'Hail', category: 'Weather', className: 'effect-hail' },
  // NEW Weather
  { id: 'effect-tornado', name: 'Tornado', category: 'Weather', className: 'effect-tornado' },
  { id: 'effect-sandstorm', name: 'Sandstorm', category: 'Weather', className: 'effect-sandstorm' },
  { id: 'effect-rainbow-weather', name: 'Rainbow', category: 'Weather', className: 'effect-rainbow-weather' },
  { id: 'effect-blizzard', name: 'Blizzard', category: 'Weather', className: 'effect-blizzard' },
  { id: 'effect-heatwave', name: 'Heatwave', category: 'Weather', className: 'effect-heatwave' },
  { id: 'effect-monsoon', name: 'Monsoon', category: 'Weather', className: 'effect-monsoon' },

  // ── Cyber ────────────────────────────────────────────────────────────────────
  { id: 'effect-matrix', name: 'Matrix Rain', category: 'Cyber', className: 'effect-matrix' },
  { id: 'effect-glitch', name: 'Cyber Glitch', category: 'Cyber', className: 'effect-glitch' },
  { id: 'effect-scanline', name: 'Scanlines', category: 'Cyber', className: 'effect-scanline' },
  { id: 'effect-matrix-fast', name: 'Fast Matrix', category: 'Cyber', className: 'effect-matrix-fast' },
  { id: 'effect-glitch-intense', name: 'Intense Glitch', category: 'Cyber', className: 'effect-glitch-intense' },
  { id: 'effect-scanline-vibrant', name: 'Vibrant Scanlines', category: 'Cyber', className: 'effect-scanline-vibrant' },
  // NEW Cyber
  { id: 'effect-hologram', name: 'Hologram', category: 'Cyber', className: 'effect-hologram' },
  { id: 'effect-data-stream', name: 'Data Stream', category: 'Cyber', className: 'effect-data-stream' },
  { id: 'effect-pixel-dissolve', name: 'Pixel Dissolve', category: 'Cyber', className: 'effect-pixel-dissolve' },
  { id: 'effect-circuit', name: 'Circuit Board', category: 'Cyber', className: 'effect-circuit' },
  { id: 'effect-laserbeam', name: 'Laser Beam', category: 'Cyber', className: 'effect-laserbeam' },
  { id: 'effect-binary', name: 'Binary Rain', category: 'Cyber', className: 'effect-binary' },
  { id: 'effect-static', name: 'Static Noise', category: 'Cyber', className: 'effect-static' },
  { id: 'effect-error-screen', name: 'Error Screen', category: 'Cyber', className: 'effect-error-screen' },

  // ── Elements ─────────────────────────────────────────────────────────────────
  { id: 'effect-fireflies', name: 'Fireflies', category: 'Elements', className: 'effect-fireflies' },
  { id: 'effect-bubbles', name: 'Bubbles', category: 'Elements', className: 'effect-bubbles' },
  { id: 'effect-fire', name: 'Fire', category: 'Elements', className: 'effect-fire' },
  { id: 'effect-plasma', name: 'Plasma', category: 'Elements', className: 'effect-plasma' },
  { id: 'effect-fireflies-many', name: 'Many Fireflies', category: 'Elements', className: 'effect-fireflies-many' },
  { id: 'effect-bubbles-big', name: 'Big Bubbles', category: 'Elements', className: 'effect-bubbles-big' },
  { id: 'effect-fire-intense', name: 'Intense Fire', category: 'Elements', className: 'effect-fire-intense' },
  { id: 'effect-plasma-fast', name: 'Fast Plasma', category: 'Elements', className: 'effect-plasma-fast' },
  { id: 'effect-heart-beat', name: 'Heart Beat', category: 'Elements', className: 'effect-heart-beat' },
  { id: 'effect-pulse', name: 'Pulse', category: 'Elements', className: 'effect-pulse' },
  { id: 'effect-bounce', name: 'Bounce', category: 'Elements', className: 'effect-bounce' },
  // NEW Elements
  { id: 'effect-lava-lamp', name: 'Lava Lamp', category: 'Elements', className: 'effect-lava-lamp' },
  { id: 'effect-smoke', name: 'Smoke Rings', category: 'Elements', className: 'effect-smoke' },
  { id: 'effect-water-ripple', name: 'Water Ripple', category: 'Elements', className: 'effect-water-ripple' },
  { id: 'effect-leaves', name: 'Falling Leaves', category: 'Elements', className: 'effect-leaves' },
  { id: 'effect-petals', name: 'Cherry Petals', category: 'Elements', className: 'effect-petals' },
  { id: 'effect-embers', name: 'Flying Embers', category: 'Elements', className: 'effect-embers' },
  { id: 'effect-sparks', name: 'Sparks', category: 'Elements', className: 'effect-sparks' },
  { id: 'effect-oil-slick', name: 'Oil Slick', category: 'Elements', className: 'effect-oil-slick' },
  { id: 'effect-crystal', name: 'Crystal Shards', category: 'Elements', className: 'effect-crystal' },
  { id: 'effect-mushroom-spores', name: 'Spores', category: 'Elements', className: 'effect-mushroom-spores' },

  // ── Space ────────────────────────────────────────────────────────────────────
  { id: 'effect-stars', name: 'Starfield', category: 'Space', className: 'effect-stars' },
  { id: 'effect-aurora', name: 'Aurora Borealis', category: 'Space', className: 'effect-aurora' },
  { id: 'effect-nebula', name: 'Nebula', category: 'Space', className: 'effect-nebula' },
  { id: 'effect-stars-twinkle', name: 'Twinkling Stars', category: 'Space', className: 'effect-stars-twinkle' },
  { id: 'effect-aurora-fast', name: 'Fast Aurora', category: 'Space', className: 'effect-aurora-fast' },
  { id: 'effect-nebula-vibrant', name: 'Vibrant Nebula', category: 'Space', className: 'effect-nebula-vibrant' },
  // NEW Space
  { id: 'effect-shooting-stars', name: 'Shooting Stars', category: 'Space', className: 'effect-shooting-stars' },
  { id: 'effect-warp-speed', name: 'Warp Speed', category: 'Space', className: 'effect-warp-speed' },
  { id: 'effect-black-hole', name: 'Black Hole', category: 'Space', className: 'effect-black-hole' },
  { id: 'effect-galaxy-spin', name: 'Galaxy Spin', category: 'Space', className: 'effect-galaxy-spin' },
  { id: 'effect-asteroid', name: 'Asteroid Belt', category: 'Space', className: 'effect-asteroid' },
  { id: 'effect-comet', name: 'Comets', category: 'Space', className: 'effect-comet' },
  { id: 'effect-solar-wind', name: 'Solar Wind', category: 'Space', className: 'effect-solar-wind' },
  { id: 'effect-pulsar', name: 'Pulsar', category: 'Space', className: 'effect-pulsar' },

  // ── Party ────────────────────────────────────────────────────────────────────
  { id: 'effect-confetti', name: 'Confetti', category: 'Party', className: 'effect-confetti' },
  { id: 'effect-disco', name: 'Disco', category: 'Party', className: 'effect-disco' },
  { id: 'effect-laser', name: 'Laser', category: 'Party', className: 'effect-laser' },
  { id: 'effect-confetti-fast', name: 'Fast Confetti', category: 'Party', className: 'effect-confetti-fast' },
  { id: 'effect-disco-fast', name: 'Fast Disco', category: 'Party', className: 'effect-disco-fast' },
  { id: 'effect-laser-fast', name: 'Fast Laser', category: 'Party', className: 'effect-laser-fast' },
  // NEW Party
  { id: 'effect-strobe', name: 'Strobe Light', category: 'Party', className: 'effect-strobe' },
  { id: 'effect-rave', name: 'Rave Mode', category: 'Party', className: 'effect-rave' },
  { id: 'effect-glitter', name: 'Glitter Rain', category: 'Party', className: 'effect-glitter' },
  { id: 'effect-fireworks', name: 'Fireworks', category: 'Party', className: 'effect-fireworks' },
  { id: 'effect-birthday', name: 'Birthday', category: 'Party', className: 'effect-birthday' },
  { id: 'effect-balloons', name: 'Balloons', category: 'Party', className: 'effect-balloons' },
  { id: 'effect-popper', name: 'Party Popper', category: 'Party', className: 'effect-popper' },
  { id: 'effect-smoke-machine', name: 'Smoke Machine', category: 'Party', className: 'effect-smoke-machine' },

  // ── Funny ────────────────────────────────────────────────────────────────────
  { id: 'effect-triggered', name: 'Triggered', category: 'Funny', className: 'effect-triggered' },
  { id: 'effect-hypnotoad', name: 'Hypno', category: 'Funny', className: 'effect-hypnotoad' },
  { id: 'effect-stonks', name: 'Stonks', category: 'Funny', className: 'effect-stonks' },
  { id: 'effect-not-stonks', name: 'Not Stonks', category: 'Funny', className: 'effect-not-stonks' },
  { id: 'effect-uwu', name: 'UwU Hearts', category: 'Funny', className: 'effect-uwu' },
  { id: 'effect-dvd', name: 'DVD Bounce', category: 'Funny', className: 'effect-dvd' },
  { id: 'effect-jello', name: 'Jello Wiggle', category: 'Funny', className: 'effect-jello' },
  { id: 'effect-rainbow-puke', name: 'Rainbow Puke', category: 'Funny', className: 'effect-rainbow-puke' },
  { id: 'effect-brain-empty', name: 'Brain Empty', category: 'Funny', className: 'effect-brain-empty' },
  { id: 'effect-sweat', name: 'Sweating', category: 'Funny', className: 'effect-sweat' },
  { id: 'effect-sus', name: 'Sus Flash', category: 'Funny', className: 'effect-sus' },
  { id: 'effect-clown', name: 'Clown Mode', category: 'Funny', className: 'effect-clown' },
  { id: 'effect-wasted', name: 'Wasted', category: 'Funny', className: 'effect-wasted' },
  // NEW Funny
  { id: 'effect-buffering', name: 'Buffering...', category: 'Funny', className: 'effect-buffering' },
  { id: 'effect-404', name: 'Page Not Found', category: 'Funny', className: 'effect-404' },
  { id: 'effect-touch-grass', name: 'Touch Grass', category: 'Funny', className: 'effect-touch-grass' },
  { id: 'effect-npc-mode', name: 'NPC Mode', category: 'Funny', className: 'effect-npc-mode' },
  { id: 'effect-big-brain', name: 'Big Brain Time', category: 'Funny', className: 'effect-big-brain' },
  { id: 'effect-eyes-everywhere', name: 'Eyes Watching', category: 'Funny', className: 'effect-eyes-everywhere' },
  { id: 'effect-crying-cat', name: 'Crying Cat', category: 'Funny', className: 'effect-crying-cat' },
  { id: 'effect-this-is-fine', name: 'This Is Fine 🔥', category: 'Funny', className: 'effect-this-is-fine' },
  { id: 'effect-cope', name: 'Copium', category: 'Funny', className: 'effect-cope' },
  { id: 'effect-skill-issue', name: 'Skill Issue', category: 'Funny', className: 'effect-skill-issue' },
  { id: 'effect-ratio', name: 'Ratio\'d', category: 'Funny', className: 'effect-ratio' },
  { id: 'effect-l-bozo', name: 'L + Ratio', category: 'Funny', className: 'effect-l-bozo' },
  { id: 'effect-caught-in-4k', name: 'Caught in 4K', category: 'Funny', className: 'effect-caught-in-4k' },
  { id: 'effect-vibe-check', name: 'Vibe Check', category: 'Funny', className: 'effect-vibe-check' },
  { id: 'effect-dead-inside', name: 'Dead Inside', category: 'Funny', className: 'effect-dead-inside' },
  { id: 'effect-sigma-grind', name: 'Sigma Grind', category: 'Funny', className: 'effect-sigma-grind' },
  { id: 'effect-ohio-rain', name: 'Only in Ohio', category: 'Funny', className: 'effect-ohio-rain' },
];

export const BORDERS: Border[] = (() => {
  const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone'];
  const styles = ['solid', 'dashed', 'dotted', 'double'];
  const widths = ['2', '4', '8'];
  const borders: Border[] = [
    { id: 'border-none', name: 'None', category: 'Basic', className: '' }
  ];
  let id = 1;
  for (const color of colors) {
    for (const style of styles) {
      for (const width of widths) {
        borders.push({
          id: `border-${id++}`,
          name: `${color.charAt(0).toUpperCase() + color.slice(1)} ${style.charAt(0).toUpperCase() + style.slice(1)} ${width}px`,
          category: 'Basic',
          className: `border-${color}-500 border-${style} border-${width}`
        });
      }
    }
  }
  borders.push(
    { id: 'border-gold-glow', name: 'Gold Glow', category: 'Special', className: 'border-amber-400 border-4 shadow-[0_0_15px_rgba(251,191,36,0.8)]' },
    { id: 'border-neon-pink', name: 'Neon Pink', category: 'Special', className: 'border-pink-500 border-4 shadow-[0_0_20px_rgba(236,72,153,0.8)]' },
    { id: 'border-cyber-blue', name: 'Cyber Blue', category: 'Special', className: 'border-cyan-400 border-[6px] border-double shadow-[0_0_25px_rgba(34,211,238,0.6)]' },
    { id: 'border-toxic', name: 'Toxic Sludge', category: 'Special', className: 'border-lime-500 border-8 border-dotted shadow-[0_0_30px_rgba(132,204,22,0.5)]' },
    { id: 'border-blood', name: 'Blood Moon', category: 'Special', className: 'border-red-600 border-4 shadow-[inset_0_0_20px_rgba(220,38,38,0.8),0_0_20px_rgba(220,38,38,0.8)]' },
    { id: 'border-rainbow', name: 'Rainbow Flow', category: 'Special', className: 'border-transparent border-4' },
    { id: 'border-glitch', name: 'Glitch', category: 'Special', className: 'border-white border-4 skew-x-2 -rotate-1 shadow-[2px_2px_0_rgba(255,0,0,0.5),-2px_-2px_0_rgba(0,255,255,0.5)]' },
    { id: 'border-void', name: 'The Void', category: 'Special', className: 'border-black border-8 shadow-[0_0_50px_rgba(0,0,0,1)]' },
    { id: 'border-fire-glow', name: 'Fire Glow', category: 'Special', className: 'border-orange-500 border-4 shadow-[0_0_20px_rgba(249,115,22,0.8),inset_0_0_10px_rgba(249,115,22,0.5)] animate-pulse' },
    { id: 'border-ice-shards', name: 'Ice Shards', category: 'Special', className: 'border-sky-300 border-[6px] border-double shadow-[0_0_15px_rgba(186,230,253,0.6)]' },
    { id: 'border-toxic-leak', name: 'Toxic Leak', category: 'Special', className: 'border-lime-400 border-4 border-dashed shadow-[0_0_25px_rgba(163,230,53,0.7)] animate-bounce' },
    { id: 'border-neon-pulse-blue', name: 'Neon Pulse Blue', category: 'Special', className: 'border-blue-500 border-4 animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.8)]' },
    { id: 'border-neon-pulse-red', name: 'Neon Pulse Red', category: 'Special', className: 'border-red-500 border-4 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)]' },
    { id: 'border-snake-border', name: 'Snake Border', category: 'Special', className: 'border-emerald-500 border-4 border-double' },
    { id: 'border-glitch-border', name: 'Glitch Border', category: 'Special', className: 'border-white border-4 skew-x-1 -rotate-1 shadow-[2px_2px_0_#f0f,-2px_-2px_0_#0ff]' },
    { id: 'border-gold-leaf', name: 'Gold Leaf', category: 'Special', className: 'border-amber-400 border-[3px] shadow-[0_0_15px_rgba(251,191,36,0.5)]' },
    { id: 'border-neon-fuchsia', name: 'Neon Fuchsia', category: 'Special', className: 'border-fuchsia-500 border-4 shadow-[0_0_20px_rgba(217,70,239,0.8)]' },
    { id: 'border-neon-cyan', name: 'Neon Cyan', category: 'Special', className: 'border-cyan-500 border-4 shadow-[0_0_20px_rgba(6,182,212,0.8)]' },
    { id: 'border-neon-lime', name: 'Neon Lime', category: 'Special', className: 'border-lime-500 border-4 shadow-[0_0_20px_rgba(132,204,22,0.8)]' },
    { id: 'border-neon-teal', name: 'Neon Teal', category: 'Special', className: 'border-teal-500 border-4 shadow-[0_0_20px_rgba(20,184,166,0.8)]' },
    { id: 'border-neon-indigo', name: 'Neon Indigo', category: 'Special', className: 'border-indigo-500 border-4 shadow-[0_0_20px_rgba(99,102,241,0.8)]' },
    { id: 'border-neon-violet', name: 'Neon Violet', category: 'Special', className: 'border-violet-500 border-4 shadow-[0_0_20px_rgba(139,92,246,0.8)]' },
    { id: 'border-neon-rose', name: 'Neon Rose', category: 'Special', className: 'border-rose-500 border-4 shadow-[0_0_20px_rgba(244,63,94,0.8)]' },
    { id: 'border-neon-sky', name: 'Neon Sky', category: 'Special', className: 'border-sky-500 border-4 shadow-[0_0_20px_rgba(14,165,233,0.8)]' },
    { id: 'border-neon-emerald', name: 'Neon Emerald', category: 'Special', className: 'border-emerald-500 border-4 shadow-[0_0_20px_rgba(16,185,129,0.8)]' },
    { id: 'border-neon-amber', name: 'Neon Amber', category: 'Special', className: 'border-amber-500 border-4 shadow-[0_0_20px_rgba(245,158,11,0.8)]' },
    { id: 'border-cyber-gold', name: 'Cyber Gold', category: 'Special', className: 'border-amber-500 border-4 shadow-[0_0_20px_rgba(245,158,11,0.8)]' },
    { id: 'border-cyber-silver', name: 'Cyber Silver', category: 'Special', className: 'border-slate-500 border-4 shadow-[0_0_20px_rgba(100,116,139,0.8)]' },
  );
  return borders;
})();
