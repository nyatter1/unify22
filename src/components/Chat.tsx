import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { UserProfile, Message, Theme, CardStyle, UserRank, Border, ProfileEffect } from '../types';
import { THEMES, CARD_STYLES, AVATARS, BANNERS, RANKS, RankInfo, BORDERS, PROFILE_EFFECTS, DEFAULT_PFP, DEFAULT_BANNER } from '../constants';
import { 
  Send, 
  LogOut, 
  Users, 
  Infinity, 
  Circle, 
  Shield, 
  Crown, 
  Wallet, 
  Gem, 
  Coins, 
  AlertCircle, 
  Dice1, 
  Dice2, 
  Dice3, 
  Dice4, 
  Dice5, 
  Dice6, 
  Palette, 
  X, 
  Check, 
  Edit3, 
  Heart, 
  User, 
  UserPlus,
  UserMinus,
  Image, 
  Camera, 
  ChevronRight,
  Search,
  ArrowUp,
  Star,
  Bell,
  Newspaper,
  RefreshCw,
  BookOpen,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ShieldAlert,
  Gift,
  Zap,
  Award,
  Smile,
  Terminal,
  Trash2,
  BarChart2,
  Youtube,
  Menu,
  Pin,
  PinOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from '@google/genai';
import confetti from 'canvas-confetti';
import Markdown from 'react-markdown';

// Custom Hooks
import { useChatData } from '../hooks/useChatData';
import { useUserStatus } from '../hooks/useUserStatus';
import { useChatHandlers } from '../hooks/useChatHandlers';

import { getCardStyles } from '../utils/cardStyles';

// Component Imports
import { Header } from './chat/Header';
import { LeftSidebar } from './chat/LeftSidebar';
import { UserList } from './chat/UserList';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { MobileNav } from './chat/MobileNav';

// Modal Imports
import { PollModal } from './PollModal';
import { CustomizerModal } from './chat/Modals/CustomizerModal';
import { ProfileModal } from './chat/Modals/ProfileModal';
import { DailyRewardModal } from './chat/Modals/DailyRewardModal';
import { FriendRequestsModal } from './chat/Modals/FriendRequestsModal';
import { NotificationsModal } from './chat/Modals/NotificationsModal';
import { StatusEditorModal } from './chat/Modals/StatusEditorModal';
import { ThemeEditorModal } from './chat/Modals/ThemeEditorModal';
import { CardEditorModal } from './chat/Modals/CardEditorModal';
import { EditProfileModal } from './chat/Modals/EditProfileModal';
import { NewsModal } from './chat/Modals/NewsModal';
import { UpdatesModal } from './chat/Modals/UpdatesModal';
import { RulesModal } from './chat/Modals/RulesModal';
import { AdminPanelModal } from './chat/Modals/AdminPanelModal';

// Existing Shared Modals
import { UserOptions } from './UserOptions';
import { RatingModal } from './RatingModal';
import { ForceSpeakModal } from './ForceSpeakModal';
import { AdminModal } from './AdminModal';
import { DeveloperConsole } from './DeveloperConsole';
import { RatingsList } from './RatingsList';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface ChatProps {
  user: UserProfile;
}

const DiceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function Chat({ user }: ChatProps) {
  const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showWallet, setShowWallet] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showThemeEditor, setShowThemeEditor] = useState(false);
  const [showCardEditor, setShowCardEditor] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showForceSpeakModal, setShowForceSpeakModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showStatusEditor, setShowStatusEditor] = useState(false);
  const [newStatus, setNewStatus] = useState(user.status || '');
  const [showRatingsList, setShowRatingsList] = useState(false);
  const [selectedUserForOptions, setSelectedUserForOptions] = useState<UserProfile | null>(null);
  const [selectedUserForRating, setSelectedUserForRating] = useState<UserProfile | null>(null);
  const [selectedUserForForceSpeak, setSelectedUserForForceSpeak] = useState<UserProfile | null>(null);
  const [selectedUserForAdmin, setSelectedUserForAdmin] = useState<UserProfile | null>(null);
  const [selectedUserForRatingsList, setSelectedUserForRatingsList] = useState<UserProfile | null>(null);
  const [adminAction, setAdminAction] = useState<'mute' | 'kick' | 'ban' | 'unmute' | 'unkick' | 'unban'>('mute');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarView, setSidebarView] = useState<'default' | 'search' | 'friends' | 'staff'>('default');
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [isLeftSidebarPinned, setIsLeftSidebarPinned] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [editTab, setEditTab] = useState<'username' | 'info' | 'bio' | 'pfp' | 'banner' | 'main' | 'rank' | 'youtube'>('main');
  const [customizerTab, setCustomizerTab] = useState<'themes' | 'cards' | 'borders' | 'effects'>('themes');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [userSort, setUserSort] = useState<'lastOnline' | 'highestRank' | 'lastOffline' | 'newest' | 'lastSeen'>('highestRank');
  const [showFriendsOnly, setShowFriendsOnly] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [triviaActive, setTriviaActive] = useState(false);
  const [triviaQuestion, setTriviaQuestion] = useState<{q: string, a: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pfpInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [newTheme, setNewTheme] = useState<Partial<Theme>>({
    name: '',
    background: '#000000',
    textColor: 'text-white',
    accentColor: 'white',
    category: 'Custom',
    isCustom: true,
    customStyles: {
      gradient: '',
      pattern: 'none',
      fontFamily: 'sans',
      glassmorphism: 0,
      bubbleStyle: 'rounded'
    }
  });

  const [newCard, setNewCard] = useState<Partial<CardStyle>>({
    name: '',
    category: 'Custom',
    bgClass: '',
    borderClass: '',
    textClass: '',
    isCustom: true,
    customStyles: {
      background: '#0a0a0a',
      border: '#ffffff20',
      textColor: '#ffffff',
      effect: 'none',
      badgeIcon: '',
      title: '',
      titleColor: '#ffffff',
      fontFamily: 'sans'
    }
  });

  const [customRankForm, setCustomRankForm] = useState({
    name: user.customRank?.name || '',
    icon: user.customRank?.icon || ''
  });
  const customRankInputRef = useRef<HTMLInputElement>(null);

  // Custom Hooks
  const {
    messages, setMessages,
    allUsers, setAllUsers,
    notifications, setNotifications,
    newsPosts, setNewsPosts,
    appUpdates, setAppUpdates,
    unreadNotifications, setUnreadNotifications
  } = useChatData(user, soundEnabled);

  useUserStatus(user, allUsers);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    unaddFriend,
    updateCustomization,
    viewProfile,
    handleOpenNotifications,
    handleVote,
    toggleLike,
    handleBroadcast,
    handleGiveGold,
    handleGiveRubies,
    handleSendMessage,
    handleFileUpload: handleFileUploadHandler,
    handleRankIconUpload,
    saveCustomRank,
    resetCustomRank,
    saveCustomTheme,
    saveCustomCard
  } = useChatHandlers(
    user, allUsers, messages, notifications, showToast,
    {
      setSelectedProfile, setShowProfileModal, setShowNotifications,
      setShowThemeEditor, setShowCardEditor, setShowDailyReward,
      setEditTab, setShowEditProfile, setNewMessage, setCustomRankForm,
      setNewTheme, setNewCard, setSelectedUserForAdmin, setAdminAction, setShowAdminModal
    }
  );

  const allThemes = [...THEMES, ...(user.customThemes || [])];
  const allCardStyles = [...CARD_STYLES, ...(user.customCardStyles || [])];
  
  const currentTheme = allThemes.find(t => t.id === user.theme) || THEMES[0];

  const filteredUsers = allUsers
    .filter(u => {
      const matchesSearch = u.username.toLowerCase().includes(userSearch.toLowerCase());
      const matchesFriends = !showFriendsOnly || user.friends?.includes(u.uid);
      return matchesSearch && matchesFriends;
    })
    .sort((a, b) => {
      // Current user always first
      if (a.uid === user.uid) return -1;
      if (b.uid === user.uid) return 1;

      const priorityA = RANKS.find(r => r.id === a.rank)?.priority || 0;
      const priorityB = RANKS.find(r => r.id === b.rank)?.priority || 0;

      if (userSort === 'highestRank') {
        if (priorityA !== priorityB) return priorityB - priorityA;
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
        const timeA = a.lastSeen?.toMillis ? a.lastSeen.toMillis() : 0;
        const timeB = b.lastSeen?.toMillis ? b.lastSeen.toMillis() : 0;
        if (timeA !== timeB) return timeB - timeA;
        return a.username.localeCompare(b.username);
      }

      if (userSort === 'lastOnline') {
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
        const timeA = a.lastSeen?.toMillis ? a.lastSeen.toMillis() : 0;
        const timeB = b.lastSeen?.toMillis ? b.lastSeen.toMillis() : 0;
        if (timeA !== timeB) return timeB - timeA;
        return priorityB - priorityA;
      }

      if (userSort === 'lastOffline') {
        if (a.isOnline !== b.isOnline) return a.isOnline ? 1 : -1;
        const timeA = a.lastSeen?.toMillis ? a.lastSeen.toMillis() : 0;
        const timeB = b.lastSeen?.toMillis ? b.lastSeen.toMillis() : 0;
        if (timeA !== timeB) return timeB - timeA;
        return priorityB - priorityA;
      }

      if (userSort === 'newest') {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        if (timeA !== timeB) return timeB - timeA;
        return priorityB - priorityA;
      }

      return priorityB - priorityA;
    });

  const onlineCount = allUsers.filter(u => u.isOnline).length;
  const handleProfileClick = (uid: string) => {
    const user = allUsers.find(u => u.uid === uid);
    if (user) {
      setSelectedProfile(user);
      setShowProfileModal(true);
    }
  };

  const offlineCount = allUsers.length - onlineCount;

  const handleSendMessageWrapper = async (e: React.FormEvent) => {
    await handleSendMessage(e, newMessage, {
      triviaActive,
      triviaQuestion,
      setTriviaActive,
      setTriviaQuestion,
      soundEnabled,
      scrollRef
    });
  };

  return (
    <div 
      className={cn("h-screen flex flex-col overflow-hidden font-sans relative transition-all duration-500", currentTheme.textColor)}
      style={{ 
        background: currentTheme.background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: currentTheme.customStyles?.borderStyle || 'none',
        cursor: 'auto'
      }}
    >
      {/* Theme Overlay */}
      {currentTheme.background.startsWith('http') && <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-400/20"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-xs">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Header 
        user={user}
        currentTheme={currentTheme}
        showFriendsOnly={showFriendsOnly}
        setShowFriendsOnly={setShowFriendsOnly}
        setShowSidebar={setShowSidebar}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        <LeftSidebar 
          user={user}
          isLeftSidebarPinned={isLeftSidebarPinned}
          setIsLeftSidebarPinned={setIsLeftSidebarPinned}
          showLeftSidebar={showLeftSidebar}
          setShowLeftSidebar={setShowLeftSidebar}
          setShowDailyReward={setShowDailyReward}
          setShowFriendRequests={setShowFriendRequests}
          setShowCustomizer={setShowCustomizer}
          handleOpenNotifications={handleOpenNotifications}
          setShowNews={setShowNews}
          setShowUpdates={setShowUpdates}
          setShowRules={setShowRules}
          setShowAdminPanel={setShowAdminPanel}
          unreadNotifications={unreadNotifications}
          currentTheme={currentTheme}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0 overflow-x-hidden">
          <MessageList 
            messages={messages}
            user={user}
            allUsers={allUsers}
            currentTheme={currentTheme}
            handleProfileClick={handleProfileClick}
            handleVote={handleVote}
            scrollRef={scrollRef}
            DiceIcons={DiceIcons}
          />

          <ChatInput 
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessageWrapper}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            setShowPollModal={setShowPollModal}
          />
        </div>

        <UserList 
          user={user}
          allUsers={allUsers}
          onlineCount={onlineCount}
          offlineCount={offlineCount}
          sidebarView={sidebarView}
          setSidebarView={setSidebarView}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          userSort={userSort}
          setUserSort={setUserSort}
          filteredUsers={filteredUsers}
          handleProfileClick={handleProfileClick}
          setShowSidebar={setShowSidebar}
          setShowStatusEditor={setShowStatusEditor}
          getCardStyles={getCardStyles}
          showSidebar={showSidebar}
          currentTheme={currentTheme}
        />
      </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav 
          setShowDailyReward={setShowDailyReward}
          setShowCustomizer={setShowCustomizer}
          handleOpenNotifications={handleOpenNotifications}
          setShowNews={setShowNews}
          setShowSidebar={setShowSidebar}
          unreadNotifications={unreadNotifications}
        />

      {/* Customization Modals */}
      <CustomizerModal
        showCustomizer={showCustomizer}
        setShowCustomizer={setShowCustomizer}
        user={user}
        allThemes={allThemes}
        allCardStyles={allCardStyles}
        currentTheme={currentTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        customizerTab={customizerTab}
        setCustomizerTab={setCustomizerTab}
        updateCustomization={updateCustomization}
        setShowThemeEditor={setShowThemeEditor}
        setShowCardEditor={setShowCardEditor}
        getCardStyles={getCardStyles}
        DEFAULT_PFP={DEFAULT_PFP}
      />

      <ThemeEditorModal
        showThemeEditor={showThemeEditor}
        setShowThemeEditor={setShowThemeEditor}
        customThemeInput={newTheme}
        setCustomThemeInput={setNewTheme}
        saveCustomTheme={() => saveCustomTheme(newTheme)}
      />

      <CardEditorModal
        showCardEditor={showCardEditor}
        setShowCardEditor={setShowCardEditor}
        user={user}
        customCardInput={newCard}
        setCustomCardInput={setNewCard}
        saveCustomCard={() => saveCustomCard(newCard)}
      />
        setNewCard={setNewCard}
        onSave={saveCustomCard}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        selectedProfile={selectedProfile}
        user={user}
        currentTheme={currentTheme}
        allUsers={allUsers}
        notifications={notifications}
        onEditProfile={() => {
          setEditTab('main');
          setShowEditProfile(true);
        }}
        onSendFriendRequest={sendFriendRequest}
        onUnaddFriend={unaddFriend}
        onToggleLike={(uid) => toggleLike(uid, selectedProfile)}
        onBannerClick={() => bannerInputRef.current?.click()}
        onPfpClick={() => pfpInputRef.current?.click()}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        showEditProfile={showEditProfile}
        setShowEditProfile={setShowEditProfile}
        user={user}
        editTab={editTab}
        setEditTab={setEditTab}
        updateCustomization={updateCustomization}
        pfpInputRef={pfpInputRef}
        bannerInputRef={bannerInputRef}
        customRankInputRef={customRankInputRef}
        customRankForm={customRankForm}
        setCustomRankForm={setCustomRankForm}
        handleRankIconUpload={(e) => handleRankIconUpload(e, customRankForm)}
        saveCustomRank={() => saveCustomRank(customRankForm)}
        resetCustomRank={resetCustomRank}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        currentTheme={currentTheme}
      />

      {/* Friend Requests Modal */}
      <FriendRequestsModal
        isOpen={showFriendRequests}
        onClose={() => setShowFriendRequests(false)}
        user={user}
        allUsers={allUsers}
        currentTheme={currentTheme}
        onAccept={acceptFriendRequest}
        onDecline={declineFriendRequest}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        currentTheme={currentTheme}
      />

      {/* Updates Modal */}
      <UpdatesModal
        isOpen={showUpdates}
        onClose={() => setShowUpdates(false)}
        user={user}
        appUpdates={appUpdates}
        currentTheme={currentTheme}
      />

      {/* News Modal */}
      <NewsModal
        isOpen={showNews}
        onClose={() => setShowNews(false)}
        user={user}
        newsPosts={newsPosts}
        allUsers={allUsers}
        currentTheme={currentTheme}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        showAdminPanel={showAdminPanel}
        setShowAdminPanel={setShowAdminPanel}
        allUsers={allUsers}
        handleBroadcast={handleBroadcast}
        handleGiveGold={handleGiveGold}
        handleGiveRubies={handleGiveRubies}
      />

      {/* Daily Reward Modal */}
      <DailyRewardModal
        isOpen={showDailyReward}
        onClose={() => setShowDailyReward(false)}
        user={user}
        currentTheme={currentTheme}
        showToast={showToast}
      />


      {selectedUserForOptions && (
        <UserOptions 
          targetUser={selectedUserForOptions}
          currentUser={user}
          onClose={() => setSelectedUserForOptions(null)}
          onViewProfile={viewProfile}
          onRateProfile={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForRating(targetUser);
              setShowRatingModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onForceSpeak={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForForceSpeak(targetUser);
              setShowForceSpeakModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onMute={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForAdmin(targetUser);
              setAdminAction('mute');
              setShowAdminModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onUnmute={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForAdmin(targetUser);
              setAdminAction('unmute');
              setShowAdminModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onKick={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForAdmin(targetUser);
              setAdminAction('kick');
              setShowAdminModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onUnkick={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForAdmin(targetUser);
              setAdminAction('unkick');
              setShowAdminModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onBan={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForAdmin(targetUser);
              setAdminAction('ban');
              setShowAdminModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onUnban={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForAdmin(targetUser);
              setAdminAction('unban');
              setShowAdminModal(true);
            }
            setSelectedUserForOptions(null);
          }}
          onChangeRank={async (uid, rankId, isCustom) => {
            try {
              if (isCustom) {
                const { data: ranks } = await supabase.from('ranks').select('*');
                const customRank = ranks?.find((d: any) => d.id === rankId);
                if (customRank) {
                  await supabase.from('users').update({ rank: rankId, customRank: { name: customRank.name, icon: customRank.icon } }).eq('uid', uid);
                }
              } else {
                await supabase.from('users').update({ rank: rankId, customRank: null }).eq('uid', uid);
              }
            } catch (e) {
              console.error(e);
            }
            setSelectedUserForOptions(null);
          }}
          onViewRatings={(uid) => {
            const targetUser = allUsers.find(u => u.uid === uid);
            if (targetUser) {
              setSelectedUserForRatingsList(targetUser);
              setShowRatingsList(true);
            }
            setSelectedUserForOptions(null);
          }}
        />
      )}

      {showRatingModal && selectedUserForRating && (
        <RatingModal
          targetUid={selectedUserForRating.uid}
          targetUsername={selectedUserForRating.username}
          currentUser={user}
          onClose={() => setShowRatingModal(false)}
        />
      )}

      {showForceSpeakModal && selectedUserForForceSpeak && (
        <ForceSpeakModal
          targetUid={selectedUserForForceSpeak.uid}
          targetUsername={selectedUserForForceSpeak.username}
          targetPfp={selectedUserForForceSpeak.pfp}
          onClose={() => setShowForceSpeakModal(false)}
        />
      )}
      {showAdminModal && selectedUserForAdmin && (
        <AdminModal
          targetUid={selectedUserForAdmin.uid}
          targetUsername={selectedUserForAdmin.username}
          action={adminAction}
          onClose={() => setShowAdminModal(false)}
        />
      )}

      {showPollModal && (
        <PollModal
          currentUser={user}
          onClose={() => setShowPollModal(false)}
        />
      )}

      {showRatingsList && selectedUserForRatingsList && (
        <RatingsList
          targetUid={selectedUserForRatingsList.uid}
          currentUserUid={user.uid}
          onClose={() => setShowRatingsList(false)}
        />
      )}

      {/* Status Editor Modal */}
      <StatusEditorModal
        isOpen={showStatusEditor}
        onClose={() => setShowStatusEditor(false)}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        user={user}
        showToast={showToast}
      />
    </div>
  );
}
