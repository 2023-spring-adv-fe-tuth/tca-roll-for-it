//
// Interfaces...
//
export interface GameResult {
    
    start: string;
    end: string;

    winner: string;
    players: GamePlayer[];
};

export interface GamePlayer {
    name: string;
    order: number;

    turns?: GamePlayerTurn[];
}

export interface GamePlayerTurn {
    start: string;
    end: string;
    cardsScored: CardScored[];
}

export interface CardScored {
    timestamp: string;
    points: 2 | 5 | 10 | 15; // : number
    returnedDiceTo: string[];
}

export interface LeaderboardPlayer {
    name: string;
    wins: number;
    losses: number;
    avg: string;
}

export interface SetupInfo {
    start: string;
    players: string[];
}

//
// Func types...
//
export type GetPreviousPlayersFunc = (r: GameResult[]) => string[];
export type CalculateLeaderboardFunc = (r: GameResult[]) => LeaderboardPlayer[];
export type GetLongestGame = (results: GameResult[]) => number;
export type GetShortestGame = (results: GameResult[]) => number;
export type GetAverageGameLengthsByPlayerCount = (results: GameResult[]) => { playerCount: number, avgTime: number }[];
  
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

export const getLongestGame: GetLongestGame = (results) => Math.max(...results.map(x => new Date(x.end).getTime() - new Date(x.start).getTime()));
export const getShortestGame: GetShortestGame = (results) => Math.min(...results.map(x => new Date(x.end).getTime() - new Date(x.start).getTime()));

export const getAvgGameLengths: GetAverageGameLengthsByPlayerCount = (results) => {

    const gameDurationsGroupedByNumberOfPlayers = results.reduce(
        (acc, x) => acc.set(
            x.players.length
            , [
                ...acc.get(x.players.length) ?? []
                , new Date(x.end).getTime() - new Date(x.start).getTime()
            ]
        )
        , new Map<number, number[]>()
    );

    return [...gameDurationsGroupedByNumberOfPlayers]
        .map(x => ({
            playerCount: x[0]
            , avgTime: x[1].reduce((acc, x) => acc + x, 0) / x[1].length
        }))
        .sort(
            (a, b) => a.playerCount >= b.playerCount ? 1 : -1
        )
    ;
};
