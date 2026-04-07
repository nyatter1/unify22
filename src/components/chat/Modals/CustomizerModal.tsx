import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Palette, Infinity } from 'lucide-react';
import { UserProfile } from '../../../types';
import { BORDERS, PROFILE_EFFECTS } from '../../../constants';
import { cn } from '../../../lib/utils';
import { CustomizerPreview } from '../CustomizerPreview';

interface CustomizerModalProps {
  showCustomizer: boolean;
  setShowCustomizer: (s: boolean) => void;
  user: UserProfile;
  currentTheme: any;
  customizerTab: 'themes' | 'cards' | 'borders' | 'effects';
  setCustomizerTab: (t: 'themes' | 'cards' | 'borders' | 'effects') => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  allThemes: any[];
  allCardStyles: any[];
  updateCustomization: (field: any, value: any) => void;
  setShowThemeEditor: (s: boolean) => void;
  setShowCardEditor: (s: boolean) => void;
  getCardStyles: (u: UserProfile) => any;
  DEFAULT_PFP: string;
}

export const CustomizerModal = ({
  showCustomizer,
  setShowCustomizer,
  user,
  currentTheme,
  customizerTab,
  setCustomizerTab,
  searchQuery,
  setSearchQuery,
  allThemes,
  allCardStyles,
  updateCustomization,
  setShowThemeEditor,
  setShowCardEditor,
  getCardStyles,
  DEFAULT_PFP
}: CustomizerModalProps) => {
  const [previewTheme, setPreviewTheme] = useState(user.theme);
  const [previewCard, setPreviewCard] = useState(user.cardStyle);
  const [previewBorder, setPreviewBorder] = useState(user.border);
  const [previewEffect, setPreviewEffect] = useState(user.profileEffect);

  useEffect(() => {
    if (showCustomizer) {
      setPreviewTheme(user.theme);
      setPreviewCard(user.cardStyle);
      setPreviewBorder(user.border);
      setPreviewEffect(user.profileEffect);
    }
  }, [showCustomizer, user.theme, user.cardStyle, user.border, user.profileEffect]);

  const handleUpdate = (field: string, value: any) => {
    if (field === 'theme') setPreviewTheme(value);
    if (field === 'cardStyle') setPreviewCard(value);
    if (field === 'border') setPreviewBorder(value);
    if (field === 'profileEffect') setPreviewEffect(value);
    updateCustomization(field, value);
  };

  return (
    <AnimatePresence>
      {showCustomizer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCustomizer(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "relative w-full max-w-5xl h-[80vh] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all",
              currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-[#0a0a0a]",
              currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-[2.5rem]",
              currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
            )}
            style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
          >
            {/* Modal Header */}
            <div className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/20">
              <div className="flex items-center gap-8">
                <h2 className="text-3xl font-serif italic text-white">Customise</h2>
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto custom-scrollbar">
                  <button
                    onClick={() => setCustomizerTab('themes')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                      customizerTab === 'themes' ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"
                    )}
                  >
                    Themes
                  </button>
                  <button
                    onClick={() => setCustomizerTab('cards')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                      customizerTab === 'cards' ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"
                    )}
                  >
                    User Cards
                  </button>
                  <button
                    onClick={() => setCustomizerTab('borders')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                      customizerTab === 'borders' ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"
                    )}
                  >
                    Borders
                  </button>
                  <button
                    onClick={() => setCustomizerTab('effects')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                      customizerTab === 'effects' ? "bg-white text-black shadow-xl" : "text-white/40 hover:text-white"
                    )}
                  >
                    Effects
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowCustomizer(false)}
                className="p-3 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Left: Preview Area */}
              <div className="w-1/3 border-r border-white/5 p-6 bg-black/20">
                <CustomizerPreview
                  user={user}
                  tab={customizerTab}
                  selectedTheme={allThemes.find(t => t.id === previewTheme)}
                  selectedCard={allCardStyles.find(s => s.id === previewCard)}
                  selectedBorder={BORDERS.find(b => b.id === previewBorder)}
                  selectedEffect={PROFILE_EFFECTS.find(e => e.id === previewEffect)}
                />
              </div>

              {/* Right: Options Area */}
              <div className="w-2/3 overflow-y-auto p-10 custom-scrollbar">
                <div className="mb-8">
                  <input
                    type="text"
                    placeholder={`Search ${customizerTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                {customizerTab === 'themes' ? (
                  <div className="space-y-12">
                    {/* Create Custom Theme Button */}
                    <button
                      onClick={() => setShowThemeEditor(true)}
                      className="w-full p-8 rounded-3xl border-2 border-dashed border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group flex flex-col items-center justify-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Palette className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold uppercase tracking-widest text-sm">Create Your Own Theme</p>
                        <p className="text-white/40 text-xs mt-1">Design a unique look for your eyes only</p>
                      </div>
                    </button>

                    {['Custom', 'Essentials', 'Aesthetic', 'Street', 'Brain Rot', 'Niche', 'Pop Culture', 'Special'].map(category => {
                      const categoryThemes = allThemes.filter(t => t.category === category && t.name.toLowerCase().includes(searchQuery.toLowerCase()));
                      if (categoryThemes.length === 0) return null;

                      return (
                        <div key={category} className="space-y-6">
                          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-[0.3em] pl-2 border-l-2 border-amber-500">{category}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryThemes.map(t => (
                              <button
                                key={t.id}
                                onClick={() => handleUpdate('theme', t.id)}
                                className={cn(
                                  "group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.02] active:scale-95",
                                  previewTheme === t.id ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]" : "border-white/5 hover:border-white/20"
                                )}
                              >
                                <div
                                  className="absolute inset-0 transition-transform group-hover:scale-110 duration-700"
                                  style={{
                                    background: t.background,
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                  <span className="text-xs font-bold text-white uppercase tracking-widest">{t.name}</span>
                                  {previewTheme === t.id && <Check className="w-4 h-4 text-amber-500" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : customizerTab === 'cards' ? (
                  <div className="space-y-12">
                    {/* Create Custom Card Button */}
                    <button
                      onClick={() => setShowCardEditor(true)}
                      className="w-full p-8 rounded-3xl border-2 border-dashed border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group flex flex-col items-center justify-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Infinity className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold uppercase tracking-widest text-sm">Create Your Own Card</p>
                        <p className="text-white/40 text-xs mt-1">Stand out with a fully custom player card</p>
                      </div>
                    </button>

                    {['Custom', 'Elite', 'Fun', 'Funny', 'Street', 'Premium', 'Minimal', 'Extreme', 'Special'].map(category => {
                      const categoryCards = allCardStyles.filter(s => s.category === category && s.name.toLowerCase().includes(searchQuery.toLowerCase()));
                      if (categoryCards.length === 0) return null;

                      return (
                        <div key={category} className="space-y-6">
                          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-[0.3em] pl-2 border-l-2 border-amber-500">{category}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryCards.map(s => {
                              const { className, style, textClass } = getCardStyles({ ...user, cardStyle: s.id });
                              return (
                                <button
                                  key={s.id}
                                  onClick={() => handleUpdate('cardStyle', s.id)}
                                  className={cn(
                                    "group relative p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-95 text-left",
                                    previewCard === s.id ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]" : "border-white/5 hover:border-white/20"
                                  )}
                                >
                                  <div className={className} style={style}>
                                    <img src={user.pfp || DEFAULT_PFP} className="w-10 h-10 rounded-full border border-white/20" />
                                    <div className="flex-1 min-w-0">
                                      <p className={cn("text-sm font-serif truncate", textClass)}>{user.username}</p>
                                      <p className="text-[9px] opacity-40 uppercase tracking-widest font-bold">{user.age}Y • {user.gender}</p>
                                    </div>
                                    {previewCard === s.id && <Check className="w-4 h-4 text-amber-500" />}
                                  </div>
                                  <div className="mt-3 flex items-center justify-between px-1">
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{s.name}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : customizerTab === 'borders' ? (
                  <div className="space-y-12">
                    {['Basic', 'Special'].map(category => {
                      const categoryBorders = BORDERS.filter(b => b.category === category);
                      if (categoryBorders.length === 0) return null;

                      return (
                        <div key={category} className="space-y-6">
                          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-[0.3em] pl-2 border-l-2 border-amber-500">{category}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryBorders.map(b => (
                              <button
                                key={b.id}
                                onClick={() => handleUpdate('border', b.id)}
                                className={cn(
                                  "group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center gap-4 bg-white/5",
                                  previewBorder === b.id ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]" : "border-white/5 hover:border-white/20"
                                )}
                              >
                                <div className={cn("w-16 h-16 rounded-full", b.className)} />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest text-center px-2">{b.name}</span>
                                {previewBorder === b.id && <Check className="absolute top-2 right-2 w-4 h-4 text-amber-500" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : customizerTab === 'effects' ? (
                  <div className="space-y-12">
                    {['Basic', 'Weather', 'Cyber', 'Elements', 'Space', 'Party', 'Funny'].map(category => {
                      const categoryEffects = PROFILE_EFFECTS.filter(e => e.category === category);
                      if (categoryEffects.length === 0) return null;

                      return (
                        <div key={category} className="space-y-6">
                          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-[0.3em] pl-2 border-l-2 border-amber-500">{category}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryEffects.map(e => (
                              <button
                                key={e.id}
                                onClick={() => handleUpdate('profileEffect', e.id)}
                                className={cn(
                                  "group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all hover:scale-[1.02] active:scale-95 bg-zinc-900",
                                  previewEffect === e.id ? "border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)]" : "border-white/5 hover:border-white/20"
                                )}
                              >
                                <div className={cn("absolute inset-0", e.className)} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                  <span className="text-xs font-bold text-white uppercase tracking-widest">{e.name}</span>
                                  {previewEffect === e.id && <Check className="w-4 h-4 text-amber-500" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
