import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { UserProfile } from './types';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Chat from './components/Chat';
import { Loader2, Infinity, AlertCircle } from 'lucide-react';
import { TheGreatIntegration } from './components/TheGreatIntegration';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [showIntegrationEvent, setShowIntegrationEvent] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Auth session error:", error);
      }
      setAuthReady(true);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    }).catch(err => {
      console.error("Failed to get session:", err);
      setFetchError(err.message || 'Failed to connect to database');
      setAuthReady(true);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthReady(true);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (uid: string) => {
    setFetchError(null);
    try {
      const { data, error } = await supabase.from('users').select('*').eq('uid', uid).maybeSingle();
      if (error) {
        console.error("Error fetching profile:", error);
        setFetchError(error.message);
      }
      if (data) {
        setUser(data as UserProfile);
        if (!localStorage.getItem('hasSeenGreatIntegration')) {
          setShowIntegrationEvent(true);
        }
      } else {
        setUser(null);
      }
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      setFetchError(err.message || 'Network error: Failed to fetch profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const channel = supabase.channel('app-user-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `uid=eq.${user.uid}` }, () => {
        fetchProfile(user.uid);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.uid]);

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-serif italic text-white">Connection Error</h2>
          <p className="text-sm text-white/40 leading-relaxed">
            {fetchError === 'Failed to fetch' 
              ? 'Network error: Could not connect to the database. This might be due to a slow connection or a firewall.' 
              : fetchError}
          </p>
          <button
            onClick={() => {
              setLoading(true);
              supabase.auth.getSession().then(({ data: { session } }) => {
                if (session?.user) fetchProfile(session.user.id);
                else window.location.reload();
              });
            }}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!authReady || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Luxury Background Accents */}
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

  // Ban Check
  const now = new Date();
  if (user.bannedUntil && new Date(user.bannedUntil) > now) {
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
    return <Onboarding user={user} onComplete={() => fetchProfile(user.uid)} />;
  }

  return (
    <>
      <Chat user={user} onReplayIntegration={() => setShowIntegrationEvent(true)} />
      {showIntegrationEvent && (
        <TheGreatIntegration onComplete={() => {
          localStorage.setItem('hasSeenGreatIntegration', 'true');
          setShowIntegrationEvent(false);
        }} />
      )}
    </>
  );
}
