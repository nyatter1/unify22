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
  { id: 'storm-cloud', name: 'Storm Cloud', category: 'Niche', background: '#0f172a', textColor: 'text-slate-400', accentColor: 'slate-500' }
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
  { id: 'the-void-walker', name: 'Void Walker', category: 'Extreme', bgClass: 'bg-black', borderClass: 'border-purple-900/50 shadow-[0_0_40px_rgba(88,28,135,0.4)]', textClass: 'text-purple-500 font-thin tracking-[0.3em]' }
];

export const PROFILE_EFFECTS: ProfileEffect[] = [
  { id: 'effect-none', name: 'None', category: 'Basic', className: '' },
  { id: 'effect-snow', name: 'Snowfall', category: 'Weather', className: 'effect-snow' },
  { id: 'effect-rain', name: 'Rainstorm', category: 'Weather', className: 'effect-rain' },
  { id: 'effect-matrix', name: 'Matrix Rain', category: 'Cyber', className: 'effect-matrix' },
  { id: 'effect-scanline', name: 'Scanlines', category: 'Cyber', className: 'effect-scanline' },
  { id: 'effect-glitch', name: 'Cyber Glitch', category: 'Cyber', className: 'effect-glitch' },
  { id: 'effect-fireflies', name: 'Fireflies', category: 'Elements', className: 'effect-fireflies' },
  { id: 'effect-stars', name: 'Starfield', category: 'Space', className: 'effect-stars' },
  { id: 'effect-pulse', name: 'Neon Pulse', category: 'Cyber', className: 'effect-pulse' },
  { id: 'effect-confetti', name: 'Confetti', category: 'Party', className: 'effect-confetti' },
  { id: 'effect-floating-orbs', name: 'Floating Orbs', category: 'Elements', className: 'effect-floating-orbs' },
  { id: 'effect-lightning', name: 'Lightning', category: 'Weather', className: 'effect-lightning' },
  { id: 'effect-aurora', name: 'Aurora Borealis', category: 'Space', className: 'effect-aurora' },
  { id: 'effect-blood-rain', name: 'Blood Rain', category: 'Weather', className: 'effect-blood-rain' },
  { id: 'effect-bubbles', name: 'Bubbles', category: 'Elements', className: 'effect-bubbles' },
  // New Effects
  { id: 'effect-wind', name: 'Wind', category: 'Weather', className: 'effect-wind' },
  { id: 'effect-fog', name: 'Fog', category: 'Weather', className: 'effect-fog' },
  { id: 'effect-data', name: 'Data Stream', category: 'Cyber', className: 'effect-data' },
  { id: 'effect-circuit', name: 'Circuit Board', category: 'Cyber', className: 'effect-circuit' },
  { id: 'effect-neon-grid', name: 'Neon Grid', category: 'Cyber', className: 'effect-neon-grid' },
  { id: 'effect-fire', name: 'Fire', category: 'Elements', className: 'effect-fire' },
  { id: 'effect-water', name: 'Water', category: 'Elements', className: 'effect-water' },
  { id: 'effect-plasma', name: 'Plasma', category: 'Elements', className: 'effect-plasma' },
  { id: 'effect-nebula', name: 'Nebula', category: 'Space', className: 'effect-nebula' },
  { id: 'effect-comet', name: 'Comet', category: 'Space', className: 'effect-comet' },
  { id: 'effect-noise', name: 'Noise', category: 'Texture', className: 'effect-noise' },
  { id: 'effect-grain', name: 'Grain', category: 'Texture', className: 'effect-grain' },
  { id: 'effect-paper', name: 'Paper', category: 'Texture', className: 'effect-paper' },
  { id: 'effect-canvas', name: 'Canvas', category: 'Texture', className: 'effect-canvas' },
  { id: 'effect-grid', name: 'Grid', category: 'Texture', className: 'effect-grid' },
  { id: 'effect-dots', name: 'Dots', category: 'Texture', className: 'effect-dots' },
  { id: 'effect-stripes', name: 'Stripes', category: 'Texture', className: 'effect-stripes' },
  { id: 'effect-disco', name: 'Disco', category: 'Party', className: 'effect-disco' },
  { id: 'effect-fireworks', name: 'Fireworks', category: 'Party', className: 'effect-fireworks' },
  { id: 'effect-laser', name: 'Laser', category: 'Party', className: 'effect-laser' },
  { id: 'effect-wave', name: 'Wave', category: 'Abstract', className: 'effect-wave' },
  { id: 'effect-flow', name: 'Flow', category: 'Abstract', className: 'effect-flow' },
  { id: 'effect-warp', name: 'Warp', category: 'Abstract', className: 'effect-warp' },
  { id: 'effect-tunnel', name: 'Tunnel', category: 'Abstract', className: 'effect-tunnel' },
  { id: 'effect-vortex', name: 'Vortex', category: 'Abstract', className: 'effect-vortex' },
  { id: 'effect-sparkles', name: 'Sparkles', category: 'Elements', className: 'effect-sparkles' },
  { id: 'effect-smoke', name: 'Smoke', category: 'Weather', className: 'effect-smoke' },
  { id: 'effect-sand', name: 'Sandstorm', category: 'Weather', className: 'effect-sand' },
  { id: 'effect-lava', name: 'Lava', category: 'Elements', className: 'effect-lava' },
  { id: 'effect-ice', name: 'Ice', category: 'Elements', className: 'effect-ice' },
  { id: 'effect-shadow', name: 'Shadow', category: 'Abstract', className: 'effect-shadow' },
  { id: 'effect-light', name: 'Light', category: 'Abstract', className: 'effect-light' },
  { id: 'effect-bloom', name: 'Bloom', category: 'Abstract', className: 'effect-bloom' },
  { id: 'effect-blur', name: 'Blur', category: 'Abstract', className: 'effect-blur' },
  { id: 'effect-invert', name: 'Invert', category: 'Abstract', className: 'effect-invert' },
  { id: 'effect-sepia', name: 'Sepia', category: 'Texture', className: 'effect-sepia' },
  { id: 'effect-grayscale', name: 'Grayscale', category: 'Texture', className: 'effect-grayscale' }
];

export const BORDERS: Border[] = (() => {
  const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone'];
  const styles = ['solid', 'dashed', 'dotted', 'double'];
  const widths = ['2', '4', '8'];
  const borders: Border[] = [];
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
    { id: 'border-void', name: 'The Void', category: 'Special', className: 'border-black border-8 shadow-[0_0_50px_rgba(0,0,0,1)]' }
  );
  return borders;
})();
