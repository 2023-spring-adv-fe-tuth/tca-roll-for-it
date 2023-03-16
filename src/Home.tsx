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
}

const format = durationFormatter();

export const Home: React.FC<HomeProps> = ({
	leaderBoardData
	, shortestGame
	, longestGame
	, avgGameLengths
	, setTitle
	, frenemiesData
}) => {

	console.log(
		"frenemiesData"
		, frenemiesData
	);
	setTitle("Roll for It");

	const nav = useNavigate();

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
					className="btn btn-lg btn-primary capitalize mx-3"
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
							<h2 className="card-title uppercase text-2xl text-gray-400">Leaderboard</h2>
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
					<div className="card w-96 bg-base-100 shadow-xl grow">
						<div className="card-body p-3 overflow-x-hidden">
							<h2 className="card-title uppercase text-2xl text-gray-400">Game Time Facts</h2>
							<p
								className="text-md font-light text-left mt-1 ml-3"
							>
								<span
									className="font-semibold mr-1"
								>
									{`${format(shortestGame)}`}
								</span> 
								shortest game ever
							</p>
							<p
								className="text-md font-light text-left ml-3"
							>
								<span
									className="font-semibold mr-1"
								>
									{`${format(longestGame)}`}
								</span> 
								longest game ever
							</p>
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
					<div className="card w-96 bg-base-100 shadow-xl grow">
						<div className="card-body p-3 overflow-x-hidden">
							<h2 className="card-title uppercase text-2xl text-gray-400">
								Frenemies
							</h2>
							<table className="table w-full mt-3">
								<thead>
									<tr>
										<th></th>
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
						</div>
					</div>
				</div>  
				<br />
				<div
					className="flex"
				>
					<div className="card w-96 bg-base-100 shadow-xl grow">
						<div className="card-body p-3 overflow-x-hidden">
							<h2 className="card-title uppercase text-2xl text-gray-400">
								Winning Sequences
							</h2>
						</div>
					</div>
				</div>  
			</div>
			<br />
	  </div>
	);
};