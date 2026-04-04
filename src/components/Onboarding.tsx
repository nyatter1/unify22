import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { THEMES, AVATARS, BANNERS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, Image as ImageIcon, Palette, Sparkles, Infinity } from 'lucide-react';
import { cn } from '../lib/utils';

interface OnboardingProps {
  user: UserProfile;
  onComplete: () => void;
}

export default function Onboarding({ user, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPfp, setSelectedPfp] = useState(user.pfp);
  const [selectedBanner, setSelectedBanner] = useState(user.banner);
  const [selectedTheme, setSelectedTheme] = useState(user.theme);

  const nextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          pfp: selectedPfp,
          banner: selectedBanner,
          theme: selectedTheme,
          onboardingStep: 0, // 0 means completed
        });
        onComplete();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500",
                step >= i ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20" : "bg-slate-800 text-slate-500"
              )}>
                {step > i ? <Check className="w-6 h-6" /> : i}
              </div>
              {i < 3 && (
                <div className={cn(
                  "h-1 flex-1 mx-4 rounded-full transition-all duration-500",
                  step > i ? "bg-amber-500" : "bg-slate-800"
                )} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <ImageIcon className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-bold">Profile Identity</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-4">Choose an Avatar</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {AVATARS.map((url) => (
                      <button
                        key={url}
                        onClick={() => setSelectedPfp(url)}
                        className={cn(
                          "relative rounded-full overflow-hidden border-2 transition-all hover:scale-110",
                          selectedPfp === url ? "border-amber-500 scale-110 shadow-lg shadow-amber-500/20" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                        {selectedPfp === url && (
                          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                            <Check className="w-6 h-6 text-amber-500" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-4">Choose a Banner</label>
                  <div className="grid grid-cols-2 gap-4">
                    {BANNERS.map((url) => (
                      <button
                        key={url}
                        onClick={() => setSelectedBanner(url)}
                        className={cn(
                          "relative h-24 rounded-xl overflow-hidden border-2 transition-all",
                          selectedBanner === url ? "border-amber-500 shadow-lg shadow-amber-500/20" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <img src={url} alt="Banner" className="w-full h-full object-cover" />
                        {selectedBanner === url && (
                          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                            <Check className="w-6 h-6 text-amber-500" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-bold">Choose Your Theme</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                      selectedTheme === theme.id ? "border-amber-500 bg-amber-500/10" : "border-slate-800 bg-slate-800/50 hover:border-slate-700"
                    )}
                  >
                    <div className="w-full h-12 rounded-lg flex gap-1 p-1" style={{ backgroundColor: theme.bg }}>
                      <div className="w-1/2 h-full rounded" style={{ backgroundColor: theme.primary }} />
                      <div className="w-1/2 h-full rounded" style={{ backgroundColor: theme.secondary }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: selectedTheme === theme.id ? '#f59e0b' : theme.text }}>
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-amber-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">All Set!</h2>
              <p className="text-slate-400 mb-8">
                Your profile is ready. Welcome to Uni-Fy, {user.username}.
              </p>
              
              <div className="max-w-sm mx-auto bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="relative mb-4">
                  <img src={selectedBanner} className="w-full h-24 rounded-xl object-cover" />
                  <img src={selectedPfp} className="w-16 h-16 rounded-full border-4 border-slate-800 absolute -bottom-8 left-1/2 -translate-x-1/2" />
                </div>
                <div className="mt-10">
                  <h3 className="text-xl font-bold">{user.username}</h3>
                  <p className="text-slate-400 text-sm">{user.age} years • {user.gender}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-end">
          <button
            onClick={nextStep}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            {loading ? 'Finalizing...' : step === 3 ? 'Finish' : 'Next Step'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
