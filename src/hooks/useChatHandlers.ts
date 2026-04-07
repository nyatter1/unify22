import { supabase } from '../supabase';
import { UserProfile, Message, Theme, CardStyle } from '../types';
import { RANKS } from '../constants';
import { handleCommand, CommandContext } from '../utils/commandHandler';

export const useChatHandlers = (
  user: UserProfile,
  allUsers: UserProfile[],
  messages: Message[],
  notifications: any[],
  showToast: (msg: string) => void,
  // State Setters
  setters: {
    setSelectedProfile: (u: UserProfile | null) => void,
    setShowProfileModal: (s: boolean) => void,
    setShowNotifications: (s: boolean) => void,
    setShowThemeEditor: (s: boolean) => void,
    setShowCardEditor: (s: boolean) => void,
    setShowDailyReward: (s: boolean) => void,
    setEditTab: (t: any) => void,
    setShowEditProfile: (s: boolean) => void,
    setNewMessage: (m: string) => void,
    setCustomRankForm: (f: any) => void,
    setNewTheme: (t: any) => void,
    setNewCard: (c: any) => void,
    setSelectedUserForAdmin: (u: UserProfile | null) => void,
    setAdminAction: (a: 'mute' | 'unmute' | 'kick' | 'unkick' | 'ban' | 'unban') => void,
    setShowAdminModal: (s: boolean) => void,
  }
) => {
  const {
    setSelectedProfile, setShowProfileModal, setShowNotifications,
    setShowThemeEditor, setShowCardEditor, setShowDailyReward,
    setEditTab, setShowEditProfile, setNewMessage, setCustomRankForm,
    setNewTheme, setNewCard, setSelectedUserForAdmin, setAdminAction, setShowAdminModal
  } = setters;

  const sendFriendRequest = async (targetUid: string) => {
    if (user.uid === targetUid) return;
    if (user.friends?.includes(targetUid)) {
      showToast('Already friends!');
      return;
    }
    
    const targetUser = allUsers.find(u => u.uid === targetUid);
    if (targetUser?.friendRequests?.includes(user.uid)) {
      showToast('Request already sent!');
      return;
    }

    try {
      const targetUserRequests = targetUser?.friendRequests || [];
      await supabase.from('users').update({
        friendRequests: [...targetUserRequests, user.uid]
      }).eq('uid', targetUid);
      showToast('Friend request sent!');
    } catch (e) {
      console.error(e);
      showToast('Error sending request');
    }
  };

  const acceptFriendRequest = async (targetUid: string) => {
    try {
      const myFriends = [...(user.friends || []), targetUid];
      const myRequests = (user.friendRequests || []).filter(id => id !== targetUid);
      
      const targetUser = allUsers.find(u => u.uid === targetUid);
      const theirFriends = [...(targetUser?.friends || []), user.uid];

      await supabase.from('users').update({
        friends: myFriends,
        friendRequests: myRequests
      }).eq('uid', user.uid);
      
      await supabase.from('users').update({
        friends: theirFriends
      }).eq('uid', targetUid);
      
      showToast('Friend request accepted!');
    } catch (e) {
      console.error(e);
      showToast('Error accepting request');
    }
  };

  const declineFriendRequest = async (targetUid: string) => {
    try {
      const myRequests = (user.friendRequests || []).filter(id => id !== targetUid);
      await supabase.from('users').update({
        friendRequests: myRequests
      }).eq('uid', user.uid);
      showToast('Friend request declined');
    } catch (e) {
      console.error(e);
    }
  };

  const unaddFriend = async (targetUid: string) => {
    try {
      const myFriends = (user.friends || []).filter(id => id !== targetUid);
      const targetUser = allUsers.find(u => u.uid === targetUid);
      const theirFriends = (targetUser?.friends || []).filter(id => id !== user.uid);

      await supabase.from('users').update({
        friends: myFriends
      }).eq('uid', user.uid);
      
      await supabase.from('users').update({
        friends: theirFriends
      }).eq('uid', targetUid);
      
      showToast('Friend removed');
    } catch (e) {
      console.error(e);
    }
  };

  const updateCustomization = async (field: string, value: any) => {
    try {
      await supabase.from('users').update({ [field]: value }).eq('uid', user.uid);
    } catch (err) {
      console.error(err);
      showToast(`Failed to update ${field}`);
    }
  };

  const viewProfile = async (uid: string) => {
    try {
      const { data } = await supabase.from('users').select('*').eq('uid', uid);
      if (data && data.length > 0) {
        setSelectedProfile(data[0] as UserProfile);
        setShowProfileModal(true);
        
        if (uid !== user.uid) {
          await supabase.from('notifications').insert({
            userId: uid,
            senderId: user.uid,
            senderUsername: user.username,
            senderPfp: user.pfp,
            type: 'profile_view',
            read: false,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load profile');
    }
  };

  const handleOpenNotifications = async () => {
    setShowNotifications(true);
    const unreadNotifs = notifications.filter(n => !n.read);
    if (unreadNotifs.length > 0) {
      for (const n of unreadNotifs) {
        await supabase.from('notifications').update({ read: true }).eq('id', n.id);
      }
    }
  };

  const handleVote = async (messageId: string, optionIndex: number) => {
    const msg = messages.find(m => m.id === messageId);
    if (!msg || !msg.pollData) return;
    
    const hasVoted = msg.pollData.options.some(o => o.voters?.includes(user.uid));
    if (hasVoted) return;

    const newOptions = [...msg.pollData.options];
    const option = { ...newOptions[optionIndex] };
    option.votes += 1;
    option.voters = [...(option.voters || []), user.uid];
    newOptions[optionIndex] = option;

    try {
      await supabase.from('messages').update({
        'pollData': { ...msg.pollData, options: newOptions }
      }).eq('id', messageId);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (targetUid: string, selectedProfile: UserProfile | null) => {
    if (!user.uid) return;
    try {
      const isLiked = selectedProfile?.likes?.includes(user.uid);
      
      const newLikes = isLiked 
        ? (selectedProfile?.likes || []).filter(id => id !== user.uid)
        : [...(selectedProfile?.likes || []), user.uid];

      await supabase.from('users').update({ likes: newLikes }).eq('uid', targetUid);
      setSelectedProfile(selectedProfile ? { ...selectedProfile, likes: newLikes } : null);
      showToast(isLiked ? 'Unliked profile' : 'Liked profile!');

      if (!isLiked && targetUid !== user.uid) {
        await supabase.from('notifications').insert({
          userId: targetUid,
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          type: 'profile_like',
          read: false,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to toggle like');
    }
  };

  const handleBroadcast = async (msg: string) => {
    if (!msg.trim()) return;
    try {
      await supabase.from('messages').insert({
        senderId: 'SYSTEM',
        senderUsername: 'SYSTEM',
        senderPfp: 'https://cdn-icons-png.flaticon.com/512/1786/1786631.png',
        content: msg,
        timestamp: new Date().toISOString(),
        type: 'broadcast'
      });
      showToast('Broadcast sent!');
    } catch (err) {
      console.error(err);
      showToast('Failed to send broadcast');
    }
  };

  const handleGiveGold = async (uid: string, amount: number) => {
    if (!uid) return;
    try {
      const { data } = await supabase.from('users').select('gold').eq('uid', uid).single();
      await supabase.from('users').update({ gold: (data?.gold || 0) + amount }).eq('uid', uid);
      showToast(`Gave ${amount} gold to user`);
    } catch (err) {
      console.error(err);
      showToast('Failed to give gold');
    }
  };

  const handleGiveRubies = async (uid: string, amount: number) => {
    if (!uid) return;
    try {
      const { data } = await supabase.from('users').select('rubies').eq('uid', uid).single();
      await supabase.from('users').update({ rubies: (data?.rubies || 0) + amount }).eq('uid', uid);
      showToast(`Gave ${amount} rubies to user`);
    } catch (err) {
      console.error(err);
      showToast('Failed to give rubies');
    }
  };

  const handleSendMessage = async (
    e: React.FormEvent,
    newMessage: string,
    triviaState: {
      triviaActive: boolean,
      triviaQuestion: { q: string, a: string } | null,
      setTriviaActive: (a: boolean) => void,
      setTriviaQuestion: (q: any) => void,
      soundEnabled: boolean,
      scrollRef: React.RefObject<HTMLDivElement>
    }
  ) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { triviaActive, triviaQuestion, setTriviaActive, setTriviaQuestion, soundEnabled, scrollRef } = triviaState;

    const now = new Date();
    if (user.bannedUntil && new Date(user.bannedUntil) > now) {
      showToast('You are banned and cannot send messages.');
      return;
    }
    if (user.kickedUntil && new Date(user.kickedUntil) > now) {
      showToast('You have been kicked and cannot send messages.');
      return;
    }
    if (user.mutedUntil && new Date(user.mutedUntil) > now) {
      showToast('You are muted and cannot send messages.');
      return;
    }

    const text = newMessage.trim();
    setNewMessage('');

    if (text.startsWith('/')) {
      const parts = text.split(' ');
      const command = parts[0].toLowerCase();

      const context: CommandContext = {
        user,
        allUsers,
        showToast,
        setters: {
          setSelectedProfile, setShowProfileModal, setShowNotifications,
          setShowThemeEditor, setShowCardEditor, setShowDailyReward,
          setEditTab, setShowEditProfile, setNewMessage, setCustomRankForm,
          setNewTheme, setNewCard, setSelectedUserForAdmin, setAdminAction, setShowAdminModal
        },
        triviaState: {
          triviaActive: triviaState.triviaActive,
          triviaQuestion: triviaState.triviaQuestion,
          setTriviaActive: triviaState.setTriviaActive,
          setTriviaQuestion: triviaState.setTriviaQuestion
        }
      };
      await handleCommand(command, parts, context);
      return;
    }

    if (triviaActive && triviaQuestion) {
      if (text.toLowerCase() === triviaQuestion.a) {
        setTriviaActive(false);
        setTriviaQuestion(null);
        
        const { data: currentUser } = await supabase.from('users').select('gold').eq('uid', user.uid).single();
        const currentGold = currentUser?.gold || 0;
        await supabase.from('users').update({ gold: currentGold + 50 }).eq('uid', user.uid);
        
        await supabase.from('messages').insert({
          senderId: null,
          senderUsername: 'System',
          senderPfp: 'https://cdn-icons-png.flaticon.com/512/1786/1786631.png',
          text: `🎉 ${user.username} answered correctly and won 50 Gold!\n\nAnswer: ${triviaQuestion.a}`,
          type: 'system',
          timestamp: new Date().toISOString(),
        });
        return;
      }
    }

    try {
      const currentXp = user.xp || 0;
      const currentLevel = user.level || 1;
      const xpGained = Math.floor(Math.random() * 10) + 5;
      const newXp = currentXp + xpGained;
      const xpNeeded = currentLevel * 100;
      
      let newLevel = currentLevel;
      if (newXp >= xpNeeded) {
        newLevel++;
        showToast(`🎉 Level Up! You are now level ${newLevel}!`);
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3');
        audio.play().catch(() => {});
      }

      await supabase.from('users').update({
        xp: newLevel > currentLevel ? newXp - xpNeeded : newXp,
        level: newLevel
      }).eq('uid', user.uid);

      const lowerText = text.toLowerCase();
      if (lowerText.includes('congrats') || lowerText.includes('congratulations')) {
         // confetti({
         //   particleCount: 100,
         //   spread: 70,
         //   origin: { y: 0.6 }
         // });
         showToast('🎉 CONGRATULATIONS! 🎉');
      } else if (lowerText.includes('happy birthday')) {
         // confetti({
         //   particleCount: 150,
         //   spread: 100,
         //   origin: { y: 0.6 },
         //   colors: ['#FFC0CB', '#FF69B4', '#FF1493']
         // });
         showToast('🎂 HAPPY BIRTHDAY! 🎈');
      } else if (lowerText.includes('stonks')) {
         showToast('📈 STONKS GO UP! 🚀');
      }

      const sendAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
      sendAudio.volume = 0.5;
      sendAudio.play().catch(() => {});

      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        senderRank: user.rank || 'VIP',
        text,
        type: 'text',
        timestamp: new Date().toISOString(),
      });

      const mentionRegex = /@([a-zA-Z0-9_]+)/g;
      const mentions = [...text.matchAll(mentionRegex)].map(m => m[1]);
      
      if (mentions.length > 0) {
        mentions.forEach(async (mentionedUsername) => {
          const targetUser = allUsers.find(u => u.username.toLowerCase() === mentionedUsername.toLowerCase());
          if (targetUser && targetUser.uid !== user.uid) {
            await supabase.from('notifications').insert({
              userId: targetUser.uid,
              senderId: user.uid,
              senderUsername: user.username,
              senderPfp: user.pfp,
              type: 'mention',
              read: false,
              timestamp: new Date().toISOString()
            });
          }
        });
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to send message');
    }
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleFileUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>, field: 'pfp' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      showToast('File too large! Max 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateCustomization(field, base64String);
      showToast(`${field.toUpperCase()} updated!`);
    };
    reader.readAsDataURL(file);
  };

  const handleRankIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, customRankForm: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      showToast('File too large! Max 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setCustomRankForm({ ...customRankForm, icon: base64String });
      showToast('Rank icon uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const saveCustomRank = async (customRankForm: any) => {
    if (!customRankForm.name || !customRankForm.icon) {
      showToast('Name and icon are required for a custom rank');
      return;
    }

    try {
      await supabase.from('users').update({
        customRank: customRankForm
      }).eq('uid', user.uid);
      showToast('Custom rank saved!');
      setEditTab('main');
    } catch (err) {
      console.error(err);
      showToast('Failed to save custom rank');
    }
  };

  const resetCustomRank = async () => {
    try {
      await supabase.from('users').update({
        customRank: null
      }).eq('uid', user.uid);
      window.location.reload();
    } catch (err) {
      console.error(err);
      showToast('Failed to reset custom rank');
    }
  };

  const saveCustomTheme = async (newTheme: Partial<Theme>) => {
    if (!newTheme.name) return showToast('Theme name is required');
    const themeId = `custom-${Date.now()}`;
    const theme = { ...newTheme, id: themeId } as Theme;
    
    try {
      await supabase.from('users').update({
        customThemes: [...(user.customThemes || []), theme],
        theme: themeId
      }).eq('uid', user.uid);
      setShowThemeEditor(false);
      showToast('Custom theme saved!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save theme');
    }
  };

  const saveCustomCard = async (newCard: Partial<CardStyle>) => {
    if (!newCard.name) return showToast('Card name is required');
    const cardId = `custom-card-${Date.now()}`;
    const card = { ...newCard, id: cardId } as CardStyle;
    
    try {
      await supabase.from('users').update({
        customCardStyles: [...(user.customCardStyles || []), card],
        cardStyle: cardId
      }).eq('uid', user.uid);
      setShowCardEditor(false);
      showToast('Custom card saved!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save card');
    }
  };

  return {
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
  };
};
