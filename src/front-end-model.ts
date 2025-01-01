//
// Interfaces...
//
export interface GameResult {
	
	start: string;
	end: string;

	winner: string;
	players: GamePlayer[];

	turns: GamePlayerTurn[];
};

export interface GamePlayer {
	name: string;
	order: number;
}

export interface GamePlayerTurn {
	name: string;
	start: string;
	end: string;
	cardsScored: CardScored[];
	tookBackDice?: boolean;
}

export type Points = 0 | 2 | 5 | 10 | 15;

export interface CardScored {
	timestamp: string;
	points: Points; // : number
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

export type LeaderboardEntry = {
    wins: number;
    losses: number;
    avg: string;
    name: string;  
};

//
// Func types...
//
export type GetPreviousPlayersFunc = (r: GameResult[]) => string[];
export type CalculateLeaderboardFunc = (r: GameResult[]) => LeaderboardPlayer[];
export type GetLongestGame = (results: GameResult[]) => number;
export type GetShortestGame = (results: GameResult[]) => number;
export type GetAverageGameLengthsByPlayerCount = (results: GameResult[]) => { playerCount: number, numGames: number, avgTime: number }[];
  
//
// Func impls...
//
export const getPreviousPlayers: GetPreviousPlayersFunc = (grs: GameResult[]) => {
  
	const allPreviousPlayers = grs.flatMap(x => x.players.map(y => y.name));
	
	return [
		...new Set(allPreviousPlayers)
	].sort();
};
  

const getLeaderboardEntry = (
    results: GameResult[]
    , player: string
): LeaderboardEntry => {

    const playerWins = results.filter(
        x => x.winner === player
    ).length;

    const playerGames = results.filter(
        x => x.players.some(
            y => y.name === player
        )
    ).length;

    return {
        wins: playerWins
        , losses: playerGames - playerWins 

        , avg: playerGames > 0
            ? (playerWins / playerGames).toFixed(3)
            : "0.000"

        , name: player
    };
};

export const calculateLeaderboard = (results: GameResult[]) => {

	const lbEntries = getPreviousPlayers(results).map((player) =>
		getLeaderboardEntry(results, player)
	  );
	  //
	  // Biz rule ! ! !
	  //
	  // Zero win players should be sorted differently...
	  //
	  // The more games you have without any wins make you a worse player ! ! !
	  //
	  // So filter and sort two lb entry arrays differently, i-o-g : - )
	  //
	  const playersWithWins = lbEntries
		.filter((x) => x.wins > 0)
		.sort(
		  (a, b) =>
			(parseFloat(b.avg) * 1000 + b.wins + b.losses) 
				- (parseFloat(a.avg) * 1000 + a.wins + a.losses)
		);
	
	  const playersWithoutWins = lbEntries
		.filter((x) => x.wins === 0)
		.sort(
		  (a, b) => a.losses - b.losses
		);
	
		return [
			...playersWithWins
			, ...playersWithoutWins
		];
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
			, numGames: x[1].length
			, avgTime: x[1].reduce((acc, x) => acc + x, 0) / x[1].length
		}))
		.sort(
			(a, b) => a.playerCount >= b.playerCount ? 1 : -1
		)
	;
};

export const getFrenemiesData = (results: GameResult[]) => {
	const playersMappedToPlayersDiceTheyReturned = results 
		.flatMap(
			x => x.turns.flatMap(
				y => y.cardsScored
					.filter(z => z.returnedDiceTo.length > 0)
					.map(z => ({
						player: y.name
						, returnedDiceTo: z.returnedDiceTo
					}))
			)
		)
		.reduce(
			(acc, x) => acc.set(
				x.player
				, [
					...(acc.get(x.player) ?? [])
					, ...x.returnedDiceTo
				]
			)
			, new Map<string, string[]>
		)
	;

	console.log("foo", playersMappedToPlayersDiceTheyReturned);

	const playersMappedToFenemiesWithTotalReturnDiceCount = [...playersMappedToPlayersDiceTheyReturned]
		.map(x => [
			x[0]
			, [
				...x[1].reduce(
					(acc, y) => acc.set(
						x[0] + " -> " + y
						, (acc.get(x[0] + " -> " + y) ?? 0) + 1
					)
					, new Map<string, number>()
				)
			]
		])
	;

	console.log("bar", playersMappedToFenemiesWithTotalReturnDiceCount);

	return playersMappedToFenemiesWithTotalReturnDiceCount
		.flatMap((x: any) => x[1])
		.sort((a, b) => a[1] > b[1] ? -1 : 1)
	;
};

export const getWinningSequenceData = (results: GameResult[]) => {

	const groupedWinningSequences = results.flatMap(
		x => x.turns
			.filter(y => y.name == x.winner)
			.flatMap(y => y.cardsScored)
			.map(y => y.points)
			.sort((a, b) => b - a)
			.reduce(
				(acc, x) => acc.set(
					x.toString()
					, (acc.get(x.toString()) ?? 0) + 1
				)
				, new Map<string, number>()
			)
	);
	
	// console.log(groupedWinningSequences);
	const winningSequenceTotals = groupedWinningSequences.map(
		x => [...x].reduce(
			(acc, y) => acc + (Number(y[0]) * y[1])
			, 0
		)
	);
	// console.log(winningSequenceTotals);

	const winningSequences = groupedWinningSequences
		.map(
			x => 
				[...x]
					.map(
						y => `${y[0]} (${y[1]})`
					)
					.join(' + ')
		)
		.map(
			(x, i) => `${x} = ${winningSequenceTotals[i]}${winningSequenceTotals[i] < 40 ? " **" : ""}`
		)
	;

	const groupedByWinningSequenceString = winningSequences.reduce(
		(acc, x) => acc.set(
			x
			, (acc.get(x) ?? 0) + 1
		)
		, new Map<string, number>
	);

	// console.log("getWinninSequenceData", groupedByWinningSequenceString);
	return [...groupedByWinningSequenceString]
		
		.map(
			(x, i) => ({
				winningSequence: x[0]
				, wins: x[1]
				, total: winningSequenceTotals[i]
			})
		)
		
		.sort(
			(a, b) => a.wins * 1000 + a.total < b.wins * 1000 + b.total ? 1 : -1
		)
	;
};

export const getReverseChronGamesData = (results: GameResult[]) => {
	return results
		.map(
			x => ({
				date: new Date(x.end).toLocaleDateString()
				, msAgo: new Date().getTime() - new Date(x.end).getTime()
				, who: x.players
					.map(
						y => y.name === x.winner ? `${y.name} (W)` : y.name
					)
					.sort()
					.join(", ") 
			})
		)
		.sort(
			(a, b) => a.msAgo < b.msAgo ? -1 : 1
		)
	;
};

export const getHmmData = (results: GameResult[]) => {

	return {
		totalGamesPlayed: results.length
		, lastPlayedMsAgo: Math.min(...results.map(x => Date.now() - new Date(x.end).getTime()))
	};
};

export const getTakeBackLeaderboard = (results: GameResult[]) => {

	const playersMappedToTakeBacks = results
		.flatMap(x => x.turns)
		.filter(x => x.tookBackDice)
		.reduce(
			(acc, x) => acc.set(
				x.name
				, (acc.get(x.name) ?? 0) + 1
			) 
			, new Map<string, number>()
		)
	;

	return [...playersMappedToTakeBacks]
		.map(x => ({
			name: x[0]
			, takeBacks: x[1]
		}))
		.sort(
			(a, b) => b.takeBacks - a.takeBacks
		)
	;
};