//
// Interfaces...
//
export interface GameResult {
    winner: string;
    players: GamePlayer[];
};

export interface GamePlayer {
    name: string;
    order: number;
    turns?: any[];
}

export interface LeaderboardPlayer {
    name: string;
    wins: number;
    losses: number;
    avg: string;
}

//
// Func types...
//
export type GetPreviousPlayersFunc = (r: GameResult[]) => string[];
export type CalculateLeaderboardFunc = (r: GameResult[]) => LeaderboardPlayer[];
  
