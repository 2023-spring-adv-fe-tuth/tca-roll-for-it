export interface GameResult {
    winner: string;
    players: string[];
};

export type AddGameResultFunc = (r: GameResult) => void;
  