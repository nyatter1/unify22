import React, { useState } from 'react';
// 1. Firebase Imports
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UserRank } from '../types';
import { Infinity, Mail, Lock, User, Calendar, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AuthProps {
  onAuthSuccess: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // --- FIREBASE LOGIN ---
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // --- FIREBASE SIGN UP ---
        if (!username || !age || !gender) throw new Error('Please fill all fields');
        if (Number(age) < 7) throw new Error('You must be at least 7 years old to join');
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Firebase Auth Profile (Display Name)
        await updateProfile(user, { displayName: username });

        // Determine Rank
        let rank: UserRank = 'VIP';
        const devEmails = ['test@gmail.com', 'dev@gmail.com', 'developer@gmail.com', 'haydensixseven@gmail.com'];
        if (devEmails.includes(email.toLowerCase())) {
          rank = 'DEVELOPER';
        }

        // Create Firestore Profile Document
        // This replaces the Supabase 'profiles' table logic
        await setDoc(doc(db, 'profiles', user.uid), {
          id: user.uid,
          username,
          email,
          age: Number(age),
          gender,
          gold: 1000,
          rubies: 10,
          rank,
          theme: 'luxury-black',
          card_style: 'default',
          onboardingStep: 1, // Matches your App.tsx check
          createdAt: serverTimestamp(),
          bannedUntil: null
        });
      }
      onAuthSuccess();
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Convert Firebase codes to readable messages
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 font-sans overflow-hidden">
      {/* Luxury Background Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-[120px]" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-amber-900/20 rounded-[2.5rem] p-10 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] mb-6">
            <Infinity className="w-12 h-12 text-black" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-serif italic bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
            Uni-Fy
          </h1>
          <p className="text-amber-700/60 mt-3 uppercase tracking-[0.3em] text-[10px] font-bold">
            {isLogin ? 'Welcome back to the universe' : 'Join the unified community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-5 overflow-hidden"
              >
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-900/40" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/40 border border-amber-900/20 rounded-2xl py-4 pl-12 pr-4 text-amber-100 placeholder:text-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-900/40" />
                    <input
                      type="number"
                      placeholder="Age"
                      min="1"
                      max="1000"
                      value={age}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-black/40 border border-amber-900/20 rounded-2xl py-4 pl-12 pr-4 text-amber-100 placeholder:text-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
                    />
                  </div>

                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-black/40 border border-amber-900/20 rounded-2xl py-4 px-4 text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all appearance-none"
                  >
                    <option value="" disabled className="bg-black">Gender</option>
                    <option value="male" className="bg-black">Male</option>
                    <option value="female" className="bg-black">Female</option>
                    <option value="other" className="bg-black">Other</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-900/40" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-amber-900/20 rounded-2xl py-4 pl-12 pr-4 text-amber-100 placeholder:text-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-900/40" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-amber-900/20 rounded-2xl py-4 pl-12 pr-4 text-amber-100 placeholder:text-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-400/5 border border-red-400/10 rounded-xl p-4 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full py-4 rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 bg-[length:200%_100%] animate-shimmer" />
            <div className="relative flex items-center justify-center text-black font-bold uppercase tracking-[0.2em] text-xs">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
            </div>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-900/60 hover:text-amber-400 text-[10px] uppercase tracking-widest font-bold transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
