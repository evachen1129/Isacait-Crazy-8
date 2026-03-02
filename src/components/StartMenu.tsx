import React from 'react';
import { motion } from 'motion/react';
import { Play, BookOpen, Shield, Zap, Sparkles } from 'lucide-react';

interface StartMenuProps {
  onStart: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a110a] p-4 overflow-y-auto"
    >
      <div className="max-w-2xl w-full bg-[#1a2e1a] border-2 border-yellow-600/30 rounded-3xl p-8 shadow-2xl relative">
        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 text-yellow-600/20"><Sparkles size={64} /></div>
        <div className="absolute -bottom-6 -right-6 text-yellow-600/20"><Sparkles size={64} /></div>

        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-block p-3 bg-yellow-600/10 rounded-2xl mb-4"
          >
            <Shield className="text-yellow-600" size={48} />
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Isacait's Crazy Eight</h1>
          <p className="text-yellow-600 font-serif italic">The Wizarding Card Challenge</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-yellow-500 font-bold uppercase text-xs tracking-widest">
              <BookOpen size={16} /> How to Play
            </h3>
            <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
              <li>Match the <b>Suit</b> or <b>Rank</b> of the top card.</li>
              <li>If you can't play, <b>Draw</b> from the magical deck.</li>
              <li>First wizard to clear their hand wins!</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-yellow-500 font-bold uppercase text-xs tracking-widest">
              <Zap size={16} /> Special Rules
            </h3>
            <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
              <li><b>Wild 8s:</b> Play an 8 anytime to change the current suit.</li>
              <li><b>Infinite Draw:</b> Draw until you find a playable card.</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full group relative flex items-center justify-center gap-3 bg-yellow-600 hover:bg-yellow-500 text-[#1a2e1a] py-5 rounded-2xl font-black text-xl transition-all shadow-xl hover:shadow-yellow-600/20 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
          <Play fill="currentColor" />
          ENTER THE DUEL
        </button>
        
        <p className="text-center mt-6 text-[10px] text-slate-500 uppercase tracking-widest">
          A Magical Twist on a Classic Game
        </p>
      </div>
    </motion.div>
  );
};
