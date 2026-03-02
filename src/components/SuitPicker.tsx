import React from 'react';
import { Suit } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS, SUITS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface SuitPickerProps {
  onPick: (suit: Suit) => void;
  isOpen: boolean;
}

export const SuitPicker: React.FC<SuitPickerProps> = ({ onPick, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
          >
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Wild 8! Pick a Suit</h2>
            <div className="grid grid-cols-2 gap-4">
              {SUITS.map((suit) => (
                <button
                  key={suit}
                  onClick={() => onPick(suit)}
                  className={`
                    flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-slate-100
                    hover:border-emerald-500 hover:bg-emerald-50 transition-all group
                  `}
                >
                  <span className={`text-4xl mb-2 ${SUIT_COLORS[suit]}`}>
                    {SUIT_SYMBOLS[suit]}
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 group-hover:text-emerald-700">
                    {suit}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
