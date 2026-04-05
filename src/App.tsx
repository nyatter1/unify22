import React, { useState, useEffect } from 'react';
// 1. Updated Imports
import { auth, db } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { UserProfile } from './types';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Chat from './components/Chat';
import { Loader2, Infinity } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // 2. Firebase Auth Listener (Replaces supabase.auth.onAuthStateChange)
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthReady(true);
      if (firebaseUser) {
        fetchProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchProfile = async (uid: string) => {
    try {
      // 3. Real-time Firestore Subscription (Replaces fetch + channel)
      const docRef = doc(db, 'profiles', uid);
      
      // onSnapshot handles both the initial fetch and real-time updates
      const unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setUser(docSnap.data() as UserProfile);
        } else {
          console.error('No such profile!');
          setUser(null);
        }
        setLoading(false);
      }, (error) => {
        console.error('Error fetching profile:', error);
        setLoading(false);
      });

      return () => unsubscribeProfile();
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setLoading(false);
    }
  };

  // --- UI RENDER LOGIC (Stayed mostly the same) ---

  if (!authReady || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] mb-8 animate-pulse">
            <Infinity className="w-12 h-12 text-black" strokeWidth={2.5} />
          </div>
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="mt-6 text-[10px] text-amber-700/60 uppercase tracking-[0.4em] font-bold animate-pulse">
            Aligning Universe
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  // Ban Check (Firebase Timestamps use .toDate())
  const now = new Date();
  if (user.bannedUntil && user.bannedUntil.toDate() > now) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white p-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-red-500">You have been banned.</h1>
          <p className="text-zinc-400">Please contact an administrator for more information.</p>
        </div>
      </div>
    );
  }

  const onboardingStep = user.onboardingStep ?? 1;

  if (onboardingStep > 0) {
    return <Onboarding user={user} onComplete={() => {}} />;
  }

  return <Chat user={user} />;
}
