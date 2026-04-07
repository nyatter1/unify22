import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Palette, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ThemeEditorModalProps {
  showThemeEditor: boolean;
  setShowThemeEditor: (s: boolean) => void;
  customThemeInput: any;
  setCustomThemeInput: (t: any) => void;
  saveCustomTheme: () => void;
}

export const ThemeEditorModal = ({
  showThemeEditor,
  setShowThemeEditor,
  customThemeInput,
  setCustomThemeInput,
  saveCustomTheme
}: ThemeEditorModalProps) => {
  return (
    <AnimatePresence>
      {showThemeEditor && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowThemeEditor(false)}
            className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/10">
                  <Palette className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif italic text-white">Theme Designer</h2>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Create your visual experience</p>
                </div>
              </div>
              <button
                onClick={() => setShowThemeEditor(false)}
                className="p-3 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Theme Name</p>
                <input
                  type="text"
                  value={customThemeInput.name}
                  onChange={(e) => setCustomThemeInput({ ...customThemeInput, name: e.target.value })}
                  placeholder="My Awesome Theme..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Background (Color or Image URL)</p>
                <input
                  type="text"
                  value={customThemeInput.background}
                  onChange={(e) => setCustomThemeInput({ ...customThemeInput, background: e.target.value })}
                  placeholder="#000000 or https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Text Color</p>
                  <select
                    value={customThemeInput.textColor}
                    onChange={(e) => setCustomThemeInput({ ...customThemeInput, textColor: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none"
                  >
                    <option value="text-white">White</option>
                    <option value="text-zinc-400">Zinc</option>
                    <option value="text-amber-500">Amber</option>
                    <option value="text-black">Black</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Bubble Style</p>
                  <select
                    value={customThemeInput.customStyles.bubbleStyle}
                    onChange={(e) => setCustomThemeInput({
                      ...customThemeInput,
                      customStyles: { ...customThemeInput.customStyles, bubbleStyle: e.target.value }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none"
                  >
                    <option value="rounded">Rounded</option>
                    <option value="sharp">Sharp</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex flex-col">
                  <p className="text-white font-bold text-sm">Glass Effect</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Enable backdrop blur</p>
                </div>
                <button
                  onClick={() => setCustomThemeInput({
                    ...customThemeInput,
                    customStyles: { ...customThemeInput.customStyles, glassEffect: !customThemeInput.customStyles.glassEffect }
                  })}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    customThemeInput.customStyles.glassEffect ? "bg-amber-500" : "bg-white/10"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                    customThemeInput.customStyles.glassEffect ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-black/20">
              <button
                onClick={saveCustomTheme}
                className="w-full py-5 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-[0_0_40px_rgba(245,158,11,0.3)]"
              >
                Save Theme
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
