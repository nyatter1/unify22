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
    case '/dice': {
      const currency = parts[1]?.toLowerCase() || 'gold';
      const amount = parseInt(parts[2]);

      if (isNaN(amount) || amount <= 0 || (currency !== 'gold' && currency !== 'rubies')) {
        showToast('Usage: /dice [gold|rubies] [amount]');
        return;
      }

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const diceRoll = Math.floor(Math.random() * 6) + 1;
      const won = diceRoll >= 4;
      const multiplier = won ? 2 : 0;
      const winAmount = won ? amount : amount; // winAmount is the change

      try {
        const newBalance = won ? balance + amount : balance - amount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🎲 Rolled a ${diceRoll}!`,
          type: 'gamble_dice',
          gambleData: {
            currency: currency as 'gold' | 'rubies',
            amount,
            result: won ? 'won' : 'lost',
            multiplier,
            winAmount: amount,
            diceRoll
          },
          timestamp: new Date().toISOString(),
        });
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

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (balance <= 0) {
        showToast(`You have no ${currency} to go all-in!`);
        return;
      }

      const won = Math.random() > 0.6; // 40% win rate for all-in
      const multiplier = won ? 2 : 0;

      try {
        const newBalance = won ? balance * 2 : 0;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🔥 GOING ALL IN!`,
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

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const symbols = ['🍒', '🍋', '🔔', '💎', '7️⃣'];
      const s1 = symbols[Math.floor(Math.random() * symbols.length)];
      const s2 = symbols[Math.floor(Math.random() * symbols.length)];
      const s3 = symbols[Math.floor(Math.random() * symbols.length)];

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
          text: `🎰 SLOTS: [ ${s1} | ${s2} | ${s3} ]\n${won ? `🎉 WON ${winAmount.toLocaleString()} ${currency}!` : `💀 LOST ${amount.toLocaleString()} ${currency}`}`,
          type: 'text',
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

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const result = Math.random() > 0.5 ? 'heads' : 'tails';
      const won = choice === result;

      try {
        const newBalance = won ? balance + amount : balance - amount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🪙 COINFLIP: It was ${result.toUpperCase()}! ${won ? `🎉 WON ${amount.toLocaleString()} ${currency}!` : `💀 LOST ${amount.toLocaleString()} ${currency}`}`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
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

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const playerVal = Math.floor(Math.random() * 10) + 12; // 12-21
      const dealerVal = Math.floor(Math.random() * 10) + 12; // 12-21
      
      let result = 'lost';
      if (playerVal > 21) result = 'bust';
      else if (dealerVal > 21 || playerVal > dealerVal) result = 'won';
      else if (playerVal === dealerVal) result = 'push';

      const won = result === 'won';
      const push = result === 'push';

      try {
        const newBalance = won ? balance + amount : (push ? balance : balance - amount);
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🃏 BLACKJACK: You: ${playerVal} | Dealer: ${dealerVal}\n${won ? `🎉 WON ${amount.toLocaleString()} ${currency}!` : (push ? `🤝 PUSH (Refunded)` : `💀 LOST ${amount.toLocaleString()} ${currency}`)}`,
          type: 'text',
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

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const number = Math.floor(Math.random() * 37);
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

      const winAmount = won ? Math.floor(amount * (multiplier - 1)) : amount;

      try {
        const newBalance = won ? balance + winAmount : balance - amount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🎡 ROULETTE: Landed on ${number} (${color.toUpperCase()})!\n${won ? `🎉 WON ${winAmount.toLocaleString()} ${currency}!` : `💀 LOST ${amount.toLocaleString()} ${currency}`}`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
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

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const crashPoint = Math.max(1, (Math.random() * 5).toFixed(2) as any);
      const won = crashPoint > 1.5;
      const winAmount = won ? Math.floor(amount * (crashPoint - 1)) : amount;

      try {
        const newBalance = won ? balance + winAmount : balance - amount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🚀 CRASH: Rocket crashed at ${crashPoint}x!\n${won ? `🎉 WON ${winAmount.toLocaleString()} ${currency}!` : `💀 LOST ${amount.toLocaleString()} ${currency}`}`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
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

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const baseCard = Math.floor(Math.random() * 13) + 1;
      const nextCard = Math.floor(Math.random() * 13) + 1;
      const won = (bet === 'high' && nextCard > baseCard) || (bet === 'low' && nextCard < baseCard);

      try {
        const newBalance = won ? balance + amount : balance - amount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🃏 HIGHLOW: Base: ${baseCard} | Next: ${nextCard}\n${won ? `🎉 WON ${amount.toLocaleString()} ${currency}!` : `💀 LOST ${amount.toLocaleString()} ${currency}`}`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
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

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const win = Math.random() > 0.7;
      const winAmount = win ? amount * 3 : 0;

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🎫 SCRATCH: ${win ? `💰 BIG WIN! (+${winAmount} ${currency})` : '❌ Better luck next time!'}`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
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

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const multipliers = [0.2, 0.5, 1, 1.5, 2, 5, 10];
      const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
      const winAmount = Math.floor(amount * multiplier);

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🔵 PLINKO: Ball dropped and hit x${multiplier}!\n${multiplier >= 1 ? `🎉 WON ${winAmount.toLocaleString()} ${currency}!` : `💀 LOST ${amount.toLocaleString()} ${currency}`}`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
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

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const hitMine = Math.random() < (minesCount / 25);
      const multiplier = hitMine ? 0 : (1 + (minesCount * 0.5));
      const winAmount = Math.floor(amount * multiplier);

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `💣 MINES: ${hitMine ? '💥 BOOM! You hit a mine!' : `💎 SAFE! You found a diamond! (x${multiplier.toFixed(2)})`}\n${!hitMine ? `🎉 WON ${winAmount.toLocaleString()} ${currency}!` : `💀 LOST ${amount.toLocaleString()} ${currency}`}`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
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

      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const balance = currency === 'gold' ? (latestUser?.gold ?? user.gold) : (latestUser?.rubies ?? user.rubies);

      if (amount > balance) {
        showToast(`Insufficient ${currency}!`);
        return;
      }

      const floor = Math.floor(Math.random() * 5); // 0-4
      const multipliers = [0, 1.5, 2.5, 5, 10];
      const multiplier = multipliers[floor];
      const winAmount = Math.floor(amount * multiplier);

      try {
        const newBalance = balance - amount + winAmount;
        await supabase.from('users').update({ [currency]: newBalance }).eq('uid', user.uid);

        await supabase.from('messages').insert({
          senderId: user.uid,
          senderUsername: user.username,
          senderPfp: user.pfp,
          senderRank: user.rank || 'VIP',
          text: `🏰 TOWER: You climbed to floor ${floor}!\n${floor > 0 ? `🎉 WON ${winAmount.toLocaleString()} ${currency}!` : `💀 FELL! LOST ${amount.toLocaleString()} ${currency}`}`,
          type: 'text',
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error(err);
        showToast('Tower failed');
      }
      break;
    }
    case '/bank': {
      const { data: latestUser } = await supabase.from('users').select('gold, rubies').eq('uid', user.uid).single();
      const gold = latestUser?.gold ?? user.gold;
      const rubies = latestUser?.rubies ?? user.rubies;
      
      showToast(`Bank: ${gold.toLocaleString()} Gold | ${rubies.toLocaleString()} Rubies`);
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: 'SYSTEM',
        senderPfp: 'https://cdn-icons-png.flaticon.com/512/1786/1786631.png',
        recipientId: user.uid,
        text: `🏦 **YOUR BANK:**\n💰 Gold: ${gold.toLocaleString()}\n💎 Rubies: ${rubies.toLocaleString()}`,
        type: 'system',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    case '/cmds':
    case '/commands': {
      const cmds = [
        "📜 **ALL COMMANDS:**",
        "• `/bank` - Check your balance",
        "• `/pay {user} {amt} {gold|rubies}` - Pay someone",
        "• `/dice {gold|rubies} {amt}` - Roll dice (4+ wins)",
        "• `/allin {gold|rubies}` - Gamble everything (40% win)",
        "• `/slots {gold|rubies} {amt}` - Play slots",
        "• `/coinflip {gold|rubies} {amt} {h|t}` - Flip a coin",
        "• `/blackjack {gold|rubies} {amt}` - Simplified blackjack",
        "• `/roulette {gold|rubies} {amt} {bet}` - Play roulette",
        "• `/crash {gold|rubies} {amt}` - Rocket crash game",
        "• `/highlow {gold|rubies} {amt} {h|l}` - Guess next card",
        "• `/scratch {gold|rubies} {amt}` - Scratch card",
        "• `/plinko {gold|rubies} {amt}` - Plinko ball drop",
        "• `/mines {gold|rubies} {amt} {mines}` - Minesweeper gamble",
        "• `/tower {gold|rubies} {amt}` - Climb the tower",
        "• `/roll {max}` - Roll 1 to max",
        "• `/flip` - Flip heads/tails",
        "• `/8ball {q}` - Magic 8-ball",
        "• `/nudge {user}` - Nudge a user",
        "• `/trivia` - Start a trivia question",
        "• `/rps {r|p|s}` - Rock Paper Scissors",
        "• `/staff` - See online staff",
        "• `/clear` - Clear chat (Admins only)"
      ].join('\n');
      
      await supabase.from('messages').insert({
        senderId: user.uid,
        senderUsername: 'SYSTEM',
        senderPfp: 'https://cdn-icons-png.flaticon.com/512/1786/1786631.png',
        recipientId: user.uid,
        text: cmds,
        type: 'system',
        timestamp: new Date().toISOString(),
      });
      break;
    }
    default:
      showToast('Invalid command!');
      break;
  }
};
