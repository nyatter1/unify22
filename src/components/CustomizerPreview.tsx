import React from 'react';
import { Theme, CardStyle, Border, ProfileEffect, UserProfile } from '../types';
import { AVATARS, DEFAULT_PFP } from '../constants';
import { cn } from '../lib/utils';

interface CustomizerPreviewProps {
  user: UserProfile;
  tab: 'themes' | 'cards' | 'borders' | 'effects';
  selectedTheme?: Theme;
  selectedCard?: CardStyle;
  selectedBorder?: Border;
  selectedEffect?: ProfileEffect;
}

export const CustomizerPreview: React.FC<CustomizerPreviewProps> = ({
  user,
  tab,
  selectedTheme,
  selectedCard,
  selectedBorder,
  selectedEffect
}) => {
  // Preview logic based on tab
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-zinc-950 rounded-3xl border border-white/10 overflow-hidden relative">
      {/* Background Effect */}
      {selectedEffect && (
        <div className={cn("absolute inset-0 z-0", selectedEffect.className)} />
      )}
      
      {/* Content Preview */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {tab === 'themes' && selectedTheme && (
          <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md w-full">
            <h3 className="text-white font-bold mb-2">Theme Preview: {selectedTheme.name}</h3>
            <div className="h-32 rounded-lg" style={{ background: typeof selectedTheme.background === 'string' ? selectedTheme.background : '#000' }} />
          </div>
        )}
        
        {tab !== 'themes' && selectedCard && (
          <div className="relative">
            <div className={cn(
              "p-6 rounded-2xl border-2 flex items-center gap-4 min-w-[240px]",
              selectedCard.bgClass,
              selectedBorder && selectedBorder.id !== 'border-none' ? selectedBorder.className : selectedCard.borderClass,
              selectedCard.animationClass
            )}>
              <img src={user.pfp || DEFAULT_PFP} className="w-12 h-12 rounded-full" alt="pfp" />
              <div>
                <p className={cn("font-bold", selectedCard.textClass)}>{user.username}</p>
                <p className={cn("text-xs", selectedCard.textClass)}>{user.rank}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
