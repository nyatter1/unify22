import { useEffect } from 'react';
import { supabase } from '../supabase';
import { UserProfile, UserRank } from '../types';
import { RANKS } from '../constants';

export const useUserStatus = (user: UserProfile, allUsers: UserProfile[]) => {
  useEffect(() => {
    const fixBalances = async () => {
      const updates: any = {};
      let needsUpdate = false;

      if (isNaN(user.gold)) {
        updates.gold = 1000;
        needsUpdate = true;
      }
      if (isNaN(user.rubies)) {
        updates.rubies = 1000;
        needsUpdate = true;
      }

      if (!user.hasReceivedReset && (user.gold === 0 && user.rubies === 0)) {
        updates.gold = 1000;
        updates.rubies = 10;
        updates.hasReceivedReset = true;
        needsUpdate = true;
      }

      if (!user.rank) {
        updates.rank = 'VIP';
        needsUpdate = true;
      }

      if (needsUpdate) {
        await supabase.from('users').update(updates).eq('uid', user.uid);
      }
    };

    fixBalances();
  }, [user.gold, user.rubies, user.hasReceivedReset, user.uid, user.rank]);

  useEffect(() => {
    const updateOnlineStatus = async (online: boolean) => {
      try {
        await supabase.from('users').update({
          isOnline: online,
          lastSeen: new Date().toISOString()
        }).eq('uid', user.uid);
      } catch (error) {
        console.error("Error updating online status:", error);
      }
    };

    const handleVisibilityChange = () => {
      updateOnlineStatus(document.visibilityState === 'visible');
    };

    const handleBeforeUnload = () => {
      updateOnlineStatus(false);
    };

    updateOnlineStatus(true);

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    let activityTimeout: any;
    const resetActivity = () => {
      clearTimeout(activityTimeout);
      updateOnlineStatus(true);
      activityTimeout = setTimeout(() => {
        updateOnlineStatus(false);
      }, 300000);
    };

    window.addEventListener('mousedown', resetActivity);
    window.addEventListener('keydown', resetActivity);
    window.addEventListener('scroll', resetActivity);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('mousedown', resetActivity);
      window.removeEventListener('keydown', resetActivity);
      window.removeEventListener('scroll', resetActivity);
      updateOnlineStatus(false);
    };
  }, [user.uid]);

  useEffect(() => {
    const checkRanks = async () => {
      const devEmails = ['test@gmail.com', 'dev@gmail.com', 'developer@gmail.com', 'haydensixseven@gmail.com'];
      if (devEmails.includes(user.email.toLowerCase()) && user.rank !== 'DEVELOPER') {
        await supabase.from('users').update({ rank: 'DEVELOPER' }).eq('uid', user.uid);
        return;
      }

      const standardRanks: UserRank[] = ['VIP', 'SUPER_VIP', 'ELITE', 'MILLIONAIRE', 'MANTIS', 'TIGER'];
      if (!standardRanks.includes(user.rank as UserRank)) return;

      let newRank: UserRank = 'VIP';
      
      const sortedByGold = [...allUsers].sort((a, b) => (b.gold || 0) - (a.gold || 0));
      const top3Gold = sortedByGold.slice(0, 3).map(u => u.uid);
      
      if (top3Gold.includes(user.uid)) {
        newRank = 'MILLIONAIRE';
      } else if ((user.invites || 0) >= 20) {
        newRank = 'TIGER';
      } else if ((user.invites || 0) >= 5) {
        newRank = 'MANTIS';
      } else {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const createdAt = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
        if (createdAt < oneMonthAgo) {
          newRank = 'SUPER_VIP';
        }
      }

      const currentRankPriority = RANKS.find(r => r.id === user.rank)?.priority || 0;
      const newRankPriority = RANKS.find(r => r.id === newRank)?.priority || 0;

      if (newRank !== user.rank && newRankPriority > currentRankPriority) {
        await supabase.from('users').update({ rank: newRank }).eq('uid', user.uid);
      }
    };

    if (allUsers.length > 0) {
      checkRanks();
    }
  }, [user.uid, user.invites, user.gold, user.createdAt, user.rank, allUsers]);
};
