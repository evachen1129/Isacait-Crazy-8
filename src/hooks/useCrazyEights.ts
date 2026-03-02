import { useState, useCallback, useEffect } from 'react';
import { CardData, GameState, Suit, Rank, GameStatus } from '../types';
import { SUITS, RANKS, INITIAL_HAND_SIZE } from '../constants';

const createDeck = (): CardData[] => {
  const deck: CardData[] = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      deck.push({ id: `${rank}-${suit}`, suit, rank });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

export const useCrazyEights = () => {
  const [state, setState] = useState<GameState>(() => {
    const deck = createDeck();
    const playerHand = deck.splice(0, INITIAL_HAND_SIZE);
    const aiHand = deck.splice(0, INITIAL_HAND_SIZE);
    const firstDiscard = deck.pop()!;
    
    return {
      playerHand,
      aiHand,
      drawPile: deck,
      discardPile: [firstDiscard],
      currentSuit: firstDiscard.suit,
      currentRank: firstDiscard.rank,
      turn: 'player',
      status: 'menu',
      winner: null,
      lastAction: 'Welcome! Press Start to play.',
    };
  });

  const startGame = () => {
    setState(prev => ({ ...prev, status: 'playing' }));
  };

  const checkWinner = (newState: GameState) => {
    if (newState.playerHand.length === 0) {
      return { ...newState, status: 'game_over' as GameStatus, winner: 'player' as const };
    }
    if (newState.aiHand.length === 0) {
      return { ...newState, status: 'game_over' as GameStatus, winner: 'ai' as const };
    }
    return newState;
  };

  const drawCard = useCallback((target: 'player' | 'ai') => {
    setState((prev) => {
      if (prev.turn !== target || prev.status !== 'playing') return prev;
      
      if (prev.drawPile.length === 0) {
        // If deck is empty, switch turn
        return { 
          ...prev, 
          turn: target === 'player' ? 'ai' : 'player', 
          lastAction: `${target} passed (deck empty).` 
        };
      }

      const newDrawPile = [...prev.drawPile];
      const drawnCard = newDrawPile.pop()!;
      const newHand = target === 'player' ? [...prev.playerHand, drawnCard] : [...prev.aiHand, drawnCard];

      return {
        ...prev,
        drawPile: newDrawPile,
        [target === 'player' ? 'playerHand' : 'aiHand']: newHand,
        // Do NOT switch turn automatically. 
        // The player can play the drawn card if it matches, or draw again.
        lastAction: `${target} drew a card.`,
      };
    });
  }, []);

  const playCard = useCallback((card: CardData, target: 'player' | 'ai') => {
    setState((prev) => {
      if (prev.turn !== target || prev.status !== 'playing') return prev;

      const isMatch = card.rank === '8' || card.suit === prev.currentSuit || card.rank === prev.currentRank;
      if (!isMatch) return prev;

      const handKey = target === 'player' ? 'playerHand' : 'aiHand';
      const newHand = prev[handKey].filter((c) => c.id !== card.id);
      const newDiscardPile = [...prev.discardPile, card];

      let nextStatus: GameStatus = 'playing';
      let nextTurn = target === 'player' ? 'ai' : 'player';

      if (card.rank === '8') {
        nextStatus = 'suit_picking';
        // If AI plays 8, we'll handle suit picking automatically in a separate effect or logic
      }

      const newState: GameState = {
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscardPile,
        currentSuit: card.suit,
        currentRank: card.rank,
        status: nextStatus,
        turn: nextStatus === 'suit_picking' ? target : (target === 'player' ? 'ai' : 'player'),
        lastAction: `${target} played ${card.rank} of ${card.suit}.`,
      };

      return checkWinner(newState);
    });
  }, []);

  const pickSuit = useCallback((suit: Suit) => {
    setState((prev) => {
      if (prev.status !== 'suit_picking') return prev;
      return {
        ...prev,
        currentSuit: suit,
        status: 'playing',
        turn: prev.turn === 'player' ? 'ai' : 'player',
        lastAction: `${prev.turn} picked ${suit}.`,
      };
    });
  }, []);

  const resetGame = () => {
    const deck = createDeck();
    const playerHand = deck.splice(0, INITIAL_HAND_SIZE);
    const aiHand = deck.splice(0, INITIAL_HAND_SIZE);
    const firstDiscard = deck.pop()!;
    
    setState({
      playerHand,
      aiHand,
      drawPile: deck,
      discardPile: [firstDiscard],
      currentSuit: firstDiscard.suit,
      currentRank: firstDiscard.rank,
      turn: 'player',
      status: 'playing',
      winner: null,
      lastAction: 'Game reset! Your turn.',
    });
  };

  // AI Logic
  useEffect(() => {
    if (state.turn === 'ai' && state.status === 'playing' && !state.winner) {
      const timer = setTimeout(() => {
        const playableCards = state.aiHand.filter(
          (c) => c.rank === '8' || c.suit === state.currentSuit || c.rank === state.currentRank
        );

        if (playableCards.length > 0) {
          // AI plays the first playable card
          const cardToPlay = playableCards[0];
          playCard(cardToPlay, 'ai');
        } else {
          drawCard('ai');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.turn, state.status, state.aiHand, state.currentSuit, state.currentRank, state.winner, playCard, drawCard]);

  // AI Suit Picking
  useEffect(() => {
    if (state.turn === 'ai' && state.status === 'suit_picking') {
      const timer = setTimeout(() => {
        // AI picks the suit it has the most of
        const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
        state.aiHand.forEach((c) => suitCounts[c.suit]++);
        const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => 
          suitCounts[a] > suitCounts[b] ? a : b
        );
        pickSuit(bestSuit);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.turn, state.status, state.aiHand, pickSuit]);

  return { state, playCard, drawCard, pickSuit, resetGame, startGame };
};
