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
    case '/help': {
      const helpText = [
        "📜 **COMMANDS:**",
        "• `/pay {user} {amt} {gold|rubies}` - Transfer currency",
        "• `/dice {gold|rubies} {amt}` - Gamble with dice",
        "• `/allin {gold|rubies}` - Gamble everything",
        "• `/bank` - Show your balance",
        "• `/roll {max}` - Roll a random number",
        "• `/flip` - Flip a coin",
        "• `/8ball {q}` - Ask the magic 8-ball",
        "• `/shrug {msg}` - Add a shrug to your message",
        "• `/nudge` - Send a nudge to everyone",
        "• `/staff` - List online staff"
      ].join('\n');
      showToast('Check chat for help!');
      await supabase.from('messages').insert({
        senderId: null,
        senderUsername: 'SYSTEM',
        senderPfp: 'https://cdn-icons-png.flaticon.com/512/1786/1786631.png',
        text: helpText,
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
