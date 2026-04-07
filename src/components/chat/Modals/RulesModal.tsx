import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Theme } from '../../../types';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] transition-all",
              currentTheme.customStyles?.glassEffect ? "backdrop-blur-3xl bg-black/40" : "bg-zinc-900",
              currentTheme.customStyles?.bubbleStyle === 'sharp' ? "rounded-none" : "rounded-3xl",
              currentTheme.customStyles?.borderStyle ? "" : "border border-white/10"
            )}
            style={{ border: currentTheme.customStyles?.borderStyle || undefined }}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-serif italic text-white">Rules</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/60">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-amber-500 mb-4 uppercase tracking-widest">Staff Rules</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>Do not abuse your power.</li>
                  <li>Treat all members with respect.</li>
                  <li>Only use commands when necessary.</li>
                  <li>Keep the chat safe and friendly.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-4 uppercase tracking-widest">Member Rules</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li>Be respectful to everyone.</li>
                  <li>No spamming or flooding the chat.</li>
                  <li>No NSFW content.</li>
                  <li>Listen to staff members.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
