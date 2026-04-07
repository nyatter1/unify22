import { supabase } from '../supabase';
import { UserProfile, Message } from '../types';

export interface CommandContext {
  user: UserProfile;
  allUsers: UserProfile[];
  showToast: (msg: string) => void;
  setters: any;
  triviaState: {
    triviaActive: boolean;
    triviaQuestion: { q: string; a: string } | null;
    setTriviaActive: (a: boolean) => void;
    setTriviaQuestion: (q: any) => void;
  };
}

export const handleCommand = async (
  command: string,
  parts: string[],
  context: CommandContext
) => {
  const { user, allUsers, showToast } = context;

  switch (command) {
    case '/clear':
    case '/clearchat': {
      const isAdmin = user.rank === 'DEVELOPER' || user.rank === 'ADMINISTRATION' || user.rank === 'STAR' || user.rank === 'FOUNDER';
      if (!isAdmin) {
        showToast('Only admins can use this command.');
        return;
      }
      try {
        const { data: snapshot } = await supabase.from('messages').select('id');
        if (snapshot) {
          for (const doc of snapshot) {
            await supabase.from('messages').delete().eq('id', doc.id);
          }
        }
        showToast('Chat cleared!');
      } catch (err) {
        console.error(err);
        showToast('Failed to clear chat.');
      }
      break;
    }
    case '/roll': {
      const isDev = user.email === 'dev@gmail.com';
      const max = parseInt(parts[1]) || 100;
      const result = isDev ? max : Math.floor(Math.random() * max) + 1;
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        senderRank: user.rank || 'VIP',
        text: `🎲 Rolled a ${result} (1-${max})`,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/flip': {
      const isDev = user.email === 'dev@gmail.com';
      const result = isDev ? 'Heads' : (Math.random() > 0.5 ? 'Heads' : 'Tails');
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        senderRank: user.rank || 'VIP',
        text: `🪙 Flipped a coin: ${result}`,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/8ball': {
      const question = parts.slice(1).join(' ');
      if (!question) {
        showToast('Ask a question! /8ball [question]');
        return;
      }
      const answers = ['Yes', 'No', 'Maybe', 'Definitely', 'Absolutely not', 'Ask again later', 'I doubt it', 'Without a doubt'];
      const answer = answers[Math.floor(Math.random() * answers.length)];
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        senderRank: user.rank || 'VIP',
        text: `🎱 Question: ${question}\nAnswer: ${answer}`,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/give':
    case '/pay': {
      const targetUsername = parts[1];
      const amount = parseInt(parts[2]);
      const currency = parts[3]?.toLowerCase() || 'gold';

      if (!targetUsername || isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies')) {
        showToast(`Usage: ${command} [username] [amount] [gold|rubies]`);
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const targetUser = allUsers.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
      if (!targetUser) {
        showToast('User not found.');
        return;
      }

      if (targetUser.uid === user.uid) {
        showToast('You cannot pay yourself.');
        return;
      }

      try {
        const { data: currentUser } = await supabase.from('users').select(currency).eq('uid', user.uid).single();
        const { data: targetUserDb } = await supabase.from('users').select(currency).eq('uid', targetUser.uid).single();
        
        const currentBalance = currentUser?.[currency] || 0;
        const targetBalance = targetUserDb?.[currency] || 0;

        await supabase.from('users').update({ [currency]: currentBalance - amount }).eq('uid', user.uid);
        await supabase.from('users').update({ [currency]: targetBalance + amount }).eq('uid', targetUser.uid);
        
        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `💸 Paid ${amount.toLocaleString()} ${currency} to ${targetUser.username}!`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error(err);
        showToast('Failed to transfer currency');
      }
      break;
    }
    case '/staff': {
      const staffRanks = ['DEVELOPER', 'ADMINISTRATION', 'STAR', 'FOUNDER', 'MODERATOR'];
      const onlineStaff = allUsers.filter(u => u.isOnline && staffRanks.includes(u.rank || ''));
      const staffList = onlineStaff.length > 0 
        ? onlineStaff.map(s => `${s.username} (${s.rank})`).join(', ')
        : 'No staff online.';
      
      showToast('Online staff listed in chat.');
      await supabase.from('messages').insert({
        senderId: null,
        senderUsername: 'SYSTEM',
        senderPfp: 'https://cdn-icons-png.flaticon.com/512/1786/1786631.png',
        text: `🛡️ **ONLINE STAFF:** ${staffList}`,
        type: 'system',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/mute':
    case '/unmute':
    case '/kick':
    case '/unkick':
    case '/ban':
    case '/unban': {
      const isAdmin = user.rank === 'DEVELOPER' || user.rank === 'ADMINISTRATION' || user.rank === 'STAR' || user.rank === 'FOUNDER' || user.rank === 'MODERATOR';
      if (!isAdmin) {
        showToast('You do not have permission to use moderation commands.');
        return;
      }

      const targetUsername = parts[1];
      if (!targetUsername) {
        showToast(`Usage: ${command} [username]`);
        return;
      }

      const targetUser = allUsers.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
      if (!targetUser) {
        showToast('User not found.');
        return;
      }

      // Need to handle admin modal via context
      context.setters.setSelectedUserForAdmin(targetUser);
      context.setters.setAdminAction(command.substring(1) as any);
      context.setters.setShowAdminModal(true);
      break;
    }
    case '/nudge': {
      const targetUsername = parts[1];
      if (!targetUsername) {
        showToast('Usage: /nudge [username]');
        return;
      }

      const targetUser = allUsers.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
      if (!targetUser) {
        showToast('User not found.');
        return;
      }

      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        text: `👉 ${user.username} nudged ${targetUser.username}!`,
        type: 'nudge',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/trivia': {
      if (context.triviaState.triviaActive) {
        showToast('Trivia is already active!');
        return;
      }

      const questions = [
        { q: "What is the capital of France?", a: "paris" },
        { q: "What is 7 x 8?", a: "56" },
        { q: "Who wrote Romeo and Juliet?", a: "shakespeare" },
        { q: "What is the largest planet in our solar system?", a: "jupiter" },
        { q: "What is the chemical symbol for gold?", a: "au" }
      ];
      
      const randomQ = questions[Math.floor(Math.random() * questions.length)];
      context.triviaState.setTriviaActive(true);
      context.triviaState.setTriviaQuestion(randomQ);

      await supabase.from('messages').insert({
        senderId: null,
        senderUsername: 'System',
        senderPfp: 'https://cdn-icons-png.flaticon.com/512/1786/1786631.png',
        text: `🧠 TRIVIA TIME! First to answer correctly wins 50 Gold!\n\nQuestion: ${randomQ.q}`,
        type: 'system',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/rps': {
      const choice = parts[1]?.toLowerCase();
      if (!['rock', 'paper', 'scissors'].includes(choice)) {
        showToast('Usage: /rps [rock|paper|scissors]');
        return;
      }

      const choices = ['rock', 'paper', 'scissors'];
      const botChoice = choices[Math.floor(Math.random() * choices.length)];
      
      let result = 'tied';
      let winAmount = 0;
      if (
        (choice === 'rock' && botChoice === 'scissors') ||
        (choice === 'paper' && botChoice === 'rock') ||
        (choice === 'scissors' && botChoice === 'paper')
      ) {
        result = 'won';
        winAmount = 10;
      } else if (choice !== botChoice) {
        result = 'lost';
      }

      if (result === 'won') {
        const { data: currentUser } = await supabase.from('users').select('gold').eq('uid', user.uid).single();
        const currentGold = currentUser?.gold || 0;
        await supabase.from('users').update({ gold: currentGold + winAmount }).eq('uid', user.uid);
      }

      const emojiMap: Record<string, string> = { rock: '🪨', paper: '📄', scissors: '✂️' };

      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        text: `Played RPS: ${emojiMap[choice]} vs ${emojiMap[botChoice]} (System)\nResult: You ${result}! ${result === 'won' ? `(+${winAmount} Gold)` : ''}`,
        type: 'rps',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/rigged': {
      const isAdmin = user.rank === 'DEVELOPER' || user.rank === 'ADMINISTRATION' || user.rank === 'FOUNDER';
      if (!isAdmin) return showToast('Only admins can use this!');
      const targetUsername = parts[1];
      if (!targetUsername) return showToast('Usage: /rigged {username}');
      const target = allUsers.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
      if (!target) return showToast('User not found!');
      try {
        await supabase.from('users').update({ isRigged: true }).eq('uid', target.uid);
        showToast(`${target.username} is now RIGGED! 😈`);
      } catch (err) {
        console.error(err);
        showToast('Failed to rig user');
      }
      break;
    }
    case '/unrigg': {
      const isAdmin = user.rank === 'DEVELOPER' || user.rank === 'ADMINISTRATION' || user.rank === 'FOUNDER';
      if (!isAdmin) return showToast('Only admins can use this!');
      const targetUsername = parts[1];
      if (!targetUsername) return showToast('Usage: /unrigg {username}');
      const target = allUsers.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
      if (!target) return showToast('User not found!');
      try {
        await supabase.from('users').update({ isRigged: false }).eq('uid', target.uid);
        showToast(`${target.username} is no longer rigged.`);
      } catch (err) {
        console.error(err);
        showToast('Failed to unrig user');
      }
      break;
    }
    case '/dice': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      const amount = parseInt(parts[2]);

      if (isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies')) {
        showToast('Usage: /dice [gold|rubies] [amount]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies, isRigged').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
      const isRigged = latestUser?.isRigged || false;

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const diceRoll = isRigged ? 6 : Math.floor(Math.random() * 6) + 1;
      const won = diceRoll >= 4;
      const multiplier = won ? 2 : 0;
      const winAmount = won ? amount * 2 : 0;

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        const { error } = await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `Rolled a ${diceRoll}!`,
          type: 'gamble_dice',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount,
            result: won ? 'won' : 'lost',
            multiplier,
            winAmount,
            diceRoll
          },
          timestamp: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err) {
        console.error(err);
        showToast('Gamble failed');
      }
      break;
    }
    case '/allin': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      if (currency !== 'gold' && currency !== 'rubies') {
        showToast('Usage: /allin [gold|rubies]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies, isRigged').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
      const isRigged = latestUser?.isRigged || false;

      if (balance <= 0) {
        showToast(`You have no ${currency} to go all-in!`);
        return;
      }

      const won = isRigged ? true : Math.random() > 0.6;
      const multiplier = won ? 2 : 0;
      const winAmount = won ? balance * 2 : 0;

      try {
        await supabase.from('users').update({ [currency]: winAmount }).eq('uid', user.uid);

        const { error } = await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `GOING ALL IN!`,
          type: 'gamble_allin',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount: balance,
            result: won ? 'won' : 'lost',
            multiplier,
            winAmount: balance
          },
          timestamp: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err) {
        console.error(err);
        showToast('All-in failed');
      }
      break;
    }
    case '/slots': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      const amount = parseInt(parts[2]);

      if (isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies')) {
        showToast('Usage: /slots [gold|rubies] [amount]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies, isRigged').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
      const isRigged = latestUser?.isRigged || false;

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const symbols = ['🍒', '🍋', '🔔', '💎', '7️⃣'];
      const s1 = isRigged ? '💎' : symbols[Math.floor(Math.random() * symbols.length)];
      const s2 = isRigged ? '💎' : symbols[Math.floor(Math.random() * symbols.length)];
      const s3 = isRigged ? '💎' : symbols[Math.floor(Math.random() * symbols.length)];

      let multiplier = 0;
      if (s1 === s2 && s2 === s3) {
        multiplier = s1 === '💎' ? 10 : s1 === '7️⃣' ? 5 : 3;
      } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        multiplier = 1.5;
      }

      const won = multiplier > 0;
      const winAmount = Math.floor(amount * multiplier);

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `[ ${s1} | ${s2} | ${s3} ]`,
          type: 'gamble_slots',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount,
            result: won ? 'won' : 'lost',
            multiplier,
            winAmount: won ? winAmount : amount
          },
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error(err);
        showToast('Slots failed');
      }
      break;
    }
    case '/coinflip': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      const amount = parseInt(parts[2]);
      const choice = parts[3]?.toLowerCase();

      if (isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies') || !['heads', 'tails'].includes(choice)) {
        showToast('Usage: /coinflip [gold|rubies] [amount] [heads|tails]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies, isRigged').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
      const isRigged = latestUser?.isRigged || false;

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const result = isRigged ? choice : (Math.random() > 0.5 ? 'heads' : 'tails');
      const won = choice === result;
      const winAmount = won ? amount * 2 : 0;

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        const { error } = await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `It was ${result.toUpperCase()}!`,
          type: 'gamble_coinflip',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount,
            result: won ? 'won' : 'lost',
            multiplier: won ? 2 : 0,
            winAmount
          },
          timestamp: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err) {
        console.error(err);
        showToast('Coinflip failed');
      }
      break;
    }
    case '/blackjack': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      const amount = parseInt(parts[2]);

      if (isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies')) {
        showToast('Usage: /blackjack [gold|rubies] [amount]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies, isRigged').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
      const isRigged = latestUser?.isRigged || false;

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const playerVal = isRigged ? 21 : Math.floor(Math.random() * 10) + 12;
      const dealerVal = isRigged ? 17 : Math.floor(Math.random() * 10) + 12;
      
      let result = 'lost';
      if (playerVal > 21) result = 'bust';
      else if (dealerVal > 21 || playerVal > dealerVal) result = 'won';
      else if (playerVal === dealerVal) result = 'push';

      const won = result === 'won';
      const push = result === 'push';
      const winAmount = won ? amount * 2 : (push ? amount : 0);

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        const { error } = await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `You: ${playerVal} | Dealer: ${dealerVal}`,
          type: 'gamble_blackjack',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount,
            result: won ? 'won' : 'lost',
            multiplier: won ? 2 : (push ? 1 : 0),
            winAmount: push ? 0 : amount
          },
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error(err);
        showToast('Blackjack failed');
      }
      break;
    }
    case '/roulette': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      const amount = parseInt(parts[2]);
      const bet = parts[3]?.toLowerCase();

      if (isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies') || !bet) {
        showToast('Usage: /roulette [gold|rubies] [amount] [red|black|green|0-36]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies, isRigged').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
      const isRigged = latestUser?.isRigged || false;

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const number = isRigged ? (bet === 'red' ? 1 : (bet === 'black' ? 2 : (bet === 'green' ? 0 : parseInt(bet)))) : Math.floor(Math.random() * 37);
      const color = number === 0 ? 'green' : (number % 2 === 0 ? 'black' : 'red');
      
      let won = false;
      let multiplier = 0;

      if (bet === color) {
        won = true;
        multiplier = color === 'green' ? 35 : 2;
      } else if (parseInt(bet) === number) {
        won = true;
        multiplier = 35;
      }

      const winAmount = won ? Math.floor(amount * multiplier) : 0;

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        const { error } = await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `Landed on ${number} (${color.toUpperCase()})!`,
          type: 'gamble_roulette',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount,
            result: won ? 'won' : 'lost',
            multiplier,
            winAmount
          },
          timestamp: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err) {
        console.error(err);
        showToast('Roulette failed');
      }
      break;
    }
    case '/crash': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      const amount = parseInt(parts[2]);

      if (isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies')) {
        showToast('Usage: /crash [gold|rubies] [amount]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies, isRigged').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
      const isRigged = latestUser?.isRigged || false;

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const crashPoint = isRigged ? (Math.random() * 5 + 5) : Math.max(1, (Math.random() * 5).toFixed(2) as any);
      const won = crashPoint > 1.5;
      const winAmount = won ? Math.floor(amount * crashPoint) : 0;

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        const { error } = await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `Rocket crashed at ${crashPoint}x!`,
          type: 'gamble_crash',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount,
            result: won ? 'won' : 'lost',
            multiplier: crashPoint,
            winAmount
          },
          timestamp: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err) {
        console.error(err);
        showToast('Crash failed');
      }
      break;
    }
    case '/highlow': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      const amount = parseInt(parts[2]);
      const bet = parts[3]?.toLowerCase();

      if (isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies') || !['high', 'low'].includes(bet)) {
        showToast('Usage: /highlow [gold|rubies] [amount] [high|low]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies, isRigged').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
      const isRigged = latestUser?.isRigged || false;

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const baseCard = Math.floor(Math.random() * 13) + 1;
      const nextCard = isRigged ? (bet === 'high' ? 13 : 1) : Math.floor(Math.random() * 13) + 1;
      const won = (bet === 'high' && nextCard > baseCard) || (bet === 'low' && nextCard < baseCard);
      const winAmount = won ? amount * 2 : 0;

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        const { error } = await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `Base: ${baseCard} | Next: ${nextCard}`,
          type: 'gamble_highlow',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount,
            result: won ? 'won' : 'lost',
            multiplier: won ? 2 : 0,
            winAmount
          },
          timestamp: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err) {
        console.error(err);
        showToast('Highlow failed');
      }
      break;
    }
    case '/scratch': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      const amount = parseInt(parts[2]);

      if (isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies')) {
        showToast('Usage: /scratch [gold|rubies] [amount]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies, isRigged').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
      const isRigged = latestUser?.isRigged || false;

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const win = isRigged ? true : Math.random() > 0.7;
      const multiplier = win ? (isRigged ? 10 : 3) : 0;
      const winAmount = Math.floor(amount * multiplier);

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        const { error } = await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: win ? `💰 BIG WIN!` : '❌ Better luck next time!',
          type: 'gamble_scratch',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount,
            result: win ? 'won' : 'lost',
            multiplier,
            winAmount
          },
          timestamp: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err) {
        console.error(err);
        showToast('Scratch failed');
      }
      break;
    }
    case '/plinko': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      const amount = parseInt(parts[2]);

      if (isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies')) {
        showToast('Usage: /plinko [gold|rubies] [amount]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies, isRigged').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
      const isRigged = latestUser?.isRigged || false;

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const multipliers = [0.2, 0.5, 1, 1.5, 2, 5, 10];
      const multiplier = isRigged ? 10 : multipliers[Math.floor(Math.random() * multipliers.length)];
      const winAmount = Math.floor(amount * multiplier);

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        const { error } = await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `Ball hit x${multiplier}!`,
          type: 'gamble_plinko',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount,
            result: multiplier >= 1 ? 'won' : 'lost',
            multiplier,
            winAmount
          },
          timestamp: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err) {
        console.error(err);
        showToast('Plinko failed');
      }
      break;
    }
    case '/mines': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      const amount = parseInt(parts[2]);
      const minesCount = Math.min(24, Math.max(1, parseInt(parts[3]) || 3));

      if (isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies')) {
        showToast('Usage: /mines [gold|rubies] [amount] [mines(1-24)]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies, isRigged').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
      const isRigged = latestUser?.isRigged || false;

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const hitMine = isRigged ? false : Math.random() < (minesCount / 25);
      const multiplier = hitMine ? 0 : (1 + (minesCount * 0.5));
      const winAmount = Math.floor(amount * multiplier);

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        const { error } = await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: hitMine ? '💥 BOOM!' : `💎 SAFE!`,
          type: 'gamble_mines',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount,
            result: hitMine ? 'lost' : 'won',
            multiplier,
            winAmount
          },
          timestamp: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err) {
        console.error(err);
        showToast('Mines failed');
      }
      break;
    }
    case '/tower': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      const amount = parseInt(parts[2]);

      if (isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies')) {
        showToast('Usage: /tower [gold|rubies] [amount]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies, isRigged').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);
      const isRigged = latestUser?.isRigged || false;

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const floor = isRigged ? 4 : Math.floor(Math.random() * 5);
      const multipliers = [0, 1.5, 2.5, 5, 10];
      const multiplier = multipliers[floor];
      const winAmount = Math.floor(amount * multiplier);

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        const { error } = await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: floor > 0 ? `Climbed to floor ${floor}!` : `Fell!`,
          type: 'gamble_tower',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount,
            result: floor > 0 ? 'won' : 'lost',
            multiplier,
            winAmount
          },
          timestamp: new Date().toISOString(),
        });
        if (error) throw error;
      } catch (err) {
        console.error(err);
        showToast('Tower failed');
      }
      break;
    }
    case '/setgold':
    case '/setrubies': {
      const isAdmin = user.rank === 'DEVELOPER' || user.rank === 'ADMINISTRATION' || user.rank === 'FOUNDER';
      if (!isAdmin) {
        showToast('Only high-ranking staff can use this command.');
        return;
      }
      const targetUsername = parts[1];
      const amount = parseInt(parts[2]);
      const currency = command === '/setgold' ? 'gold' : 'rubies';

      if (!targetUsername || isNaN(amount)) {
        showToast(`Usage: ${command} [username] [amount]`);
        return;
      }

      const targetUser = allUsers.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
      if (!targetUser) {
        showToast('User not found.');
        return;
      }

      await supabase.from('users').update({ [currency]: amount }).eq('uid', targetUser.uid);
      showToast(`Set ${targetUser.username}'s ${currency} to ${amount.toLocaleString()}`);
      break;
    }
    case '/setrank': {
      const isAdmin = user.rank === 'DEVELOPER' || user.rank === 'FOUNDER';
      if (!isAdmin) {
        showToast('Only Developers/Founders can use this command.');
        return;
      }
      const targetUsername = parts[1];
      const rank = parts[2]?.toUpperCase();

      if (!targetUsername || !rank) {
        showToast('Usage: /setrank [username] [rank]');
        return;
      }

      const targetUser = allUsers.find(u => u.username.toLowerCase() === targetUsername.toLowerCase());
      if (!targetUser) {
        showToast('User not found.');
        return;
      }

      await supabase.from('users').update({ rank }).eq('uid', targetUser.uid);
      showToast(`Set ${targetUser.username}'s rank to ${rank}`);
      break;
    }
    case '/announce': {
      const isAdmin = user.rank === 'DEVELOPER' || user.rank === 'ADMINISTRATION' || user.rank === 'FOUNDER' || user.rank === 'MODERATOR';
      if (!isAdmin) return;
      const msg = parts.slice(1).join(' ');
      if (!msg) return;

      await supabase.from('messages').insert({
        senderId: 'SYSTEM',
        senderUsername: 'BROADCAST',
        senderPfp: 'https://cdn-icons-png.flaticon.com/512/1786/1786631.png',
        text: `📢 **ANNOUNCEMENT:** ${msg}`,
        type: 'system',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/love': {
      const target = parts[1] || 'everyone';
      const percent = Math.floor(Math.random() * 101);
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        text: `❤️ ${user.username} loves ${target} ${percent}%!`,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/hug': {
      const target = parts[1];
      if (!target) return;
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        text: `🫂 ${user.username} gave ${target} a big hug!`,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/slap': {
      const target = parts[1];
      if (!target) return;
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        text: `🖐️ ${user.username} slapped ${target} across the face!`,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/kill': {
      const target = parts[1];
      if (!target) return;
      const methods = ['with a giant spoon', 'by tickling them to death', 'with a laser beam', 'by throwing a piano at them'];
      const method = methods[Math.floor(Math.random() * methods.length)];
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        text: `💀 ${user.username} killed ${target} ${method}!`,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/dance': {
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        text: `💃 ${user.username} is busting some moves! 🕺`,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/weather': {
      const city = parts.slice(1).join(' ') || 'the world';
      const temps = ['Sunny ☀️', 'Rainy 🌧️', 'Cloudy ☁️', 'Snowing ❄️', 'Stormy ⛈️'];
      const temp = temps[Math.floor(Math.random() * temps.length)];
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        text: `🌡️ Weather in ${city}: ${temp} (${Math.floor(Math.random() * 35)}°C)`,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/joke': {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "What do you call a fake noodle? An impasta!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "How does a penguin build its house? Igloos it together!"
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        text: `🤡 ${joke}`,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/fact': {
      const facts = [
        "Honey never spoils.",
        "A day on Venus is longer than a year on Venus.",
        "Bananas are berries, but strawberries aren't.",
        "Octopuses have three hearts."
      ];
      const fact = facts[Math.floor(Math.random() * facts.length)];
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: user.username,
        senderPfp: user.pfp,
        text: `💡 FACT: ${fact}`,
        type: 'text',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/ping': {
      const start = Date.now();
      const localMsg: Message = {
        id: `local-${Date.now()}`,
        senderId: 'SYSTEM',
        senderUsername: 'SYSTEM',
        senderPfp: 'https://cdn-icons-png.flaticon.com/512/1786/1786631.png',
        recipientId: user.uid,
        text: `🏓 Pong! Latency: ${Date.now() - start}ms`,
        type: 'system',
        timestamp: new Date().toISOString(),
      };
      context.setters.setMessages((prev: Message[]) => [...prev, localMsg]);
      break;
    }
    case '/cmds':
    case '/commands': {
      const cmds = [
        "📜 **ALL COMMANDS:**",
        "• `/bank` - Check your balance",
        "• `/pay {user} {amt} {gold|rubies}` - Pay someone",
        "• `/dice {gold|rubies} {amt}` - Roll dice (4+ wins)",
        "• `/allin {gold|rubies}` - Gamble everything",
        "• `/slots {gold|rubies} {amt}` - Play slots",
        "• `/coinflip {gold|rubies} {amt} {h|t}` - Flip a coin",
        "• `/blackjack {gold|rubies} {amt}` - Blackjack",
        "• `/roulette {gold|rubies} {amt} {bet}` - Roulette",
        "• `/crash {gold|rubies} {amt}` - Crash game",
        "• `/highlow {gold|rubies} {amt} {h|l}` - High/Low",
        "• `/scratch {gold|rubies} {amt}` - Scratch card",
        "• `/plinko {gold|rubies} {amt}` - Plinko",
        "• `/mines {gold|rubies} {amt} {mines}` - Mines",
        "• `/tower {gold|rubies} {amt}` - Tower",
        "• `/love {user}` | `/hug {user}` | `/slap {user}` | `/kill {user}`",
        "• `/joke` | `/fact` | `/weather {city}` | `/dance`",
        "• `/ping` | `/staff` | `/roll {max}` | `/flip` | `/8ball {q}`",
        "• `/nudge {user}` | `/trivia` | `/rps {r|p|s}`",
        "• `/announce {msg}` (Staff) | `/clear` (Staff)",
        "• `/setgold {user} {amt}` (Admin) | `/setrank {user} {rank}` (Admin)",
        "• `/rigged {user}` (Admin) | `/unrigg {user}` (Admin)"
      ].join('\n');
      
      const localMsg: Message = {
        id: `local-${Date.now()}`,
        senderId: 'SYSTEM',
        senderUsername: 'SYSTEM',
        senderPfp: 'https://cdn-icons-png.flaticon.com/512/1786/1786631.png',
        recipientId: user.uid,
        text: cmds,
        type: 'system',
        timestamp: new Date().toISOString(),
      };
      context.setters.setMessages((prev: Message[]) => [...prev, localMsg]);
      break;
    }
    default:
      showToast('Invalid command!');
      break;
  }
};
