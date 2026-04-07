import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../../types';
import { DEFAULT_PFP, DEFAULT_BANNER, RANKS } from '../../constants';
import { cn } from '../../lib/utils';

interface CustomizerPreviewProps {
  user: UserProfile;
  tab: string;
  selectedTheme: any;
  selectedCard: any;
  selectedBorder: any;
  selectedEffect: any;
}

export const CustomizerPreview = ({
  user,
  tab,
  selectedTheme,
  selectedCard,
  selectedBorder,
  selectedEffect
}: CustomizerPreviewProps) => {
  return (
    <div className="h-full flex flex-col space-y-8">
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Preview</p>
        <p className="text-xs text-white/20 italic">See how your changes look in real-time</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {tab === 'themes' ? (
          <div
            className="w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative"
            style={{ background: selectedTheme?.background || user.theme }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            <div className="absolute inset-0 p-6 flex flex-col gap-4">
              <div className="h-4 w-1/3 bg-white/10 rounded-full" />
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/4 bg-white/20 rounded-full" />
                  <div className="h-10 w-2/3 bg-white/10 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        ) : tab === 'cards' || tab === 'borders' ? (
          <div className="w-full space-y-6">
            <div
              className={cn(
                "p-6 flex items-center gap-4 transition-all",
                selectedCard?.className || "bg-white/5 rounded-2xl border border-white/10"
              )}
              style={selectedCard?.style}
            >
              <div className="relative">
                <img
                  src={user.pfp || DEFAULT_PFP}
                  className={cn(
                    "w-16 h-16 rounded-full object-cover shadow-2xl",
                    selectedBorder?.className || "border-2 border-white/20"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn("text-xl font-serif italic truncate", selectedCard?.textClass || "text-white")}>
                    {user.username}
                  </p>
                  <img
                    src={user.customRank?.icon || RANKS.find(r => r.id === (user.rank || 'VIP'))?.icon}
                    className="w-5 h-5 object-contain"
                    alt="rank"
                  />
                </div>
                <p className="text-xs opacity-40 uppercase tracking-widest font-bold mt-1">
                  {user.status || user.rank}
                </p>
              </div>
            </div>
          </div>
        ) : tab === 'effects' ? (
          <div className="w-full aspect-square rounded-3xl bg-zinc-900 border border-white/10 overflow-hidden relative">
            <div className={cn("absolute inset-0", selectedEffect?.className)} />
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={user.pfp || DEFAULT_PFP} className="w-24 h-24 rounded-full border-4 border-white/20 shadow-2xl relative z-10" />
            </div>
          </div>
        ) : null}
      </div>

      <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Current Selection</p>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest">Active</span>
        </div>
        <p className="text-white font-bold text-sm">
          {tab === 'themes' ? selectedTheme?.name : tab === 'cards' ? selectedCard?.name : tab === 'borders' ? selectedBorder?.name : selectedEffect?.name}
        </p>
      </div>
    </div>
  );
};
