import React, { useState, useRef } from 'react';
import { supabase } from '../supabase';
import { UserProfile } from '../types';
import { AVATARS, BANNERS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, Image as ImageIcon, Sparkles, Upload, Camera } from 'lucide-react';
import { cn } from '../lib/utils';

interface OnboardingProps {
  user: UserProfile;
  onComplete: () => void;
}

export default function Onboarding({ user, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPfp, setSelectedPfp] = useState(user.pfp || AVATARS[0]);
  const [selectedBanner, setSelectedBanner] = useState(user.banner || BANNERS[0]);
  
  const [error, setError] = useState<string | null>(null);
  
  const pfpInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'pfp' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (Supabase/Postgres limit is usually larger, but we should keep it small for performance)
    if (file.size > 500000) { // 500KB limit for safety
      setError('File is too large. Please choose an image under 500KB.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'pfp') setSelectedPfp(base64String);
      else setSelectedBanner(base64String);
    };
    reader.readAsDataURL(file);
  };

  const nextStep = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            pfp: selectedPfp,
            banner: selectedBanner,
            onboarding_step: 0,
          })
          .eq('id', user.id);

        if (updateError) throw updateError;
        onComplete();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-amber-100/90 flex flex-col items-center justify-center p-4 font-sans">
      {/* Luxury Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-16 px-12">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-serif text-xl border transition-all duration-700",
                step >= i 
                  ? "bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 border-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
                  : "bg-black/40 border-amber-900/30 text-amber-900/50"
              )}>
                {step > i ? <Check className="w-6 h-6" /> : i}
              </div>
              {i < 2 && (
                <div className={cn(
                  "h-[1px] flex-1 mx-6 transition-all duration-700",
                  step > i ? "bg-gradient-to-r from-amber-500 to-amber-900" : "bg-amber-900/20"
                )} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 z-50 bg-red-500/90 backdrop-blur-md text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl border border-red-400/20"
            >
              {error}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-black/40 backdrop-blur-2xl border border-amber-900/20 rounded-[2rem] p-10 shadow-2xl"
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-serif italic text-gradient bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent mb-2">
                  Personalize Your Identity
                </h2>
                <p className="text-amber-700/60 tracking-widest uppercase text-xs">Step 01 — Visual Presence</p>
              </div>
              
              <div className="space-y-12">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                    <button 
                      onClick={() => pfpInputRef.current?.click()}
                      className="relative w-32 h-32 rounded-full border-2 border-amber-500/30 overflow-hidden bg-black/60 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                    >
                      <img src={selectedPfp} alt="Profile" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                        <Camera className="w-6 h-6 text-amber-400" />
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-tighter">Upload</span>
                      </div>
                    </button>
                    <input 
                      type="file" 
                      ref={pfpInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'pfp')} 
                    />
                  </div>
                  <p className="mt-4 text-sm text-amber-500/50 font-medium">Click to upload custom profile picture</p>
                  
                  <div className="mt-6 w-full">
                    <p className="text-[10px] text-amber-900/60 uppercase tracking-widest mb-3 text-center">Or select a preset</p>
                    <div className="flex justify-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                      {AVATARS.map((url) => (
                        <button
                          key={url}
                          onClick={() => setSelectedPfp(url)}
                          className={cn(
                            "w-10 h-10 rounded-full border transition-all flex-shrink-0",
                            selectedPfp === url ? "border-amber-400 scale-110 shadow-lg" : "border-amber-900/20 opacity-40 hover:opacity-100"
                          )}
                        >
                          <img src={url} className="w-full h-full rounded-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Banner Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-xs text-amber-900/60 uppercase tracking-widest">Profile Banner</p>
                    <button 
                      onClick={() => bannerInputRef.current?.click()}
                      className="text-[10px] font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                      <Upload className="w-3 h-3" /> Upload Custom
                    </button>
                    <input 
                      type="file" 
                      ref={bannerInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'banner')} 
                    />
                  </div>
                  
                  <div className="relative h-32 rounded-2xl border border-amber-900/20 overflow-hidden bg-black/40 group">
                    <img src={selectedBanner} alt="Banner" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="px-4 py-1 rounded-full border border-amber-500/30 bg-black/60 backdrop-blur-md text-[10px] text-amber-400 uppercase tracking-[0.2em]">
                        Preview
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {BANNERS.map((url) => (
                      <button
                        key={url}
                        onClick={() => setSelectedBanner(url)}
                        className={cn(
                          "h-12 rounded-lg border transition-all overflow-hidden",
                          selectedBanner === url ? "border-amber-400 scale-105" : "border-amber-900/20 opacity-40 hover:opacity-100"
                        )}
                      >
                        <img src={url} className="w-full h-full object-cover" />
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-black/40 backdrop-blur-2xl border border-amber-900/20 rounded-[2rem] p-10 shadow-2xl text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <Sparkles className="w-12 h-12 text-black" />
              </div>
              <h2 className="text-4xl font-serif italic text-gradient bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent mb-4">
                Excellence Awaits
              </h2>
              <p className="text-amber-700/60 mb-10 max-w-md mx-auto leading-relaxed">
                Your profile has been curated to perfection. Welcome to the unified experience of Uni-Fy.
              </p>
              
              <div className="max-w-sm mx-auto bg-black/60 rounded-3xl p-8 border border-amber-900/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
                <div className="relative mb-6">
                  <div className="h-28 rounded-2xl overflow-hidden border border-amber-900/20">
                    <img src={selectedBanner} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 rounded-full border-4 border-[#0a0a0a] overflow-hidden shadow-xl">
                      <img src={selectedPfp} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
                <div className="mt-12">
                  <h3 className="text-2xl font-serif text-amber-200">{user.username}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-[10px] text-amber-600 uppercase tracking-widest font-bold">{user.age} Years</span>
                    <span className="w-1 h-1 rounded-full bg-amber-900" />
                    <span className="text-[10px] text-amber-600 uppercase tracking-widest font-bold">{user.gender}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-center">
          <button
            onClick={nextStep}
            disabled={loading}
            className="group relative px-12 py-4 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 bg-[length:200%_100%] animate-shimmer group-hover:animate-none" />
            <div className="relative flex items-center gap-3 text-black font-bold uppercase tracking-[0.2em] text-xs">
              {loading ? 'Finalizing...' : step === 2 ? 'Enter Universe' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
