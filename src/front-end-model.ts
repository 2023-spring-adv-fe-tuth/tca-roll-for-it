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

	const winningSequences = groupedWinningSequences
		.map(x => 
			[...x]
				.map(
					y => `${y[0]} (${y[1]})`
				)
				.join(' + ')
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
		
		.map(x => ({
			winningSequence: x[0]
			, wins: x[1]
		}))

		// Dummy data didn't have turns, so don't show it.
		.filter(x => x.winningSequence.length > 0)
		
		.sort(
			(a, b) => a.wins < b.wins ? 1 : -1
		)
	;
};

export const getReverseChronGamesData = (results: GameResult[]) => {
	return results
		.map(
			x => ({
				date: new Date(x.end).toLocaleDateString()
				, msAgo: new Date().getTime() - new Date(x.end).getTime()
				, who: x.players.map(y => y.name).sort().join(", ") 
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