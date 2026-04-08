import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';

export const TheGreatIntegration = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<string>('start');
  const [isExploding, setIsExploding] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  const schedule = (time: number, action: () => void) => {
    const id = setTimeout(action, time);
    timeouts.current.push(id);
  };

  const clearAllTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  const playSound = (url: string, volume = 1) => {
    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(() => console.log("Audio play prevented by browser policy"));
  };

  const playDeepBoom = () => playSound('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3', 0.8);
  const playExplosion = () => playSound('https://assets.mixkit.co/active_storage/sfx/218/218-preview.mp3', 0.7);
  const playEpicHit = () => playSound('https://assets.mixkit.co/active_storage/sfx/281/281-preview.mp3', 1);

  const triggerExplosion = (nextPhase: string, colors: string[]) => {
    playExplosion();
    setIsExploding(true);
    setPhase('none');

    confetti({
      particleCount: 400,
      spread: 360,
      origin: { y: 0.5, x: 0.5 },
      colors: colors,
      startVelocity: 100,
      gravity: 0.6,
      ticks: 400,
      zIndex: 10000,
      disableForReducedMotion: true
    });

    setTimeout(() => setIsExploding(false), 800);
    
    schedule(2000, () => {
      setPhase(nextPhase);
      if (nextPhase !== 'void1' && nextPhase !== 'reveal') {
        playDeepBoom();
      }
    });
  };

  useEffect(() => {
    // Cinematic Timeline (approx 60 seconds)
    
    // 2s: RubyChat
    schedule(2000, () => { setPhase('RubyChat'); playDeepBoom(); });
    
    // 8s: Explode Ruby -> ObsidianChat
    schedule(8000, () => triggerExplosion('ObsidianChat', ['#ef4444', '#f97316', '#ffffff']));
    
    // 16s: Explode Obsidian -> SimpleChat
    schedule(16000, () => triggerExplosion('SimpleChat', ['#a855f7', '#3b82f6', '#18181b']));
    
    // 24s: Explode Simple -> EmeraldChat
    schedule(24000, () => triggerExplosion('EmeraldChat', ['#3b82f6', '#60a5fa', '#ffffff']));
    
    // 32s: Explode Emerald -> Void
    schedule(32000, () => triggerExplosion('void1', ['#10b981', '#34d399', '#ffffff']));

    // 38s: Void 2
    schedule(38000, () => setPhase('void2'));

    // 44s: Void 3
    schedule(44000, () => setPhase('void3'));

    // 50s: Reveal
    schedule(50000, () => {
      setPhase('reveal');
      playEpicHit();
    });

    // 54s: Show Button
    schedule(54000, () => setShowButton(true));

    return () => clearAllTimeouts();
  }, []);

  const handleSkip = () => {
    clearAllTimeouts();
    onComplete();
  };

  const renderCinematicText = (text: string) => (
    <motion.h2
      key={text}
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 3, ease: "easeOut" }}
      className="text-5xl md:text-8xl font-serif tracking-[0.2em] text-white/90 uppercase text-center px-4"
    >
      {text}
    </motion.h2>
  );

  const renderVoidText = (text: string) => (
    <motion.p
      key={text}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="text-2xl md:text-4xl font-light tracking-widest text-white/60 text-center px-4"
    >
      {text}
    </motion.p>
  );

  return (
    <div className="fixed inset-0 z-[9999] bg-[#030303] overflow-hidden pointer-events-auto flex items-center justify-center">
      
      {/* Film Grain Overlay */}
      <div 
        className="absolute inset-0 z-50 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      />

      {/* Explosion Flash Overlay */}
      <AnimatePresence>
        {isExploding && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-white z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main Content Container with Screen Shake */}
      <motion.div
        animate={isExploding ? { 
          x: [-20, 20, -20, 20, -10, 10, 0], 
          y: [-20, 20, -10, 10, -20, 20, 0] 
        } : { x: 0, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-30 w-full h-full flex flex-col items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {phase === 'RubyChat' && renderCinematicText('RubyChat')}
          {phase === 'ObsidianChat' && renderCinematicText('ObsidianChat')}
          {phase === 'SimpleChat' && renderCinematicText('SimpleChat')}
          {phase === 'EmeraldChat' && renderCinematicText('EmeraldChat')}
          
          {phase === 'void1' && renderVoidText('The old world is gone.')}
          {phase === 'void2' && renderVoidText('Everything is one.')}
          {phase === 'void3' && renderVoidText('Welcome to...')}

          {phase === 'reveal' && (
            <motion.div
              key="reveal"
              className="flex flex-col items-center justify-center space-y-12"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 2.5, ease: "easeOut", type: "spring", bounce: 0.3 }}
                className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                UNIFY CHAT
              </motion.h1>

              <AnimatePresence>
                {showButton && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.9)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      confetti({
                        particleCount: 150,
                        spread: 100,
                        origin: { y: 0.6 },
                        colors: ['#ffffff', '#a855f7', '#3b82f6']
                      });
                      setTimeout(handleSkip, 1500);
                    }}
                    className="px-10 py-4 bg-white text-black font-bold rounded-full text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
                  >
                    Start Chatting
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Skip Button */}
      <button 
        onClick={handleSkip}
        className="absolute bottom-6 right-6 z-50 text-white/20 hover:text-white/60 text-sm tracking-widest uppercase transition-colors"
      >
        Skip Intro
      </button>
    </div>
  );
};
