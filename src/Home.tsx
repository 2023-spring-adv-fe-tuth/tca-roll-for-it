import { useNavigate } from "react-router-dom";
import { getFrenemiesData, LeaderboardPlayer } from "./front-end-model";
import { durationFormatter } from 'human-readable'

import chart from './chart.jpg';

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
	setTitle("Lorcana Log");

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
					<li className="step step-primary">Lorcana!</li>
					<li className="step step-primary">Log Your Time</li>
					<li className="step step-primary">Enjoy Fun Facts</li>
				</ul>
				<br />
				<button 
					className="btn btn-lg btn-primary capitalize mx-3 whitespace-nowrap"
					onClick={() => nav("/setup")}
				>
					Log Your Lorcana Activity
				</button>
				<br />
				<div
					className="flex"
				>
					<div className="card w-0 bg-base-100 shadow-xl grow">
						<div className="card-body p-3 overflow-x-hidden">
							<h2 className="card-title whitespace-nowrap uppercase text-2xl text-gray-400">
								INTERESTING TOTALS
							</h2>
							<table className="table w-full mt-1">
								<tbody>
									<tr>
										<td>
											Total Lorcana Time
										</td>
										<th>
											173h 22m 38s
										</th>
									</tr>
									<tr>
										<td className="ms-3">
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											Content Creating
										</td>
										<th>
											36h 17m 38s
										</th>
									</tr>
									<tr>
										<td className="ms-3">
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											Consuming Social Media
										</td>
										<th>
											16h 45m
										</th>
									</tr>
									<tr>
										<td className="ms-3">
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											Deck Building
										</td>
										<th>
											8h 15m
										</th>
									</tr>
									<tr>
										<td className="ms-3">
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											Playing
										</td>
										<th>
											6h 30m
										</th>
									</tr>
									<tr>
										<td className="ms-3">
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											Cracking Packs
										</td>
										<th>
											4h
										</th>
									</tr>
									<tr>
										<td className="ms-3">
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											Other
										</td>
										<th>
											2h 30m
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
							<h2 className="card-title whitespace-nowrap uppercase text-2xl text-gray-400">
								Community Comparisons
							</h2>
							<img 
								src={chart} 
								className="mt-5 w-100"
							/>

							{
								leaderBoardData.length > 0
								? (
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
								)
								: (
									<p
										className="text-left"
									>
										No leaderboard until you play a game...
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
								Average Game Times
							</h2>
							{
								avgGameLengths.length > 0
								? (
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
								)
								: (
									<p
										className="text-left"
									>
										Play some games...
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
										Play some games and see if a pattern emerges...
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
										No games, no dice returned, yet...
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
										Play a game of Roll for It!
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