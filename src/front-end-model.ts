export interface GameResult {
    winner: string;
    players: string[];
};

export type GetPreviousPlayers = (r: GameResult[]) => string[];

export interface LeaderboardPlayer {
    name: string;
    wins: number;
    losses: number;
    avg: string;
}

export type CalculateLeaderboardFunc = (r: GameResult[]) => LeaderboardPlayer[];

export type AddGameResultFunc = (r: GameResult) => void;
  
