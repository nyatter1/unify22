import { UserProfile, CardStyle } from '../types';
import { CARD_STYLES, BORDERS } from '../constants';
import { cn } from '../lib/utils';

export const getCardStyles = (u: UserProfile) => {
  const uCardStyles = [...CARD_STYLES, ...(u.customCardStyles || [])];
  const style = uCardStyles.find(s => s.id === u.cardStyle) || CARD_STYLES[0];
  
  if (style.isCustom && style.customStyles) {
    const { background, border, textColor, effect, fontFamily } = style.customStyles;
    let className = "flex items-center gap-4 group cursor-pointer p-3 rounded-2xl border transition-all";
    
    if (effect === 'glow') className += " shadow-[0_0_20px_rgba(255,255,255,0.2)]";
    if (effect === 'pulse') className += " animate-pulse";
    if (effect === 'glitch') className += " skew-x-1 -rotate-1";
    if (effect === 'neon') className += " shadow-[0_0_15px_rgba(255,255,255,0.4)]";
    if (effect === 'snake') className += " border-double border-4 animate-[spin_4s_linear_infinite]";
    if (effect === 'rainbow') className += " animate-[gradient_3s_linear_infinite] bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-[length:200%_auto]";

    const fontClass = fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : fontFamily === 'display' ? 'font-black tracking-tighter' : '';
    className += ` ${fontClass}`;

    return {
      className,
      style: {
        backgroundColor: background,
        borderColor: border,
        color: textColor,
      },
      textClass: "",
      custom: style.customStyles
    };
  }

  const userBorder = BORDERS.find(b => b.id === u.border);

  return {
    className: cn(
      "flex items-center gap-4 group cursor-pointer p-3 rounded-2xl border transition-all",
      style.bgClass,
      userBorder && userBorder.id !== 'border-none' ? userBorder.className : style.borderClass,
      style.animationClass
    ),
    style: {},
    textClass: style.textClass,
    custom: style.customStyles
  };
};
