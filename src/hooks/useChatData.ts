import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { UserProfile, Message } from '../types';

export const useChatData = (user: UserProfile, soundEnabled: boolean) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newsPosts, setNewsPosts] = useState<any[]>([]);
  const [appUpdates, setAppUpdates] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const [privateMessages, setPrivateMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchPrivateMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .not('recipientId', 'is', null)
        .or(`senderId.eq.${user.uid},recipientId.eq.${user.uid}`)
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (data) {
        setPrivateMessages(data.reverse() as Message[]);
      }
    };

    fetchPrivateMessages();

    const pmSubscription = supabase
      .channel('chat-pms-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `recipientId=eq.${user.uid}` }, fetchPrivateMessages)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `senderId=eq.${user.uid}` }, fetchPrivateMessages)
      .subscribe();

    return () => {
      supabase.removeChannel(pmSubscription);
    };
  }, [user.uid]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('userId', user.uid)
        .order('timestamp', { ascending: false })
        .limit(20);
      
      if (data) {
        setNotifications(data);
        setUnreadNotifications(data.filter(n => !n.read).length);
      }
    };

    fetchNotifications();

    const notifSubscription = supabase
      .channel('chat-notifications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `userId=eq.${user.uid}` }, fetchNotifications)
      .subscribe();

    return () => {
      supabase.removeChannel(notifSubscription);
    };
  }, [user.uid]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);
      if (data) setNewsPosts(data);
    };

    fetchNews();

    const newsSubscription = supabase
      .channel('chat-news-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, fetchNews)
      .subscribe();

    return () => {
      supabase.removeChannel(newsSubscription);
    };
  }, []);

  useEffect(() => {
    const fetchUpdates = async () => {
      const { data } = await supabase
        .from('updates')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);
      if (data) setAppUpdates(data);
    };

    fetchUpdates();

    const updatesSubscription = supabase
      .channel('chat-updates-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'updates' }, fetchUpdates)
      .subscribe();

    return () => {
      supabase.removeChannel(updatesSubscription);
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('id, senderId, senderUsername, senderPfp, senderRank, text, imageUrl, type, timestamp, pollData, recipientId')
        .is('recipientId', null)
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (data) {
        const newMsgs = data.reverse() as Message[];
        setMessages(newMsgs);
      }
    };

    fetchMessages();

    const messagesSubscription = supabase
      .channel('chat-messages-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'recipientId=is.null' }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => {
          const exists = prev.some(m => m.id === newMessage.id);
          if (exists) return prev;
          
          if (newMessage.senderId !== user.uid && soundEnabled) {
            const receiveAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
            receiveAudio.volume = 0.5;
            receiveAudio.play().catch(() => {});
          }

          const updated = [...prev, newMessage];
          return updated.slice(-50); // Keep only last 50
        });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m));
      })
      .subscribe();

    const fetchAllUsers = async () => {
      const { data } = await supabase
        .from('users')
        .select('uid, username, pfp, rank, isOnline, status, lastSeen, friends, friendRequests, xp, level, gold, rubies, theme, cardStyle, customThemes, customCardStyles, customRank, bannedUntil, mutedUntil, kickedUntil');
      if (data) {
        setAllUsers(data as UserProfile[]);
      }
    };

    fetchAllUsers();

    const usersSubscription = supabase
      .channel('chat-users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchAllUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
      supabase.removeChannel(usersSubscription);
    };
  }, [user.uid, soundEnabled]);

  return {
    messages,
    setMessages,
    allUsers,
    setAllUsers,
    notifications,
    setNotifications,
    newsPosts,
    setNewsPosts,
    appUpdates,
    setAppUpdates,
    unreadNotifications,
    setUnreadNotifications,
    privateMessages,
    setPrivateMessages
  };
};
