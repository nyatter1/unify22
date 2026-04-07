import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  expanded: boolean;
  badge?: number;
  variant?: 'default' | 'danger';
}

export const SidebarItem = ({
  icon,
  label,
  onClick,
  expanded,
  badge,
  variant = 'default'
}: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative",
      expanded ? "px-4" : "justify-center",
      variant === 'danger'
        ? "text-red-400 hover:bg-red-500/10 hover:text-red-500"
        : "text-white/60 hover:bg-white/5 hover:text-white"
    )}
  >
    <div className="flex-shrink-0">{icon}</div>
    {expanded && (
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-xs font-bold uppercase tracking-widest whitespace-nowrap"
      >
        {label}
      </motion.span>
    )}
    {badge !== undefined && badge > 0 && (
      <div className={cn(
        "absolute bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-black",
        expanded ? "right-4 w-5 h-5" : "top-2 right-2 w-4 h-4"
      )}>
        {badge}
      </div>
    )}
    {!expanded && (
      <div className="absolute left-full ml-4 px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
        {label}
      </div>
    )}
  </button>
);
