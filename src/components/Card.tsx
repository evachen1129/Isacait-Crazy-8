import React from 'react';
import { motion } from 'motion/react';
import { CardData, Suit } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../constants';

interface CardProps {
  card?: CardData;
  isFaceDown?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ card, isFaceDown, onClick, isPlayable, className = '' }) => {
  if (isFaceDown) {
    return (
      <motion.div
        layout
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={onClick}
        className={`w-16 h-24 sm:w-24 sm:h-36 bg-[#2a1a1a] rounded-lg border-2 border-yellow-600/40 shadow-lg flex items-center justify-center relative overflow-hidden cursor-pointer ${className}`}
      >
        {/* Harry Potter Style Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
            backgroundSize: '12px 12px'
          }} />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 sm:w-16 sm:h-16 border-2 border-yellow-600/30 rounded-full flex flex-col items-center justify-center bg-[#1a0a0a] shadow-inner">
            <span className="text-yellow-600 font-black text-[10px] sm:text-sm leading-none">CRAZY</span>
            <span className="text-yellow-500 font-black text-lg sm:text-2xl leading-none">8</span>
          </div>
          <span className="text-[8px] sm:text-[10px] text-yellow-600/50 font-serif mt-2 tracking-widest uppercase">巫师世界</span>
        </div>

        {/* Corner Ornaments */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-yellow-600/30" />
        <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-yellow-600/30" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-yellow-600/30" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-yellow-600/30" />
      </motion.div>
    );
  }

  if (!card) return null;

  const colorClass = SUIT_COLORS[card.suit];
  const symbol = SUIT_SYMBOLS[card.suit];

  return (
    <motion.div
      layout
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={isPlayable ? { y: -10, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        w-16 h-24 sm:w-24 sm:h-36 bg-white rounded-lg border border-slate-200 shadow-md 
        flex flex-col justify-between p-1 sm:p-2 cursor-pointer relative
        ${isPlayable ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}
        ${!isPlayable && onClick ? 'opacity-60 grayscale-[0.5]' : ''}
        ${className}
      `}
    >
      <div className={`flex flex-col items-start leading-none ${colorClass}`}>
        <span className="text-xs sm:text-lg font-bold">{card.rank}</span>
        <span className="text-xs sm:text-sm">{symbol}</span>
      </div>
      
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-5xl ${colorClass}`}>
        {symbol}
      </div>

      <div className={`flex flex-col items-end leading-none rotate-180 ${colorClass}`}>
        <span className="text-xs sm:text-lg font-bold">{card.rank}</span>
        <span className="text-xs sm:text-sm">{symbol}</span>
      </div>
    </motion.div>
  );
};
