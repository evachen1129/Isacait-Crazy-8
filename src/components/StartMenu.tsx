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
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">艾萨凯特的疯狂 8</h1>
          <p className="text-yellow-600 font-serif italic">巫师世界的卡牌对决</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-yellow-500 font-bold uppercase text-xs tracking-widest">
              <BookOpen size={16} /> 游戏玩法
            </h3>
            <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
              <li>打出与弃牌堆顶部<b>花色</b>或<b>点数</b>相同的牌。</li>
              <li>如果没有可出的牌，从魔法牌堆中<b>摸牌</b>。</li>
              <li>第一位清空手牌的巫师获胜！</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-yellow-500 font-bold uppercase text-xs tracking-widest">
              <Zap size={16} /> 特殊规则
            </h3>
            <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
              <li><b>万能 8：</b>随时可以打出 8 并更改当前花色。</li>
              <li><b>无限摸牌：</b>可以一直摸牌直到摸到可出的牌。</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full group relative flex items-center justify-center gap-3 bg-yellow-600 hover:bg-yellow-500 text-[#1a2e1a] py-5 rounded-2xl font-black text-xl transition-all shadow-xl hover:shadow-yellow-600/20 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
          <Play fill="currentColor" />
          进入对决
        </button>
        
        <p className="text-center mt-6 text-[10px] text-slate-500 uppercase tracking-widest">
          经典游戏的魔法演绎
        </p>
      </div>
    </motion.div>
  );
};
