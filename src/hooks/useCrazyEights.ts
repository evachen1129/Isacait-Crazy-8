import { useState, useCallback, useEffect } from 'react';
import { CardData, GameState, Suit, Rank, GameStatus, PlayerId } from '../types';
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

const getNextTurn = (current: PlayerId): PlayerId => {
  if (current === 'player') return 'ai1';
  if (current === 'ai1') return 'ai2';
  return 'player';
};

const getHandKey = (player: PlayerId): 'playerHand' | 'ai1Hand' | 'ai2Hand' => {
  if (player === 'player') return 'playerHand';
  if (player === 'ai1') return 'ai1Hand';
  return 'ai2Hand';
};

export const useCrazyEights = () => {
  const [state, setState] = useState<GameState>(() => {
    const deck = createDeck();
    const playerHand = deck.splice(0, INITIAL_HAND_SIZE);
    const ai1Hand = deck.splice(0, INITIAL_HAND_SIZE);
    const ai2Hand = deck.splice(0, INITIAL_HAND_SIZE);
    const firstDiscard = deck.pop()!;
    
    return {
      playerHand,
      ai1Hand,
      ai2Hand,
      drawPile: deck,
      discardPile: [firstDiscard],
      currentSuit: firstDiscard.suit,
      currentRank: firstDiscard.rank,
      turn: 'player',
      status: 'menu',
      winner: null,
      lastAction: '欢迎！点击开始游戏。',
    };
  });

  const startGame = () => {
    setState(prev => ({ ...prev, status: 'playing' }));
  };

  const checkWinner = (newState: GameState) => {
    if (newState.playerHand.length === 0) {
      return { ...newState, status: 'game_over' as GameStatus, winner: 'player' as const };
    }
    if (newState.ai1Hand.length === 0) {
      return { ...newState, status: 'game_over' as GameStatus, winner: 'ai1' as const };
    }
    if (newState.ai2Hand.length === 0) {
      return { ...newState, status: 'game_over' as GameStatus, winner: 'ai2' as const };
    }
    return newState;
  };

  const drawCard = useCallback((target: PlayerId) => {
    setState((prev) => {
      if (prev.turn !== target || prev.status !== 'playing') return prev;
      
      if (prev.drawPile.length === 0) {
        // If deck is empty, switch turn
        return { 
          ...prev, 
          turn: getNextTurn(target), 
          lastAction: `${target === 'player' ? '你' : target} 跳过了回合 (牌堆已空)。` 
        };
      }

      const newDrawPile = [...prev.drawPile];
      const drawnCard = newDrawPile.pop()!;
      const handKey = getHandKey(target);
      const newHand = [...prev[handKey], drawnCard];

      return {
        ...prev,
        drawPile: newDrawPile,
        [handKey]: newHand,
        lastAction: `${target === 'player' ? '你' : target} 摸了一张牌。`,
      };
    });
  }, []);

  const playCard = useCallback((card: CardData, target: PlayerId) => {
    setState((prev) => {
      if (prev.turn !== target || prev.status !== 'playing') return prev;

      const isMatch = card.rank === '8' || card.suit === prev.currentSuit || card.rank === prev.currentRank;
      if (!isMatch) return prev;

      const handKey = getHandKey(target);
      const newHand = prev[handKey].filter((c) => c.id !== card.id);
      const newDiscardPile = [...prev.discardPile, card];

      let nextStatus: GameStatus = 'playing';

      if (card.rank === '8') {
        nextStatus = 'suit_picking';
      }

      const newState: GameState = {
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscardPile,
        currentSuit: card.suit,
        currentRank: card.rank,
        status: nextStatus,
        turn: nextStatus === 'suit_picking' ? target : getNextTurn(target),
        lastAction: `${target === 'player' ? '你' : target} 打出了 ${card.rank} (${card.suit})。`,
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
        turn: getNextTurn(prev.turn),
        lastAction: `${prev.turn === 'player' ? '你' : prev.turn} 选择了 ${suit}。`,
      };
    });
  }, []);

  const resetGame = () => {
    const deck = createDeck();
    const playerHand = deck.splice(0, INITIAL_HAND_SIZE);
    const ai1Hand = deck.splice(0, INITIAL_HAND_SIZE);
    const ai2Hand = deck.splice(0, INITIAL_HAND_SIZE);
    const firstDiscard = deck.pop()!;
    
    setState({
      playerHand,
      ai1Hand,
      ai2Hand,
      drawPile: deck,
      discardPile: [firstDiscard],
      currentSuit: firstDiscard.suit,
      currentRank: firstDiscard.rank,
      turn: 'player',
      status: 'playing',
      winner: null,
      lastAction: '游戏重置！轮到你了。',
    });
  };

  // AI Logic
  useEffect(() => {
    if (state.turn !== 'player' && state.status === 'playing' && !state.winner) {
      const currentAI = state.turn;
      const handKey = getHandKey(currentAI);
      const hand = state[handKey];

      const timer = setTimeout(() => {
        const playableCards = hand.filter(
          (c) => c.rank === '8' || c.suit === state.currentSuit || c.rank === state.currentRank
        );

        if (playableCards.length > 0) {
          const cardToPlay = playableCards[0];
          playCard(cardToPlay, currentAI);
        } else {
          drawCard(currentAI);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.turn, state.status, state.playerHand, state.ai1Hand, state.ai2Hand, state.currentSuit, state.currentRank, state.winner, playCard, drawCard]);

  // AI Suit Picking
  useEffect(() => {
    if (state.turn !== 'player' && state.status === 'suit_picking') {
      const currentAI = state.turn;
      const handKey = getHandKey(currentAI);
      const hand = state[handKey];

      const timer = setTimeout(() => {
        const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
        hand.forEach((c) => suitCounts[c.suit]++);
        const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => 
          suitCounts[a] > suitCounts[b] ? a : b
        );
        pickSuit(bestSuit);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.turn, state.status, state.playerHand, state.ai1Hand, state.ai2Hand, pickSuit]);

  return { state, playCard, drawCard, pickSuit, resetGame, startGame };
};
