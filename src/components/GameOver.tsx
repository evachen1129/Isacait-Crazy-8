import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverProps {
  winner: 'player' | 'ai' | null;
  onReset: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ winner, onReset }) => {
  if (!winner) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        className="bg-white rounded-3xl p-10 shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-blue-500" />
        
        <div className="mb-6 flex justify-center">
          <div className={`p-4 rounded-full ${winner === 'player' ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'}`}>
            <Trophy size={48} />
          </div>
        </div>

        <h2 className="text-3xl font-black mb-2 text-slate-800">
          {winner === 'player' ? 'Victory!' : 'Defeat!'}
        </h2>
        <p className="text-slate-500 mb-8">
          {winner === 'player' ? 'You cleared all your cards first.' : 'The AI outplayed you this time.'}
        </p>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          <RotateCcw size={20} />
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
};
