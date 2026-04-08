import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Camera, Image, Youtube, Award, Shield, Check } from 'lucide-react';
import { UserProfile } from '../../../types';
import { cn } from '../../../lib/utils';
import { DEFAULT_PFP, DEFAULT_BANNER } from '../../../constants';

interface EditProfileModalProps {
  showEditProfile: boolean;
  setShowEditProfile: (s: boolean) => void;
  user: UserProfile;
  editTab: 'username' | 'info' | 'bio' | 'pfp' | 'banner' | 'main' | 'rank' | 'youtube';
  setEditTab: (t: 'username' | 'info' | 'bio' | 'pfp' | 'banner' | 'main' | 'rank' | 'youtube') => void;
  updateCustomization: (field: any, value: any) => void;
  pfpInputRef: React.RefObject<HTMLInputElement>;
  bannerInputRef: React.RefObject<HTMLInputElement>;
  customRankInputRef: React.RefObject<HTMLInputElement>;
  customRankForm: { name: string; icon: string };
  setCustomRankForm: (f: any) => void;
  handleRankIconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveCustomRank: () => void;
  resetCustomRank: () => void;
}

export const EditProfileModal = ({
  showEditProfile,
  setShowEditProfile,
  user,
  editTab,
  setEditTab,
  updateCustomization,
  pfpInputRef,
  bannerInputRef,
  customRankInputRef,
  customRankForm,
  setCustomRankForm,
  handleRankIconUpload,
  saveCustomRank,
  resetCustomRank
}: EditProfileModalProps) => {
  return (
    <AnimatePresence>
      {showEditProfile && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditProfile(false)}
            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-white">Edit Profile</h2>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Personalise your presence</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditProfile(false)}
                className="p-3 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Navigation Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
                {[
                  { id: 'main', label: 'General', icon: User },
                  { id: 'pfp', label: 'Avatar', icon: Camera },
                  { id: 'banner', label: 'Banner', icon: Image },
                  { id: 'youtube', label: 'Social', icon: Youtube },
                  { id: 'rank', label: 'Rank', icon: Award },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setEditTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                      editTab === tab.id ? "bg-white text-black shadow-xl" : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {editTab === 'main' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Username</label>
                    <input 
                      type="text" 
                      value={user.username}
                      onChange={e => updateCustomization('username', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Age</label>
                      <input 
                        type="number" 
                        value={user.age}
                        onChange={e => updateCustomization('age', parseInt(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Gender</label>
                      <select 
                        value={user.gender}
                        onChange={e => updateCustomization('gender', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-500/50 appearance-none"
                      >
                        <option value="Male" className="bg-zinc-900 text-white">Male</option>
                        <option value="Female" className="bg-zinc-900 text-white">Female</option>
                        <option value="Other" className="bg-zinc-900 text-white">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Bio</label>
                    <textarea 
                      value={user.bio || ''}
                      onChange={e => updateCustomization('bio', e.target.value)}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-500/50 resize-none"
                    />
                  </div>
                </div>
              )}

              {editTab === 'pfp' && (
                <div className="space-y-8 flex flex-col items-center">
                  <div className="relative group">
                    <img 
                      src={user.pfp || DEFAULT_PFP} 
                      className="w-48 h-48 rounded-full object-cover border-4 border-white/10 shadow-2xl"
                    />
                    <button 
                      onClick={() => pfpInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-10 h-10 text-white" />
                    </button>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-white font-bold uppercase tracking-widest text-sm">Profile Picture</p>
                    <p className="text-white/40 text-xs">Recommended: Square image, max 5MB</p>
                  </div>
                  <button 
                    onClick={() => pfpInputRef.current?.click()}
                    className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                  >
                    Upload New Avatar
                  </button>
                </div>
              )}

              {editTab === 'banner' && (
                <div className="space-y-8 flex flex-col items-center">
                  <div className="relative group w-full aspect-[3/1] rounded-3xl overflow-hidden border-2 border-white/10">
                    <img 
                      src={user.banner || DEFAULT_BANNER} 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={() => bannerInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="w-10 h-10 text-white" />
                    </button>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-white font-bold uppercase tracking-widest text-sm">Profile Banner</p>
                    <p className="text-white/40 text-xs">Recommended: 1500x500px, max 5MB</p>
                  </div>
                  <button 
                    onClick={() => bannerInputRef.current?.click()}
                    className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                  >
                    Upload New Banner
                  </button>
                </div>
              )}

              {editTab === 'youtube' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-red-500/10">
                      <Youtube className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Profile Background Music</p>
                      <p className="text-white/40 text-xs">Add a YouTube video to play on your profile</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">YouTube Video URL</label>
                    <input 
                      type="text" 
                      value={user.profileVideoUrl || ''}
                      onChange={e => updateCustomization('profileVideoUrl', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-red-500/50"
                    />
                  </div>
                  {user.profileVideoUrl && (
                    <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${user.profileVideoUrl.split('v=')[1]?.split('&')[0] || user.profileVideoUrl.split('/').pop()}`}
                        allow="autoplay; encrypted-media"
                      />
                    </div>
                  )}
                </div>
              )}

              {editTab === 'rank' && (
                <div className="space-y-8">
                  <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex flex-col items-center gap-6 text-center">
                    <div className="p-4 rounded-3xl bg-amber-500/10">
                      <Shield className="w-10 h-10 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-serif italic text-white">Custom Rank Designer</h4>
                      <p className="text-white/40 text-xs mt-1">Design a unique rank that appears next to your name</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Rank Name</label>
                        <input 
                          type="text" 
                          value={customRankForm.name}
                          onChange={e => setCustomRankForm({ ...customRankForm, name: e.target.value })}
                          placeholder="e.g. The Chosen One"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Rank Icon</label>
                        <button 
                          onClick={() => customRankInputRef.current?.click()}
                          className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                        >
                          <Camera className="w-5 h-5" />
                          {customRankForm.icon ? 'Change Icon' : 'Upload Icon'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Preview</p>
                      <div className="p-8 rounded-3xl bg-black/40 border border-white/5 flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                          {customRankForm.icon && (
                            <img src={customRankForm.icon} className="w-5 h-5 rounded-full object-cover" />
                          )}
                          <span className="text-sm font-bold text-white uppercase tracking-[0.2em]">
                            {customRankForm.name || 'Your Rank'}
                          </span>
                        </div>
                        <p className="text-xs text-white/20">This is how it will look in chat</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={saveCustomRank}
                      className="flex-1 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                    >
                      Save Custom Rank
                    </button>
                    {user.customRank && (
                      <button 
                        onClick={resetCustomRank}
                        className="px-8 py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-500/20 transition-all"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
