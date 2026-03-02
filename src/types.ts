export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardData {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type GameStatus = 'menu' | 'playing' | 'suit_picking' | 'game_over';

export type PlayerId = 'player' | 'ai1' | 'ai2';

export interface GameState {
  playerHand: CardData[];
  ai1Hand: CardData[];
  ai2Hand: CardData[];
  drawPile: CardData[];
  discardPile: CardData[];
  currentSuit: Suit;
  currentRank: Rank;
  turn: PlayerId;
  status: GameStatus;
  winner: PlayerId | null;
  lastAction: string;
}
