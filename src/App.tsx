import { useCrazyEights } from './hooks/useCrazyEights';
import { Card } from './components/Card';
import { SuitPicker } from './components/SuitPicker';
import { GameOver } from './components/GameOver';
import { StartMenu } from './components/StartMenu';
import { SUIT_SYMBOLS, SUIT_COLORS } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { Info, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  const { state, playCard, drawCard, pickSuit, resetGame, startGame } = useCrazyEights();

  const topDiscard = state.discardPile[state.discardPile.length - 1];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col relative">
      {/* Starry Sky Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-cover bg-center"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop')`,
        }}
      />
      
      <AnimatePresence>
        {state.status === 'menu' && <StartMenu onStart={startGame} />}
      </AnimatePresence>

      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-white/10 bg-black/40 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="font-black text-xl">8</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">Isacait's Crazy Eight</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-semibold">Standard 52-Card Edition</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase opacity-50 font-bold">Current Suit</span>
            <div className={`flex items-center gap-1 font-bold ${SUIT_COLORS[state.currentSuit]}`}>
              <span className="text-xl">{SUIT_SYMBOLS[state.currentSuit]}</span>
              <span className="capitalize">{state.currentSuit}</span>
            </div>
          </div>
          <button 
            onClick={resetGame}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Reset Game"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-1 relative flex flex-col p-4 sm:p-8 gap-8">
        
        {/* AI Hand */}
        <section className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">AI Opponent</span>
            <div className="h-px w-12 bg-white/10" />
            <span className="bg-white/10 px-2 py-0.5 rounded text-xs font-mono">{state.aiHand.length} Cards</span>
          </div>
          <div className="flex -space-x-8 sm:-space-x-12 hover:-space-x-4 sm:hover:-space-x-6 transition-all duration-300">
            {state.aiHand.map((_, i) => (
              <Card key={i} isFaceDown className="shadow-2xl" />
            ))}
          </div>
        </section>

        {/* Center Area (Deck & Discard) */}
        <section className="flex-1 flex items-center justify-center gap-8 sm:gap-16">
          {/* Draw Pile */}
          <div className="flex flex-col items-center gap-3 group">
            <div className="relative">
              {/* Stack effect */}
              <div className="absolute inset-0 translate-x-1 translate-y-1 bg-indigo-900 rounded-lg border border-white/10" />
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-indigo-950 rounded-lg border border-white/10" />
              <Card 
                isFaceDown 
                onClick={() => state.turn === 'player' && drawCard('player')}
                className={`
                  relative z-10 transition-transform active:scale-95
                  ${state.turn === 'player' ? 'cursor-pointer hover:-translate-y-2 ring-2 ring-emerald-400 ring-offset-4 ring-offset-[#1a2e1a]' : 'opacity-50'}
                `}
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold opacity-50">
              <Layers size={14} />
              <span>{state.drawPile.length}</span>
            </div>
          </div>

          {/* Discard Pile */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {/* Previous cards in discard pile (visual only) */}
              {state.discardPile.slice(-3, -1).map((card, i) => (
                <div 
                  key={card.id}
                  className="absolute inset-0 bg-white rounded-lg border border-slate-200 opacity-20"
                  style={{ transform: `rotate(${(i + 1) * 5}deg) translate(${i * 2}px, ${i * 2}px)` }}
                />
              ))}
              <Card card={topDiscard} className="relative z-10 shadow-2xl" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Discard Pile</span>
              <div className={`text-sm font-bold ${SUIT_COLORS[state.currentSuit]}`}>
                {SUIT_SYMBOLS[state.currentSuit]} {state.currentSuit.toUpperCase()}
              </div>
            </div>
          </div>
        </section>

        {/* Player Hand */}
        <section className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-px w-12 bg-white/10" />
            <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Your Hand</span>
            <div className="h-px w-12 bg-white/10" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-4xl">
            <AnimatePresence mode="popLayout">
              {state.playerHand.map((card) => {
                const isPlayable = state.turn === 'player' && state.status === 'playing' && (
                  card.rank === '8' || card.suit === state.currentSuit || card.rank === state.currentRank
                );
                return (
                  <Card 
                    key={card.id} 
                    card={card} 
                    isPlayable={isPlayable}
                    onClick={() => playCard(card, 'player')}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Footer / Status Bar */}
      <footer className="p-4 bg-black/40 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${state.turn === 'player' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <p className="text-sm font-medium">
            {state.turn === 'player' ? "Your Turn" : "AI is thinking..."}
          </p>
          <div className="h-4 w-px bg-white/20" />
          <p className="text-xs opacity-70 italic">{state.lastAction}</p>
        </div>

        <div className="flex items-center gap-4">
          {state.turn === 'player' && state.drawPile.length === 0 && (
            <button
              onClick={() => drawCard('player')}
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              Pass Turn
            </button>
          )}
          <div className="flex items-center gap-2">
            <Info size={14} className="opacity-50" />
            <span className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">Wild 8s change suit</span>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <SuitPicker 
        isOpen={state.status === 'suit_picking' && state.turn === 'player'} 
        onPick={pickSuit} 
      />
      <GameOver 
        winner={state.winner} 
        onReset={resetGame} 
      />
    </div>
  );
}
