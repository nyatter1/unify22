import React from 'react';
import { Send, Volume2, VolumeX, BarChart2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (s: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  soundEnabled: boolean;
  setSoundEnabled: (s: boolean) => void;
  setShowPollModal: (s: boolean) => void;
}

export const ChatInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  soundEnabled,
  setSoundEnabled,
  setShowPollModal
}: ChatInputProps) => {
  return (
    <div className="p-8 pt-0">
      <form
        onSubmit={handleSendMessage}
        className="flex gap-3 p-2 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-3xl shadow-2xl"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Share your thoughts or try /roll..."
          className="flex-1 bg-transparent px-6 py-3 focus:outline-none text-white placeholder:text-white/20 text-sm"
        />
        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={cn(
            "px-4 transition-colors",
            soundEnabled ? "text-amber-500 hover:text-amber-400" : "text-white/40 hover:text-white"
          )}
          title={soundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <button
          type="button"
          onClick={() => setShowPollModal(true)}
          className="px-4 text-white/40 hover:text-white transition-colors"
        >
          <BarChart2 className="w-5 h-5" />
        </button>
        <button
          type="submit"
          className="group relative px-6 rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          <div className="absolute inset-0 bg-white" />
          <div className="relative flex items-center justify-center text-black">
            <Send className="w-5 h-5" />
          </div>
        </button>
      </form>
    </div>
  );
};
