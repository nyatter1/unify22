import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, UserPlus, UserMinus, Edit3, Heart, Shield, Coins, Gem, MessageSquare } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { UserProfile, Theme, Border, ProfileEffect, AppNotification } from '../../../types';
import { DEFAULT_PFP, DEFAULT_BANNER, BORDERS, PROFILE_EFFECTS, RANKS } from '../../../constants';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProfile: UserProfile | null;
  user: UserProfile;
  currentTheme: Theme;
  allUsers: UserProfile[];
  notifications: AppNotification[];
  onEditProfile: () => void;
  onSendFriendRequest: (uid: string) => void;
  onUnaddFriend: (uid: string) => void;
  onToggleLike: (uid: string) => void;
  onBannerClick: () => void;
  onPfpClick: () => void;
  onRateProfile: (uid: string) => void;
  onOpenOptions: (uid: string) => void;
  onMessage: (uid: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  selectedProfile,
  user,
  currentTheme,
  allUsers,
  notifications,
  onEditProfile,
  onSendFriendRequest,
  onUnaddFriend,
  onToggleLike,
  onBannerClick,
  onPfpClick,
  onRateProfile,
  onOpenOptions,
  onMessage,
}) => {
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (!selectedProfile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
          />

          {/* YouTube Background Video (Full Screen Behind Card) */}
          {selectedProfile.profileVideoUrl && (
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <iframe
                className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                src={`https://www.youtube.com/embed/${getYouTubeId(selectedProfile.profileVideoUrl)}?autoplay=1&mute=0&loop=1&playlist=${getYouTubeId(selectedProfile.profileVideoUrl)}&controls=0&showinfo=0&rel=0&enablejsapi=1&playsinline=1`}
                allow="autoplay; encrypted-media"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "relative w-full max-w-xl overflow-hidden shadow-2xl flex flex-col transition-all",
              currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
              currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-[3rem]",
              selectedProfile.border ? BORDERS.find(b => b.id === selectedProfile.border)?.className : (currentTheme.customStyles?.borderStyle ? "" : "border border-white/10")
            )}
            style={{ border: !selectedProfile.border && currentTheme.customStyles?.borderStyle ? currentTheme.customStyles.borderStyle : undefined }}
          >
            {/* Profile Effect Container */}
            {selectedProfile.profileEffect && (
              <div className={cn("absolute inset-0 z-0 rounded-[3rem] overflow-hidden pointer-events-none", PROFILE_EFFECTS.find(e => e.id === selectedProfile.profileEffect)?.className)} />
            )}

            {/* Banner */}
            <div 
              className={cn(
                "relative h-48 w-full overflow-hidden z-10",
                selectedProfile.uid === user.uid && "cursor-pointer group"
              )}
              onClick={() => selectedProfile.uid === user.uid && onBannerClick()}
            >
              <img 
                src={selectedProfile.banner || DEFAULT_BANNER} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              
              {selectedProfile.uid === user.uid && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="absolute top-6 right-6 flex items-center gap-3 z-30">
                {selectedProfile.uid !== user.uid && (
                  <>
                    <button 
                      onClick={() => onMessage(selectedProfile.uid)}
                      className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all"
                      title="Message"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onOpenOptions(selectedProfile.uid)}
                      className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all"
                      title="User Options"
                    >
                      <Shield className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        if (user.friends?.includes(selectedProfile.uid)) {
                          onUnaddFriend(selectedProfile.uid);
                        } else {
                          onSendFriendRequest(selectedProfile.uid);
                        }
                      }}
                      className={cn(
                        "p-3 rounded-full backdrop-blur-md border transition-all hover:scale-110 active:scale-95",
                        user.friends?.includes(selectedProfile.uid)
                          ? "bg-red-500/20 border-red-500/50 text-red-500"
                          : (selectedProfile.friendRequests?.includes(user.uid) 
                              ? "bg-amber-500/20 border-amber-500/50 text-amber-500" 
                              : "bg-black/40 border-white/10 text-white/60 hover:text-white hover:bg-black/60")
                      )}
                      title={user.friends?.includes(selectedProfile.uid) ? "Unfriend" : (selectedProfile.friendRequests?.includes(user.uid) ? "Request Sent" : "Add Friend")}
                    >
                      {user.friends?.includes(selectedProfile.uid) ? <UserMinus className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    </button>
                  </>
                )}
                {selectedProfile.uid === user.uid && (
                  <button 
                    onClick={onEditProfile}
                    className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-10 pb-10 -mt-16 relative z-20">
              <div className="relative z-10">
                <div className="flex items-end justify-between mb-6">
                  <div 
                    className={cn(
                      "relative group",
                      selectedProfile.uid === user.uid && "cursor-pointer"
                    )}
                    onClick={() => selectedProfile.uid === user.uid && onPfpClick()}
                  >
                    <img 
                      src={selectedProfile.pfp || DEFAULT_PFP} 
                      className="w-32 h-32 rounded-full border-4 border-zinc-900 object-cover shadow-2xl transition-transform group-hover:scale-105 relative z-10"
                    />
                    {selectedProfile.uid === user.uid && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-zinc-900 rounded-full z-30" />
                  </div>
                
                <div className="flex items-center gap-4 mb-4">
                  {selectedProfile.uid !== user.uid && (
                    <button 
                      onClick={() => onRateProfile(selectedProfile.uid)}
                      className="px-6 py-2 rounded-2xl bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      Rate Profile
                    </button>
                  )}
                  <div className="text-center px-6 py-2 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-amber-500 font-black text-lg">{(selectedProfile.likes || []).length}</p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Likes</p>
                  </div>
                  <button 
                    onClick={() => onToggleLike(selectedProfile.uid)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all",
                      selectedProfile.likes?.includes(user.uid)
                        ? "bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                        : "bg-white/5 border-white/5 text-white/40 hover:text-red-500 hover:border-red-500/50"
                    )}
                  >
                    <Heart className={cn("w-6 h-6", selectedProfile.likes?.includes(user.uid) && "fill-current")} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-serif italic text-white flex items-center gap-3">
                    {selectedProfile.username}
                    <img 
                      src={selectedProfile.customRank?.icon || RANKS.find(r => r.id === (selectedProfile.rank || 'VIP'))?.icon} 
                      className="w-6 h-6 object-contain"
                      alt="rank"
                    />
                    {selectedProfile.uid === 'admin' && <Shield className="w-5 h-5 text-amber-500" />}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <img 
                        src={selectedProfile.customRank?.icon || RANKS.find(r => r.id === (selectedProfile.rank || 'VIP'))?.icon} 
                        className="w-3 h-3 object-contain"
                        alt=""
                      />
                      {selectedProfile.customRank?.name || RANKS.find(r => r.id === (selectedProfile.rank || 'VIP'))?.name}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest">
                      {selectedProfile.age} Years Old
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest">
                      {selectedProfile.gender}
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Biography</p>
                  <p className="text-white/80 text-sm leading-relaxed italic">
                    {selectedProfile.bio || "This user is too cool for a bio..."}
                  </p>
                </div>

                {/* Recent Visitors */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Recent Visitors</p>
                  <div className="flex -space-x-2 overflow-hidden">
                    {notifications
                      .filter(n => n.type === 'profile_view' && n.userId === selectedProfile.uid)
                      .slice(0, 5)
                      .map((n, i) => {
                        const visitor = allUsers.find(u => u.uid === n.senderId);
                        const pfp = n.senderPfp || visitor?.pfp || DEFAULT_PFP;
                        return (
                          <img 
                            key={i}
                            src={pfp} 
                            title={n.senderUsername}
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-zinc-900 object-cover" 
                          />
                        );
                      })}
                    {notifications.filter(n => n.type === 'profile_view' && n.userId === selectedProfile.uid).length === 0 && (
                      <p className="text-[10px] text-white/20 italic">No recent visitors</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{(selectedProfile.gold || 0).toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Gold</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Gem className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{(selectedProfile.rubies || 0).toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Rubies</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
