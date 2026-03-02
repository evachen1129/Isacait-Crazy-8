import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw } from 'lucide-react';

import { PlayerId } from '../types';

interface GameOverProps {
  winner: PlayerId | null;
  onReset: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ winner, onReset }) => {
  if (!winner) return null;

  const isPlayerWinner = winner === 'player';
  const winnerName = isPlayerWinner ? '你' : winner?.toUpperCase();

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
          <div className={`p-4 rounded-full ${isPlayerWinner ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-600'}`}>
            <Trophy size={48} />
          </div>
        </div>

        <h2 className="text-3xl font-black mb-2 text-slate-800">
          {isPlayerWinner ? '胜利！' : '游戏结束'}
        </h2>
        <p className="text-slate-500 mb-8">
          {isPlayerWinner ? '你率先清空了所有手牌。' : `${winnerName} 赢得了这场对决。`}
        </p>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          <RotateCcw size={20} />
          再玩一次
        </button>
      </motion.div>
    </motion.div>
  );
};
