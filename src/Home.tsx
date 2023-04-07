import { useNavigate } from "react-router-dom";
import { getFrenemiesData, LeaderboardPlayer } from "./front-end-model";
import { durationFormatter } from 'human-readable'

interface HomeProps {
	leaderBoardData: LeaderboardPlayer[];
	shortestGame: number;
	longestGame: number;
	avgGameLengths: { playerCount: number, avgTime: number}[];
	setTitle: (title: string) => void;
	frenemiesData: any;
	winningSequenceData: any;
	pastGamesData: {date: string; msAgo: number; who: string}[];
	hmmData: {totalGamesPlayed: number; lastPlayedMsAgo: number;};
}

const format = durationFormatter();
const justDaysFormat = durationFormatter({
	allowMultiples: ["y", "mo", "d"]
});

export const Home: React.FC<HomeProps> = ({
	leaderBoardData
	, shortestGame
	, longestGame
	, avgGameLengths
	, setTitle
	, frenemiesData
	, winningSequenceData
	, pastGamesData
	, hmmData
}) => {

	console.log(
		"frenemiesData"
		, frenemiesData
	);
	setTitle("Roll for It");

	const nav = useNavigate();

	// Only for my one 'real' first game played with the app
	// if I decide to preserve the data for posterity ? ? ?
	const isWinningSequenceLessThanForty = (sequence: string): boolean => {

		const total = sequence
			.split(" + ")
			.map(x => Number(x))
			.reduce(
				(acc, x) => acc + x
				, 0
			)
		;

		return total < 40;
	}; 

	return (
		<div
			className=""
		>
			<div
				className="flex flex-col p-1"
			>
				<br />
				<ul className="steps">
					<li className="step step-primary">Play</li>
					<li className="step step-primary">Tap the App</li>
					<li className="step step-primary">Enjoy Fun Facts</li>
				</ul>
				<br />
				<button 
					className="btn btn-lg btn-primary capitalize mx-3 whitespace-nowrap"
					onClick={() => nav("/setup")}
				>
					Play Roll for It
				</button>
				<br />
				<div
					className="flex"
				>
					<div className="card w-0 bg-base-100 shadow-xl grow">
						<div className="card-body p-3 overflow-x-hidden">
							<h2 className="card-title whitespace-nowrap uppercase text-2xl text-gray-400">
								General
							</h2>
							<table className="table w-full mt-1">
								<tbody>
									<tr>
										<td>
											Last Played
										</td>
										<th>
											{`${justDaysFormat(hmmData.lastPlayedMsAgo)} ago`}
										</th>
									</tr>
									<tr>
										<td>
											Total Games
										</td>
										<th>
											{hmmData.totalGamesPlayed}
										</th>
									</tr>
									<tr>
										<td>
											Shortest Game
										</td>
										<th>
											{`${format(shortestGame)}`}
										</th>
									</tr>
									<tr>
										<td>
											Longest Game
										</td>
										<th>
											{`${format(longestGame)}`}
										</th>
									</tr>
								</tbody>
							</table>							
						</div>						
					</div>
				</div>
				<br />
				<div
					className="flex"
				>
					<div className="card w-0 bg-base-100 shadow-xl grow">
						<div className="card-body p-3 overflow-x-hidden">
							<h2 className="card-title whitespace-nowrap uppercase text-2xl text-gray-400">Leaderboard</h2>
							<table className="table w-full mt-3">
								<thead>
									<tr>
										<th>
											W
										</th>
										<th>
											L
										</th>
										<th>
											AVG
										</th>
										<th>
										</th>
									</tr>
								</thead>
								<tbody>
									{leaderBoardData.map(x => (
										<tr
											key={x.name}
										>
											<td>{x.wins}</td>
											<td>{x.losses}</td>
											<td>{x.avg}</td>
											<td>{x.name}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<br />
				<div
					className="flex"
				>
					<div className="card w-0 bg-base-100 shadow-xl grow">
						<div className="card-body p-3 overflow-x-hidden">
							<h2 className="card-title whitespace-nowrap uppercase text-2xl text-gray-400">Average Game Times</h2>
							<table className="table w-full mt-3">
								<thead>
									<tr>
										<th># PLAYERS</th>
										<th>AVG GAME LENGTH</th>
									</tr>
								</thead>
								<tbody>
									{avgGameLengths.map(x => (
										<tr
											key={x.playerCount}
										>
											<td>{x.playerCount}</td>
											<td>{`${format(x.avgTime)}`}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<br />
				<div
					className="flex"
				>
					<div className="card w-0 bg-base-100 shadow-xl grow">
						<div className="card-body p-3 overflow-x-hidden">
							<h2 className="card-title whitespace-nowrap uppercase text-2xl text-gray-400">
								Winning Sequences
							</h2>
							{
								winningSequenceData.length ? (
									<table className="table w-full mt-3">
										<thead>
											<tr>
												<th>SEQUENCE</th>
												<th># TIMES</th>
											</tr>
										</thead>
										<tbody>
											{winningSequenceData.map((x: any) => (
												<tr
													key={x.winningSequence}
												>
													<td className="whitespace-pre-wrap">
														{x.winningSequence}
														{ 
															isWinningSequenceLessThanForty(x.winningSequence) && <sup> *</sup>
														}
													</td>
													<td>{x.wins}</td>
												</tr>
											))}
										</tbody>
									</table>							

								) : (
									<p
										className="text-left"
									>
										No dice returned, yet ! ! !
									</p>
								)							
							}
						</div>
					</div>
				</div>  
				<br />
				<div
					className="flex"
				>
					<div className="card w-0 bg-base-100 shadow-xl grow">
						<div className="card-body p-3 overflow-x-hidden">
							<h2 className="card-title whitespace-nowrap uppercase text-2xl text-gray-400">
								Returned Dice
							</h2>
							{
								frenemiesData.length ? (
									<table className="table w-full mt-3">
										<thead>
											<tr>
												<th>Who -&gt; Whom</th>
												<th># TIMES</th>
											</tr>
										</thead>
										<tbody>
											{frenemiesData.map((x: any) => (
												<tr
													key={x[0]}
												>
													<td>{x[0]}</td>
													<td>{x[1]}</td>
												</tr>
											))}
										</tbody>
									</table>							

								) : (
									<p
										className="text-left"
									>
										No dice returned, yet ! ! !
									</p>
								)							
							}
						</div>
					</div>
				</div>  
				<br />
				<div
					className="flex"
				>
					<div className="card w-0 bg-base-100 shadow-xl grow">
						<div className="card-body p-3 overflow-x-hidden">
							<h2 className="card-title whitespace-nowrap uppercase text-2xl text-gray-400">
								All Games
							</h2>
							{
								pastGamesData.length ? (
									<table className="table w-full mt-3">
										<thead>
											<tr>
												<th className="text-left">WHEN</th>
												<th className="text-left">WHO</th>
											</tr>
										</thead>
										<tbody>
											{pastGamesData.map((x: any) => (
												<tr
													key={x.msAgo}
												>
													<td className="text-left whitespace-nowrap align-top text-ellipsis overflow-x-hidden">
														<p>
															{`${x.date}`}
														</p>
														<p
															className="text-xs"
														>
															{`${justDaysFormat(x.msAgo)} ago`}
														</p>
													</td>
													<td className="text-left whitespace-pre-wrap align-top">{x.who}</td>
												</tr>
											))}
										</tbody>
									</table>							

								) : (
									<p
										className="text-left"
									>
										No dice returned, yet ! ! !
									</p>
								)							
							}
						</div>
					</div>
				</div>  
			</div>
			<br />
	  </div>
	);
};