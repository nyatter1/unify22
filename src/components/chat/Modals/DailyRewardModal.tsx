import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { UserProfile, Theme } from '../../../types';
import { supabase } from '../../../supabase';
import confetti from 'canvas-confetti';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  currentTheme: Theme;
  onShowToast: (message: string) => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
  user,
  currentTheme,
  onShowToast,
}) => {
  const handleClaimReward = async () => {
    const lastClaim = user.lastDailyReward ? new Date(user.lastDailyReward) : new Date(0);
    const now = new Date();
    const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastClaim < 24) {
      onShowToast(`You can claim again in ${Math.ceil(24 - hoursSinceLastClaim)} hours`);
      return;
    }

    const { data: currentUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
    const currentGold = currentUser?.gold || 0;
    const currentRubies = currentUser?.rubies || 0;

    await supabase.from('users').update({
      gold: currentGold + 500,
      rubies: currentRubies + 10,
      lastDailyReward: new Date().toISOString()
    }).eq('uid', user.uid);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#eab308', '#ef4444']
    });

    onShowToast('Daily reward claimed!');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "w-full max-w-sm overflow-hidden shadow-2xl flex flex-col transition-all",
              currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
              currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
              currentTheme.customStyles?.borderStyle ? "" : "border border-amber-500/30"
            )}
            style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
          >
            <div className="p-6 text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/50">
                <Gift className="w-10 h-10 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl font-serif italic text-white mb-2">Daily Reward</h2>
                <p className="text-sm text-white/60">Claim your daily login bonus!</p>
              </div>
              
              <div className="flex justify-center gap-4 py-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-500">+500</p>
                  <p className="text-xs text-white/40 uppercase tracking-widest">Gold</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">+10</p>
                  <p className="text-xs text-white/40 uppercase tracking-widest">Rubies</p>
                </div>
              </div>

              <button 
                onClick={handleClaimReward}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Claim Reward
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-white/5 text-white/60 font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
