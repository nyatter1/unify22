import { Theme, CardStyle, UserRank, Border, ProfileEffect } from './types';

export interface RankInfo {
  id: UserRank;
  name: string;
  icon: string;
  priority: number; // Higher is more important
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
  // The Essentials
  { id: 'vanta', name: 'Vantablack', category: 'Essentials', background: '#000000', textColor: 'text-white', accentColor: 'white' },
  { id: 'pure-white', name: 'Pure White', category: 'Essentials', background: '#ffffff', textColor: 'text-black', accentColor: 'black' },
  { id: 'slate-raw', name: 'Raw Slate', category: 'Essentials', background: '#0f172a', textColor: 'text-slate-200', accentColor: 'slate-400' },
  { id: 'zinc-raw', name: 'Raw Zinc', category: 'Essentials', background: '#18181b', textColor: 'text-zinc-200', accentColor: 'zinc-500' },
  { id: 'stone-raw', name: 'Raw Stone', category: 'Essentials', background: '#1c1917', textColor: 'text-stone-200', accentColor: 'stone-500' },

  // Aesthetic
  { id: 'lofi-night', name: 'Lofi Night', category: 'Aesthetic', background: '#1e1b4b', textColor: 'text-indigo-100', accentColor: 'indigo-500' },
  { id: 'cyber-pink', name: 'Cyber Pink', category: 'Aesthetic', background: '#4c0519', textColor: 'text-pink-100', accentColor: 'pink-500' },
  { id: 'deep-sea', name: 'Deep Sea', category: 'Aesthetic', background: '#083344', textColor: 'text-cyan-100', accentColor: 'cyan-500' },
  { id: 'emerald-dream', name: 'Emerald Dream', category: 'Aesthetic', background: '#022c22', textColor: 'text-emerald-100', accentColor: 'emerald-500' },
  { id: 'royal-velvet', name: 'Royal Velvet', category: 'Aesthetic', background: '#3b0764', textColor: 'text-purple-100', accentColor: 'purple-500' },
  { id: 'blood-moon', name: 'Blood Moon', category: 'Aesthetic', background: '#450a0a', textColor: 'text-red-100', accentColor: 'red-500' },
  { id: 'desert-dusk', name: 'Desert Dusk', category: 'Aesthetic', background: '#431407', textColor: 'text-orange-100', accentColor: 'orange-500' },

  // Street
  { id: 'the-block', name: 'The Block', category: 'Street', background: '#0a0a0a', textColor: 'text-zinc-100', accentColor: 'zinc-800' },
  { id: 'drill-grey', name: 'Drill Grey', category: 'Street', background: '#27272a', textColor: 'text-zinc-200', accentColor: 'zinc-600' },
  { id: 'london-fog', name: 'London Fog', category: 'Street', background: '#1e293b', textColor: 'text-slate-200', accentColor: 'slate-500' },
  { id: 'shadow-realm', name: 'Shadow Realm', category: 'Street', background: '#000000', textColor: 'text-zinc-500', accentColor: 'zinc-900' },
  { id: 'hustle-gold', name: 'Hustle Gold', category: 'Street', background: '#1a1a1a', textColor: 'text-amber-100', accentColor: 'amber-600' },

  // Brain Rot
  { id: 'skibidi-toilet', name: 'Skibidi Toilet', category: 'Brain Rot', background: '#334155', textColor: 'text-slate-100', accentColor: 'slate-400' },
  { id: 'sigma-grindset', name: 'Sigma Grindset', category: 'Brain Rot', background: '#171717', textColor: 'text-amber-200', accentColor: 'amber-500' },
  { id: 'rizzler-pink', name: 'Rizzler Pink', category: 'Brain Rot', background: '#500724', textColor: 'text-pink-100', accentColor: 'pink-400' },
  { id: 'gyatt-red', name: 'Gyatt Red', category: 'Brain Rot', background: '#450a0a', textColor: 'text-red-100', accentColor: 'red-400' },
  { id: 'ohio-state', name: 'Ohio State', category: 'Brain Rot', background: '#0f172a', textColor: 'text-slate-300', accentColor: 'slate-500' },

  // Niche
  { id: 'toxic-waste', name: 'Toxic Waste', category: 'Niche', background: '#052e16', textColor: 'text-lime-400', accentColor: 'lime-500' },
  { id: 'absolute-zero', name: 'Absolute Zero', category: 'Niche', background: '#0c4a6e', textColor: 'text-sky-100', accentColor: 'sky-400' },
  { id: 'savage-mode', name: 'Savage Mode', category: 'Niche', background: '#450a0a', textColor: 'text-red-500', accentColor: 'red-600' },
  { id: 'the-abyss', name: 'The Abyss', category: 'Niche', background: '#000000', textColor: 'text-zinc-600', accentColor: 'zinc-800' },
  { id: 'zen-garden', name: 'Zen Garden', category: 'Niche', background: '#f8fafc', textColor: 'text-slate-400', accentColor: 'slate-300' },
  { id: 'ink-blot', name: 'Ink Blot', category: 'Niche', background: '#0a0a0a', textColor: 'text-zinc-500', accentColor: 'zinc-800' },
  { id: 'ash-tray', name: 'Ash Tray', category: 'Niche', background: '#18181b', textColor: 'text-zinc-400', accentColor: 'zinc-600' },
  { id: 'storm-cloud', name: 'Storm Cloud', category: 'Niche', background: '#0f172a', textColor: 'text-slate-400', accentColor: 'slate-500' },
  
  // Pop Culture
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
  
  // Special
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
  // 50+ More Themes
  { id: 'cyber-neon', name: 'Cyber Neon', category: 'Cyber', background: '#000000', textColor: 'text-cyan-400', accentColor: 'cyan-500', customStyles: { borderStyle: '1px solid #22d3ee', glassEffect: true } },
  { id: 'synth-wave', name: 'Synthwave', category: 'Cyber', background: 'linear-gradient(to bottom, #2e026d, #15162c)', textColor: 'text-pink-400', accentColor: 'pink-500', customStyles: { borderStyle: '1px solid #ec4899' } },
  { id: 'retro-terminal', name: 'Terminal', category: 'Cyber', background: '#0c0c0c', textColor: 'text-green-500', accentColor: 'green-600', customStyles: { fontFamily: 'mono', borderStyle: '1px solid #16a34a' } },
  { id: 'deep-purple', name: 'Deep Purple', category: 'Aesthetic', background: '#1e1b4b', textColor: 'text-purple-300', accentColor: 'purple-500' },
  { id: 'ocean-breeze', name: 'Ocean Breeze', category: 'Aesthetic', background: '#0c4a6e', textColor: 'text-sky-200', accentColor: 'sky-400' },
  { id: 'forest-mist', name: 'Forest Mist', category: 'Aesthetic', background: '#064e3b', textColor: 'text-emerald-200', accentColor: 'emerald-500' },
  { id: 'sunset-glow', name: 'Sunset Glow', category: 'Aesthetic', background: '#431407', textColor: 'text-orange-200', accentColor: 'orange-500' },
  { id: 'midnight-blue', name: 'Midnight Blue', category: 'Aesthetic', background: '#020617', textColor: 'text-blue-200', accentColor: 'blue-500' },
  { id: 'rose-quartz', name: 'Rose Quartz', category: 'Aesthetic', background: '#450a0a', textColor: 'text-rose-200', accentColor: 'rose-500' },
  { id: 'slate-night', name: 'Slate Night', category: 'Essentials', background: '#0f172a', textColor: 'text-slate-300', accentColor: 'slate-500' },
  { id: 'zinc-night', name: 'Zinc Night', category: 'Essentials', background: '#18181b', textColor: 'text-zinc-300', accentColor: 'zinc-500' },
  { id: 'stone-night', name: 'Stone Night', category: 'Essentials', background: '#1c1917', textColor: 'text-stone-300', accentColor: 'stone-500' },
  { id: 'neutral-night', name: 'Neutral Night', category: 'Essentials', background: '#171717', textColor: 'text-neutral-300', accentColor: 'neutral-500' },
  { id: 'gray-night', name: 'Gray Night', category: 'Essentials', background: '#111827', textColor: 'text-gray-300', accentColor: 'gray-500' },
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
  { id: 'cyber-gold', name: 'Cyber Gold', category: 'Cyber', background: '#1a1a1a', textColor: 'text-amber-400', accentColor: 'amber-500', customStyles: { borderStyle: '1px solid #fbbf24', glassEffect: true } },
  { id: 'cyber-silver', name: 'Cyber Silver', category: 'Cyber', background: '#1a1a1a', textColor: 'text-slate-400', accentColor: 'slate-500', customStyles: { borderStyle: '1px solid #94a3b8', glassEffect: true } }
];

export const CARD_STYLES: CardStyle[] = [
  // The Elites
  { id: 'the-boss', name: 'The Boss', category: 'Elite', bgClass: 'bg-black', borderClass: 'border-amber-500 border-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]', textClass: 'text-amber-500 font-black uppercase tracking-tighter' },
  { id: 'the-goat', name: 'The GOAT', category: 'Elite', bgClass: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20', borderClass: 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]', textClass: 'text-amber-400 font-black italic' },
  { id: 'the-menace', name: 'The Menace', category: 'Elite', bgClass: 'bg-red-950', borderClass: 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]', textClass: 'text-red-500 font-black uppercase' },
  { id: 'the-ghost', name: 'The Ghost', category: 'Elite', bgClass: 'bg-white/5 backdrop-blur-2xl', borderClass: 'border-white/10 shadow-inner', textClass: 'text-white/40 font-light tracking-[0.5em]' },
  { id: 'the-hacker', name: 'The Hacker', category: 'Elite', bgClass: 'bg-black', borderClass: 'border-green-500/60 shadow-[0_0_15px_rgba(34,197,94,0.3)]', textClass: 'text-green-500 font-mono text-xs' },

  // Fun & Weird
  { id: 'skibidi-card', name: 'Skibidi', category: 'Fun', bgClass: 'bg-slate-800', borderClass: 'border-slate-400 border-4 rounded-none', textClass: 'text-slate-100 font-bold uppercase' },
  { id: 'rizzler-card', name: 'The Rizzler', category: 'Fun', bgClass: 'bg-pink-500/10', borderClass: 'border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.4)]', textClass: 'text-pink-400 font-black italic' },
  { id: 'sigma-card', name: 'Sigma', category: 'Fun', bgClass: 'bg-zinc-900', borderClass: 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]', textClass: 'text-amber-200 font-black uppercase tracking-widest' },
  { id: 'retro-gamer', name: 'Retro Gamer', category: 'Fun', bgClass: 'bg-blue-600', borderClass: 'border-yellow-400 border-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]', textClass: 'text-yellow-400 font-mono uppercase' },
  { id: 'glitch-mode', name: 'Glitch Mode', category: 'Fun', bgClass: 'bg-zinc-900', borderClass: 'border-zinc-100/30 skew-x-3 -rotate-1', textClass: 'text-zinc-100 font-mono line-through decoration-red-500' },
  { id: 'toxic-card', name: 'Toxic', category: 'Fun', bgClass: 'bg-lime-500/10', borderClass: 'border-lime-400/60 shadow-[0_0_25px_rgba(163,230,53,0.5)]', textClass: 'text-lime-400 font-bold' },
  { id: 'bubblegum-card', name: 'Bubblegum', category: 'Fun', bgClass: 'bg-pink-500/10', borderClass: 'border-pink-300/40 rounded-full', textClass: 'text-pink-300 font-medium' },

  // Street & Drill
  { id: 'drill-card', name: 'Drill', category: 'Street', bgClass: 'bg-zinc-900', borderClass: 'border-zinc-700 border-2', textClass: 'text-zinc-400 font-black uppercase' },
  { id: 'block-card', name: 'The Block', category: 'Street', bgClass: 'bg-black', borderClass: 'border-zinc-800', textClass: 'text-zinc-600 font-bold' },
  { id: 'london-card', name: 'London Fog', category: 'Street', bgClass: 'bg-slate-900/80', borderClass: 'border-slate-700', textClass: 'text-slate-400' },
  { id: 'hustle-card', name: 'Hustle', category: 'Street', bgClass: 'bg-amber-950/20', borderClass: 'border-amber-600/40', textClass: 'text-amber-500 font-black italic' },

  // Premium
  { id: 'platinum-card', name: 'Platinum', category: 'Premium', bgClass: 'bg-slate-200/10', borderClass: 'border-slate-300/40', textClass: 'text-slate-100 font-bold' },
  { id: 'diamond-card', name: 'Diamond', category: 'Premium', bgClass: 'bg-white/5', borderClass: 'border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.2)]', textClass: 'text-white font-black' },
  { id: 'gold-card', name: 'Gold', category: 'Premium', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]', textClass: 'text-amber-400 font-bold' },
  { id: 'royal-card', name: 'Royal', category: 'Premium', bgClass: 'bg-purple-900/40', borderClass: 'border-amber-400/60', textClass: 'text-amber-200 font-serif italic' },

  // Extreme & Experimental
  { id: 'the-giant', name: 'The Giant', category: 'Extreme', bgClass: 'bg-zinc-800 scale-110 z-10', borderClass: 'border-zinc-600 border-4', textClass: 'text-white font-black text-lg' },
  { id: 'the-tiny', name: 'The Tiny', category: 'Extreme', bgClass: 'bg-zinc-900 scale-90', borderClass: 'border-zinc-800', textClass: 'text-zinc-500 text-[10px]' },
  { id: 'the-slanted', name: 'The Slanted', category: 'Extreme', bgClass: 'bg-zinc-900 -rotate-2 skew-x-2', borderClass: 'border-amber-500/30', textClass: 'text-amber-500 italic' },
  { id: 'the-comic', name: 'The Comic', category: 'Extreme', bgClass: 'bg-yellow-400', borderClass: 'border-black border-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)]', textClass: 'text-black font-black uppercase italic' },
  { id: 'the-neon-pulse', name: 'Neon Pulse', category: 'Extreme', bgClass: 'bg-black', borderClass: 'border-cyan-400 animate-pulse shadow-[0_0_30px_rgba(34,211,238,0.6)]', textClass: 'text-cyan-300 font-bold tracking-tighter' },
  { id: 'the-matrix', name: 'The Matrix', category: 'Extreme', bgClass: 'bg-black/90', borderClass: 'border-green-500/20', textClass: 'text-green-500 font-mono text-[10px] leading-none' },
  { id: 'the-gold-bar', name: 'Gold Bar', category: 'Extreme', bgClass: 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600', borderClass: 'border-yellow-700 border-b-4 border-r-4', textClass: 'text-yellow-950 font-black uppercase' },
  { id: 'the-void-walker', name: 'Void Walker', category: 'Extreme', bgClass: 'bg-black', borderClass: 'border-purple-900/50 shadow-[0_0_40px_rgba(88,28,135,0.4)]', textClass: 'text-purple-500 font-thin tracking-[0.3em]' },
  // 50+ More Card Styles
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
  { id: 'card-neon-indigo', name: 'Neon Indigo', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-indigo-500 shadow-[0_0_15_rgba(99,102,241,0.5)]', textClass: 'text-indigo-400 font-bold' },
  { id: 'card-neon-violet', name: 'Neon Violet', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]', textClass: 'text-violet-400 font-bold' },
  { id: 'card-neon-fuchsia', name: 'Neon Fuchsia', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)]', textClass: 'text-fuchsia-400 font-bold' },
  { id: 'card-neon-rose', name: 'Neon Rose', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]', textClass: 'text-rose-400 font-bold' },
  { id: 'card-neon-sky', name: 'Neon Sky', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]', textClass: 'text-sky-400 font-bold' },
  { id: 'card-neon-emerald', name: 'Neon Emerald', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]', textClass: 'text-emerald-400 font-bold' },
  { id: 'card-neon-amber', name: 'Neon Amber', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]', textClass: 'text-amber-400 font-bold' },
  { id: 'card-neon-slate', name: 'Neon Slate', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-slate-500 shadow-[0_0_15px_rgba(100,116,139,0.5)]', textClass: 'text-slate-400 font-bold' },
  { id: 'card-neon-zinc', name: 'Neon Zinc', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-zinc-500 shadow-[0_0_15px_rgba(113,113,122,0.5)]', textClass: 'text-zinc-400 font-bold' },
  { id: 'card-neon-stone', name: 'Neon Stone', category: 'Cyber', bgClass: 'bg-black', borderClass: 'border-stone-500 shadow-[0_0_15px_rgba(120,113,108,0.5)]', textClass: 'text-stone-400 font-bold' },
  { id: 'card-glass-blue', name: 'Glass Blue', category: 'Premium', bgClass: 'bg-blue-500/10 backdrop-blur-md', borderClass: 'border-blue-500/20', textClass: 'text-blue-200' },
  { id: 'card-glass-red', name: 'Glass Red', category: 'Premium', bgClass: 'bg-red-500/10 backdrop-blur-md', borderClass: 'border-red-500/20', textClass: 'text-red-200' },
  { id: 'card-glass-green', name: 'Glass Green', category: 'Premium', bgClass: 'bg-green-500/10 backdrop-blur-md', borderClass: 'border-green-500/20', textClass: 'text-green-200' },
  { id: 'card-glass-purple', name: 'Glass Purple', category: 'Premium', bgClass: 'bg-purple-500/10 backdrop-blur-md', borderClass: 'border-purple-500/20', textClass: 'text-purple-200' },
  { id: 'card-glass-pink', name: 'Glass Pink', category: 'Premium', bgClass: 'bg-pink-500/10 backdrop-blur-md', borderClass: 'border-pink-500/20', textClass: 'text-pink-200' },
  { id: 'card-glass-yellow', name: 'Glass Yellow', category: 'Premium', bgClass: 'bg-yellow-500/10 backdrop-blur-md', borderClass: 'border-yellow-500/20', textClass: 'text-yellow-200' },
  { id: 'card-glass-orange', name: 'Glass Orange', category: 'Premium', bgClass: 'bg-orange-500/10 backdrop-blur-md', borderClass: 'border-orange-500/20', textClass: 'text-orange-200' },
  { id: 'card-glass-cyan', name: 'Glass Cyan', category: 'Premium', bgClass: 'bg-cyan-500/10 backdrop-blur-md', borderClass: 'border-cyan-500/20', textClass: 'text-cyan-200' },
  { id: 'card-glass-lime', name: 'Glass Lime', category: 'Premium', bgClass: 'bg-lime-500/10 backdrop-blur-md', borderClass: 'border-lime-500/20', textClass: 'text-lime-200' },
  { id: 'card-glass-teal', name: 'Glass Teal', category: 'Premium', bgClass: 'bg-teal-500/10 backdrop-blur-md', borderClass: 'border-teal-500/20', textClass: 'text-teal-200' },
  { id: 'card-glass-indigo', name: 'Glass Indigo', category: 'Premium', bgClass: 'bg-indigo-500/10 backdrop-blur-md', borderClass: 'border-indigo-500/20', textClass: 'text-indigo-200' },
  { id: 'card-glass-violet', name: 'Glass Violet', category: 'Premium', bgClass: 'bg-violet-500/10 backdrop-blur-md', borderClass: 'border-violet-500/20', textClass: 'text-violet-200' },
  { id: 'card-glass-fuchsia', name: 'Glass Fuchsia', category: 'Premium', bgClass: 'bg-fuchsia-500/10 backdrop-blur-md', borderClass: 'border-fuchsia-500/20', textClass: 'text-fuchsia-200' },
  { id: 'card-glass-rose', name: 'Glass Rose', category: 'Premium', bgClass: 'bg-rose-500/10 backdrop-blur-md', borderClass: 'border-rose-500/20', textClass: 'text-rose-200' },
  { id: 'card-glass-sky', name: 'Glass Sky', category: 'Premium', bgClass: 'bg-sky-500/10 backdrop-blur-md', borderClass: 'border-sky-500/20', textClass: 'text-sky-200' },
  { id: 'card-glass-emerald', name: 'Glass Emerald', category: 'Premium', bgClass: 'bg-emerald-500/10 backdrop-blur-md', borderClass: 'border-emerald-500/20', textClass: 'text-emerald-200' },
  { id: 'card-glass-amber', name: 'Glass Amber', category: 'Premium', bgClass: 'bg-amber-500/10 backdrop-blur-md', borderClass: 'border-amber-500/20', textClass: 'text-amber-200' },
  { id: 'card-glass-slate', name: 'Glass Slate', category: 'Premium', bgClass: 'bg-slate-500/10 backdrop-blur-md', borderClass: 'border-slate-500/20', textClass: 'text-slate-200' },
  { id: 'card-glass-zinc', name: 'Glass Zinc', category: 'Premium', bgClass: 'bg-zinc-500/10 backdrop-blur-md', borderClass: 'border-zinc-500/20', textClass: 'text-zinc-200' },
  { id: 'card-glass-stone', name: 'Glass Stone', category: 'Premium', bgClass: 'bg-stone-500/10 backdrop-blur-md', borderClass: 'border-stone-500/20', textClass: 'text-stone-200' },
  { id: 'card-solid-blue', name: 'Solid Blue', category: 'Basic', bgClass: 'bg-blue-600', borderClass: 'border-blue-400', textClass: 'text-white' },
  { id: 'card-solid-red', name: 'Solid Red', category: 'Basic', bgClass: 'bg-red-600', borderClass: 'border-red-400', textClass: 'text-white' },
  { id: 'card-solid-green', name: 'Solid Green', category: 'Basic', bgClass: 'bg-green-600', borderClass: 'border-green-400', textClass: 'text-white' },
  { id: 'card-solid-purple', name: 'Solid Purple', category: 'Basic', bgClass: 'bg-purple-600', borderClass: 'border-purple-400', textClass: 'text-white' },
  { id: 'card-solid-pink', name: 'Solid Pink', category: 'Basic', bgClass: 'bg-pink-600', borderClass: 'border-pink-400', textClass: 'text-white' },
  { id: 'card-solid-yellow', name: 'Solid Yellow', category: 'Basic', bgClass: 'bg-yellow-600', borderClass: 'border-yellow-400', textClass: 'text-white' },
  { id: 'card-solid-orange', name: 'Solid Orange', category: 'Basic', bgClass: 'bg-orange-600', borderClass: 'border-orange-400', textClass: 'text-white' },
  { id: 'card-solid-cyan', name: 'Solid Cyan', category: 'Basic', bgClass: 'bg-cyan-600', borderClass: 'border-cyan-400', textClass: 'text-white' },
  { id: 'card-solid-lime', name: 'Solid Lime', category: 'Basic', bgClass: 'bg-lime-600', borderClass: 'border-lime-400', textClass: 'text-white' },
  { id: 'card-solid-teal', name: 'Solid Teal', category: 'Basic', bgClass: 'bg-teal-600', borderClass: 'border-teal-400', textClass: 'text-white' },
  // More Extreme, Funny, and Special Card Styles
  { id: 'card-glitch-ultra', name: 'Ultra Glitch', category: 'Extreme', bgClass: 'bg-zinc-900 animate-pulse', borderClass: 'border-red-500 skew-x-6 -rotate-2 shadow-[4px_4px_0_#0ff,-4px_-4px_0_#f0f]', textClass: 'text-white font-mono uppercase italic' },
  { id: 'card-void-deep', name: 'Deep Void', category: 'Extreme', bgClass: 'bg-black', borderClass: 'border-white/5 shadow-[0_0_50px_rgba(255,255,255,0.1)_inset]', textClass: 'text-white/20 font-thin tracking-[1em]' },
  { id: 'card-rainbow-extreme', name: 'Rainbow Overload', category: 'Extreme', bgClass: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-[length:200%_auto] animate-[gradient_1s_linear_infinite]', borderClass: 'border-white border-4', textClass: 'text-white font-black drop-shadow-lg' },
  { id: 'card-clown-mode', name: 'Clown Mode', category: 'Fun', bgClass: 'bg-yellow-400', borderClass: 'border-red-500 border-8 border-dotted', textClass: 'text-blue-600 font-black uppercase' },
  { id: 'card-doge-vibe', name: 'Much Wow', category: 'Fun', bgClass: 'bg-[#c2a679]', borderClass: 'border-[#e1c699] border-4 rounded-[40px]', textClass: 'text-white font-serif italic' },
  { id: 'card-minecraft-steve', name: 'Blocky', category: 'Fun', bgClass: 'bg-[#4b3621]', borderClass: 'border-[#3f2e1d] border-4 rounded-none', textClass: 'text-[#55ff55] font-mono uppercase' },
  { id: 'card-hacker-green', name: 'Mainframe', category: 'Special', bgClass: 'bg-black', borderClass: 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.4)]', textClass: 'text-green-500 font-mono text-xs' },
  { id: 'card-royal-diamond', name: 'Royal Diamond', category: 'Special', bgClass: 'bg-white/10 backdrop-blur-2xl', borderClass: 'border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.3)]', textClass: 'text-white font-black tracking-widest' },
  { id: 'card-blood-moon', name: 'Blood Moon', category: 'Special', bgClass: 'bg-red-950', borderClass: 'border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.6)]', textClass: 'text-red-500 font-black italic' }
];

export const PROFILE_EFFECTS: ProfileEffect[] = [
  { id: 'effect-none', name: 'None', category: 'Basic', className: '' },
  
  // Weather
  { id: 'effect-snow', name: 'Snowfall', category: 'Weather', className: 'effect-snow' },
  { id: 'effect-rain', name: 'Rainstorm', category: 'Weather', className: 'effect-rain' },
  { id: 'effect-lightning', name: 'Lightning', category: 'Weather', className: 'effect-lightning' },
  
  // Cyber
  { id: 'effect-matrix', name: 'Matrix Rain', category: 'Cyber', className: 'effect-matrix' },
  { id: 'effect-glitch', name: 'Cyber Glitch', category: 'Cyber', className: 'effect-glitch' },
  { id: 'effect-scanline', name: 'Scanlines', category: 'Cyber', className: 'effect-scanline' },
  
  // Elements
  { id: 'effect-fireflies', name: 'Fireflies', category: 'Elements', className: 'effect-fireflies' },
  { id: 'effect-bubbles', name: 'Bubbles', category: 'Elements', className: 'effect-bubbles' },
  { id: 'effect-fire', name: 'Fire', category: 'Elements', className: 'effect-fire' },
  { id: 'effect-plasma', name: 'Plasma', category: 'Elements', className: 'effect-plasma' },
  
  // Space
  { id: 'effect-stars', name: 'Starfield', category: 'Space', className: 'effect-stars' },
  { id: 'effect-aurora', name: 'Aurora Borealis', category: 'Space', className: 'effect-aurora' },
  { id: 'effect-nebula', name: 'Nebula', category: 'Space', className: 'effect-nebula' },
  
  // Party
  { id: 'effect-confetti', name: 'Confetti', category: 'Party', className: 'effect-confetti' },
  { id: 'effect-disco', name: 'Disco', category: 'Party', className: 'effect-disco' },
  { id: 'effect-laser', name: 'Laser', category: 'Party', className: 'effect-laser' },
  
  // Funny & Fun
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
  { id: 'effect-nyan', name: 'Nyan Trail', category: 'Funny', className: 'effect-nyan' }
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
    { id: 'border-rainbow', name: 'Rainbow Flow', category: 'Special', className: 'border-transparent border-4 bg-clip-border bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-[gradient_3s_linear_infinite] bg-[length:200%_auto]' },
    { id: 'border-glitch', name: 'Glitch', category: 'Special', className: 'border-white border-4 skew-x-2 -rotate-1 shadow-[2px_2px_0_rgba(255,0,0,0.5),-2px_-2px_0_rgba(0,255,255,0.5)]' },
    { id: 'border-void', name: 'The Void', category: 'Special', className: 'border-black border-8 shadow-[0_0_50px_rgba(0,0,0,1)]' },
    // More Special and Effect Borders
    { id: 'border-fire-glow', name: 'Fire Glow', category: 'Special', className: 'border-orange-500 border-4 shadow-[0_0_20px_rgba(249,115,22,0.8),inset_0_0_10px_rgba(249,115,22,0.5)] animate-pulse' },
    { id: 'border-ice-shards', name: 'Ice Shards', category: 'Special', className: 'border-sky-300 border-[6px] border-double shadow-[0_0_15px_rgba(186,230,253,0.6)]' },
    { id: 'border-toxic-leak', name: 'Toxic Leak', category: 'Special', className: 'border-lime-400 border-4 border-dashed shadow-[0_0_25px_rgba(163,230,53,0.7)] animate-bounce' },
    { id: 'border-neon-pulse-blue', name: 'Neon Pulse Blue', category: 'Special', className: 'border-blue-500 border-4 animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.8)]' },
    { id: 'border-neon-pulse-red', name: 'Neon Pulse Red', category: 'Special', className: 'border-red-500 border-4 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.8)]' },
    { id: 'border-snake-border', name: 'Snake Border', category: 'Special', className: 'border-emerald-500 border-4 border-double animate-[spin_10s_linear_infinite]' },
    { id: 'border-glitch-border', name: 'Glitch Border', category: 'Special', className: 'border-white border-4 skew-x-1 -rotate-1 shadow-[2px_2px_0_#f0f,-2px_-2px_0_#0ff]' },
    { id: 'border-gold-leaf', name: 'Gold Leaf', category: 'Special', className: 'border-amber-400 border-[3px] shadow-[0_0_15px_rgba(251,191,36,0.5)] bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600' }
  );
  return borders;
})();

export const PETS = [
  { id: 'pet-none', name: 'None', icon: '' },
  { id: 'pet-cat', name: 'Cat', icon: '🐱' },
  { id: 'pet-dog', name: 'Dog', icon: '🐶' },
  { id: 'pet-dragon', name: 'Dragon', icon: '🐉' },
  { id: 'pet-ghost', name: 'Ghost', icon: '👻' },
  { id: 'pet-alien', name: 'Alien', icon: '👽' },
  { id: 'pet-robot', name: 'Robot', icon: '🤖' },
  { id: 'pet-unicorn', name: 'Unicorn', icon: '🦄' },
  { id: 'pet-fox', name: 'Fox', icon: '🦊' },
  { id: 'pet-penguin', name: 'Penguin', icon: '🐧' },
  { id: 'pet-monkey', name: 'Monkey', icon: '🐒' },
  { id: 'pet-owl', name: 'Owl', icon: '🦉' },
  { id: 'pet-bat', name: 'Bat', icon: '🦇' },
  { id: 'pet-turtle', name: 'Turtle', icon: '🐢' },
  { id: 'pet-snake', name: 'Snake', icon: '🐍' },
  { id: 'pet-spider', name: 'Spider', icon: '🕷️' },
  { id: 'pet-dinosaur', name: 'T-Rex', icon: '🦖' },
];

export const CURSORS = [
  { id: 'cursor-default', name: 'Default', css: 'auto' },
  { id: 'cursor-pointer', name: 'Pointer', css: 'pointer' },
  { id: 'cursor-crosshair', name: 'Crosshair', css: 'crosshair' },
  { id: 'cursor-help', name: 'Help', css: 'help' },
  { id: 'cursor-wait', name: 'Wait', css: 'wait' },
  { id: 'cursor-text', name: 'Text', css: 'text' },
  { id: 'cursor-move', name: 'Move', css: 'move' },
  { id: 'cursor-not-allowed', name: 'Not Allowed', css: 'not-allowed' },
  { id: 'cursor-zoom-in', name: 'Zoom In', css: 'zoom-in' },
  { id: 'cursor-grab', name: 'Grab', css: 'grab' },
  { id: 'cursor-custom-sword', name: 'Sword', css: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M14.5 17.5L3 6V3h3l11.5 11.5\'/><path d=\'M13 19l6-6\'/><path d=\'M16 16l4 4\'/><path d=\'M19 21l2-2\'/></svg>") 0 0, auto' },
  { id: 'cursor-custom-wand', name: 'Magic Wand', css: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'gold\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M15 4V2\'/><path d=\'M15 16v-2\'/><path d=\'M8 9h2\'/><path d=\'M20 9h2\'/><path d=\'M17.8 11.8L19 13\'/><path d=\'M15 9h0\'/><path d=\'M17.8 6.2L19 5\'/><path d=\'M3 21l9-9\'/><path d=\'M12.2 6.2L11 5\'/></svg>") 0 0, auto' },
];
