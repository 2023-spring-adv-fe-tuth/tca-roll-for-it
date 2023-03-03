//
// Interfaces...
//
export interface GameResult {
    winner: string;
    players: GamePlayer[];
};

export interface SetupInfo {
    start: string;
    players: string[];
}
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
  
//
// Func impls...
//
export const getPreviousPlayers: GetPreviousPlayersFunc = (grs: GameResult[]) => {
  
    const allPreviousPlayers = grs.flatMap(x => x.players.map(y => y.name));
    
    return [
        ...new Set(allPreviousPlayers)
    ].sort();
};
  
export const calculateLeaderboard = (results: GameResult[]) => {

    const gameResultsGroupedByPlayer = getPreviousPlayers(results).reduce(
        (acc, x) => acc.set(
            x
            , results.filter(y => y.players.map(z => z.name).some(a => a == x))
        )
        , new Map<string, GameResult[]>() 
    );

    return [...gameResultsGroupedByPlayer]

        // First object with names game counts and wins...
        .map(x => ({
            name: x[0]
            , totalGames: x[1].length
            , wins: x[1].filter(y => y.winner === x[0]).length
        }))
        
        // Now use wins and total games to get avg and losses
        .map(x => ({
            name: x.name
            , wins: x.wins 
            , losses: x.totalGames - x.wins
            , avg: x.wins / x.totalGames
        }))
        
        // Break average ties with total games...
        .sort(
            (a, b) => (a.avg * 1000 + a.wins + a.losses) > (b.avg * 1000 + b.wins + b.losses) ? -1 : 1
        )

        // Finally, convert average to a 3 digit string...
        .map(x => ({
            ...x
            , avg: x.avg.toFixed(3)
        }))
    ;
};
