import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	GamePlayer
	, GameResult
	, SetupInfo
	, Points
	, GamePlayerTurn,
	getFrenemiesData
} from "./front-end-model";
import copy from 'clipboard-copy';

interface PlayProps {
	setupInfo: SetupInfo;
	addGameResult: (r: GameResult) => void;
	setTitle: (title: string) => void;
	showLess: boolean;
	setShowLess: any;
}

enum ShowDrawerReason {
	None
	, ChoosePlayerOrder
	, ScoreCard
};

export const Play: React.FC<PlayProps> = ({
	setupInfo
	, addGameResult
	, setTitle
	, showLess
	, setShowLess
}) => {

	const defaultTurn = {
		name: ""
		, start: new Date().toISOString()
		, end: ""
		, cardsScored: []
		, tookBackDice: false
	};

	console.log(setupInfo.start);

	const [currentPlayers, setCurrentPlayers]
		= useState<GamePlayer[]>([]);

	const [activePlayer, setActivePlayer]
		= useState<GamePlayer | undefined>(undefined);

	const [scoreCard, setScoreCard]
		= useState<Points | undefined>(undefined);

	const [currentTurn, setCurrentTurn]
		= useState<GamePlayerTurn>();

	const [turns, setTurns]
		= useState<GamePlayerTurn[]>([]);

	const [returnedTo, setReturnedTo] =
		useState<string[]>([]);

	setTitle(`Turn ${Math.floor(turns.length / setupInfo.players.length) + 1}`);

	const showDrawerReason =

		// If no active player and not all players order chosen
		!activePlayer && setupInfo.players.length != currentPlayers.length
			? ShowDrawerReason.ChoosePlayerOrder

			// Else if active player and scoring a card
			: activePlayer && scoreCard
				? ShowDrawerReason.ScoreCard

				// Otherwise, don't show drawer
				: ShowDrawerReason.None
		;

	const nav = useNavigate();

	const done = (winner: string) => {
		
		const newResult = {
			winner: winner
			, players: currentPlayers
			, start: setupInfo.start
			, end: new Date().toISOString()
			, turns: [
				...turns
				, {
					name: currentTurn?.name ?? ""
					, start: currentTurn?.start ?? ""
					, cardsScored: [
						...(currentTurn?.cardsScored ?? [])
						, {
							timestamp: new Date().toISOString()
							, points: scoreCard ?? 0
							, returnedDiceTo: returnedTo
						}
					]
					, end: new Date().toISOString()
					, tookBackDice: currentTurn?.tookBackDice ?? false
				}
			]
		};

		copy(JSON.stringify(newResult));
		
		addGameResult(newResult);

		nav(-2);
	};

	const playerOrderChosen = (chosenPlayerName: string) => {

		const chosenPlayerNumber = currentPlayers.length + 1;

		const nextPlayer = {
			name: chosenPlayerName
			, order: chosenPlayerNumber
		};

		const playersRemainingAfterAddingChosenPlayer = setupInfo.players
			.filter(
				x => x !== chosenPlayerName
					&& !currentPlayers.some(y => y.name === x)
			)
		;

		const lastPlayer = playersRemainingAfterAddingChosenPlayer.length == 1
			? {
				name: playersRemainingAfterAddingChosenPlayer[0]
				, order: chosenPlayerNumber + 1
			}
			: undefined
		;

		setCurrentPlayers([
			...currentPlayers
			, nextPlayer
			, ...(lastPlayer ? [lastPlayer] : [])
		]);

		setActivePlayer(nextPlayer);

		setCurrentTurn(
			nextPlayer
				? {
					...defaultTurn
					, name: nextPlayer.name
				}
				: undefined
		);
	};

	const endTurn = () => {

		const nextPlayer =
			// Choose next player if order not chosen for all players
			setupInfo.players.length != currentPlayers.length
				? undefined

				// Otherwise, next player if not last player
				: activePlayer!.order < currentPlayers.length
					? currentPlayers[activePlayer!.order]

					// Or if nothing else, the first player
					: currentPlayers[0]
			;

		setTurns(
			[
				...turns
				, {
					name: currentTurn?.name ?? ""
					, start: currentTurn?.start ?? ""
					, cardsScored: currentTurn?.cardsScored ?? []
					, end: new Date().toISOString()
					, tookBackDice: currentTurn?.tookBackDice ?? false
				}
			]
		);

		setCurrentTurn(
			nextPlayer
				? {
					...defaultTurn
					, name: nextPlayer.name
				}
				: undefined
		);

		setReturnedTo([]);
		setActivePlayer(nextPlayer);
	};

	const startScoreCard = (points: Points) => {
		setScoreCard(points);
	};

	const cardScored = () => {

		setCurrentTurn(
			currentTurn
				? {
					...currentTurn
					, cardsScored: [
						...currentTurn.cardsScored
						, {
							timestamp: new Date().toISOString()
							, points: scoreCard ?? 0
							, returnedDiceTo: returnedTo
						}
					]
				}
				: undefined
		);

		setReturnedTo([]);
		setScoreCard(undefined);
	};

	const toggleReturnToCheck = (who: string) => {
		returnedTo.some(x => x == who)
			? setReturnedTo(returnedTo.filter(x => x != who))
			: setReturnedTo([...returnedTo, who])
		;
	};

	const calcCurrentScore = (who: string) =>
		turns
			.filter(y => y.name == who)
			.flatMap(y => y.cardsScored)
			.reduce(
				(acc, y) => acc + y.points
				, 0
			)
		+
		(currentTurn
			? currentTurn.name == who
				? currentTurn.cardsScored
					.reduce(
						(acc, x) => acc + x.points
						, 0
					)
				?? 0
				: 0
			: 0
		)
		;

	const potentialNewScore = calcCurrentScore(activePlayer?.name ?? "")
		+ (scoreCard ?? 0)
	;

	const inGameFrenemies = getFrenemiesData(
		[
			{
				winner: activePlayer?.name ?? ""
				, players: currentPlayers
				, start: setupInfo.start
				, end: new Date().toISOString()
				, turns: [
					...turns
					, {
						name: currentTurn?.name ?? ""
						, start: currentTurn?.start ?? ""
						, cardsScored: [
							...(currentTurn?.cardsScored ?? [])
							, {
								timestamp: new Date().toISOString()
								, points: scoreCard ?? 0
								, returnedDiceTo: returnedTo
							}
						]
						, end: new Date().toISOString()
						, tookBackDice: currentTurn?.tookBackDice ?? false
					}
				]
			}			
		]
	);

	const playersWhoseDiceCouldPossiblyBeReturned = setupInfo.players
		.filter(
			x => 
				x != activePlayer?.name
				&& turns.some(y => y.name == x)
		)
	;

	const undo = () => {
		
		// If scored cards in current turn, undo them first.
		const currentTurnScoredCards = currentTurn?.cardsScored ?? [];
		console.log("here", currentTurnScoredCards);

		if (currentTurn && currentTurnScoredCards.length > 0) {
			setCurrentTurn({
				...currentTurn
				, cardsScored: currentTurnScoredCards.filter(
					(_, i, a) => i !== (a.length - 1)
				)
			});
		} else {

			// Otherwise previous turns.
			const previousTurn = turns
				.filter(
					(_, i, a) => i === (a.length - 1)
				)[0]
			;

			if (previousTurn && previousTurn.cardsScored.length > 0) {

				const updatedPreviousTurn = {
					name: previousTurn.name
					, start: previousTurn.start
					, end: ""
					, cardsScored: previousTurn.cardsScored.filter(
						(_, i, a) => i !== (a.length - 1)
					)
					, tookBackDice: previousTurn.tookBackDice
				};

				setTurns([
					...turns.filter(x => x !== previousTurn)
					, updatedPreviousTurn
				]);

				// Set current turn if necessary.
				setCurrentTurn(updatedPreviousTurn);

				// Set active player if necessary.
				setActivePlayer(
					currentPlayers.filter(x => x.name === updatedPreviousTurn.name)[0] ?? undefined
				);

				// ? ? ?

			} else {

				// console.log("Is this where it dies?");
				
				// Previous turn doesn't have cards scored, so dump it...
				setTurns([
					...turns.filter((_, i, a) => i !== (a.length - 1))
				]);


				const newLastTurn = turns.filter((_, i, a) => i === (a.length - 1))[0];

				if (newLastTurn) {
					setCurrentTurn(newLastTurn);
					setActivePlayer(
						currentPlayers.filter(x => x.name === newLastTurn.name)[0] ?? undefined
					);
				}
			}
		}
	};

	return (
		<div className="drawer drawer-end">
			<input
				id="choose-order-drawer"
				type="checkbox"
				className="drawer-toggle"
				checked={showDrawerReason != ShowDrawerReason.None}
				readOnly
			/>
			<div className="drawer-content">
				<div
					className="flex flex-col p-1"
				>
					{currentPlayers.map(x => (
						<div
							className="mt-5 ml-3"
						>

							<h2
								className="text-2xl text-left"
							>
								<span
									className={`text-xl badge badge-lg w-16 mr-5 ${activePlayer == x ? 'bg-primary font-bold' : ''}`}
								>
									{
										calcCurrentScore(x.name)
									}
								</span>
								<span
									className={`${activePlayer == x ? 'text-primary font-bold': ''}`}
								>
									{x.name}
								</span>
							</h2>

							{
								activePlayer == x &&
								<div
									className="flex flex-col ml-5 mt-5"
								>
									<div
										className="font-semibold1 text-primary text-sm text-left mb-3 ml-16 -mt-5"
									>
										{
											[
												...turns
												, currentTurn!
											]
												.filter(y => y.name == x.name)
												.flatMap(y => y.cardsScored)
												.flatMap(y => y.points)
												.join(' + ')
										}
									</div>
									<div
										className="flex flex-row mt-3"
									>
										<div className="form-control1 mt-5">
											<label className="label1 flex">
												<input
													type="checkbox"
													checked={currentTurn?.tookBackDice ?? false}
													className="checkbox checkbox-primary"
													onChange={() => setCurrentTurn({
														...currentTurn ?? defaultTurn
														, tookBackDice: !currentTurn?.tookBackDice
													})}
												/>
												<span 
													className="label-text text-lg ml-3 -mt-1 capitalize"
												>
													Took back all dice
												</span>
											</label>
										</div>
									</div>
									<div
										className="flex flex-row mt-3"
									>
										<button
											className="btn btn-primary btn-outline btn-md"
											onClick={() => startScoreCard(2)}
										>
											+ 2
										</button>
										<button
											className="btn btn-primary btn-outline btn-md ml-3"
											onClick={() => startScoreCard(5)}
										>
											+ 5
										</button>
										<button
											className="btn btn-primary btn-outline btn-md ml-3"
											onClick={() => startScoreCard(10)}
										>
											+ 10
										</button>
										<button
											className="btn btn-primary btn-outline btn-md ml-3"
											onClick={() => startScoreCard(15)}
										>
											+ 15
										</button>
									</div>
									<div
										className="flex flex-row -ml-12 mt-5"
									>
										<button
											key={x.name}
											className="btn btn-lg btn-link normal-case font-bold"
											onClick={endTurn}
										>
											<svg 
												xmlns="http://www.w3.org/2000/svg" 
												width="20" 
												height="20" 
												fill="currentColor" 
												viewBox="0 0 16 16"
												className="mr-2"
											>
												{
													setupInfo.players.length === currentPlayers.length && currentPlayers[currentPlayers.length - 1].name == activePlayer.name ? (
														<path fill-rule="evenodd" d="M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708l-4-4z"/>

													) : (
														<path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
													) 
												

												}
											</svg> 
											{
												setupInfo.players.length === 1 ?
													"End Turn" :
													`Next ${setupInfo.players.length === currentPlayers.length && currentPlayers[currentPlayers.length - 1].name == activePlayer.name ? " (first)" : ""} Player`
											}
											
										</button>
									</div>
								</div>
							}
						</div>
					))}
					<div
						className="text-md text-left ml-5 font-light mr-3 mt-3"
					>
						<div
							className="divider text-xs"
							onClick={() => setShowLess(!showLess)}
						>
							Show {showLess ? 'More' : 'Less'}
						</div>
						{
							showLess &&
							<div
								className="-mt-3 -ml-3"
							>
								<a
									className="btn btn-link capitalize text-lg"
									onClick={undo}
								>
									Undo
								</a>
								<span
									className="text-base-300"
								>
									|
								</span>
								<a
									className="btn btn-link capitalize text-lg"
									onClick={() => nav(-2)}
								>
									Quit
								</a>
							</div>
						}
						{
							!showLess &&
							<div>
								<p>
									Keep playing until somebody wins with <span className="font-semibold">40 points</span>...
								</p>

								<p>
									You can
									<a
										className="btn btn-link capitalize text-lg -ml-3 -mr-3 -mb-3"
										onClick={undo}
									>
										Undo
									</a>
									scored cards and turns...

								</p>

								<p>
									Or
									<a
										className="btn btn-link capitalize text-lg -ml-3 -mr-3 -mb-3"
										onClick={() => nav(-2)}
									>
										Quit
									</a>
									to not record data for this game...
								</p>
							</div>
						}
					</div>
				</div>
			</div>
			<div className="drawer-side">
				<label htmlFor="cnoose-order-drawer" className="drawer-overlay"></label>
				<ul className="menu p-4 w-80 bg-base-100 text-base-content">
					{
						showDrawerReason == ShowDrawerReason.ChoosePlayerOrder &&
						<div
							className="flex flex-col"
						>
							<p
								className="text-xl text-left font-bold"
							>
								Choose Player {currentPlayers.length + 1}
							</p>
							{
								setupInfo.players
									.filter(x => !currentPlayers.some(y => y.name == x))
									.map(x => (
										<button
											className="btn btn-lg btn-primary capitalize mt-3"
											key={x}
											onClick={() => playerOrderChosen(x)}
										>
											{x}
										</button>
									))
							}
						</div>
					}
					{
						showDrawerReason == ShowDrawerReason.ScoreCard &&
						<div
							className="flex flex-col"
						>
							{
								playersWhoseDiceCouldPossiblyBeReturned.length > 0 ? (
									<>
										<p
											className="text-xl text-left font-bold"
										>
											Returned dice to...
										</p>
										{
											playersWhoseDiceCouldPossiblyBeReturned
												.map(x => (
													<div className="form-control1 mt-5">
														<label className="label1 flex">
															<input
																type="checkbox"
																checked={returnedTo.some(y => y == x)}
																className="checkbox checkbox-primary"
																onChange={() => toggleReturnToCheck(x)}
															/>
															<span
																className="label-text text-xl ml-3 capitalize"
															>
																{x}
															</span>
														</label>
													</div>
												)
											)
										}
									</>
								) : (
									<p
										className="text-xl text-left font-bold"
									>
										Confirm scored card...
									</p>									
								)
							}
							{
								potentialNewScore < 40 ?
									<button
										className="btn btn-lg btn-primary capitalize mt-10"
										onClick={cardScored}
									>
										Score {scoreCard}
									</button>
									: (
										<>
											<p
												className="text-xl text-left font-bold mt-10"
											>
												Game Over...
											</p>
											<button
												className="btn btn-lg btn-primary capitalize mt-3"
												onClick={() => done(activePlayer?.name ?? "")}
											>
												Yes, {activePlayer?.name} Won with {potentialNewScore}
											</button>
										</>
									)
							}
							<button
								className="btn btn-link capitalize"
								onClick={() => setScoreCard(undefined)}
							>
								Cancel
							</button>
							{
								potentialNewScore >= 40 && inGameFrenemies.length > 0 && (
									<>
										<p
											className="text-xl text-left font-bold mt-5 mb-3"
										>
											Frenemies steal your cards 
											<br />
											: - O
										</p>
										<table className="table w-full mt-3">
											<thead>
												<tr>
													<th>Who &gt; Whom</th>
													<th># TIMES</th>
												</tr>
											</thead>
											<tbody>
												{inGameFrenemies.map((x: any) => (
													<tr
														key={x[0]}
													>
														<td>{x[0]}</td>
														<td>{x[1]}</td>
													</tr>
												))}
											</tbody>
										</table>							
		
									</>
								)
							}
						</div>
					}
				</ul>
			</div>
		</div>
	);
};