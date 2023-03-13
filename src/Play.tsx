import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GamePlayer, GameResult, SetupInfo, Points, GamePlayerTurn } from "./front-end-model";

interface PlayProps {
    setupInfo: SetupInfo;
    addGameResult: (r: GameResult) => void;
    setTitle: (title: string) => void;
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
}) => {

    console.log(setupInfo.start);
    
    const [currentPlayers, setCurrentPlayers] = useState<GamePlayer[]>([]);
    
    const [activePlayer, setActivePlayer] = useState<GamePlayer | undefined>(undefined);
    const [scoreCard, setScoreCard] = useState<Points | undefined>(undefined);

    const [currentTurn, setCurrentTurn] = useState<GamePlayerTurn>();
    const [turns, setTurns] = useState<GamePlayerTurn[]>([]);

    const [showLess, setShowLess] = useState(false);

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
        addGameResult({
            winner: winner
            , players: setupInfo.players.map(x => ({
                name: x
                , order: 0
            }))
            , start: setupInfo.start
            , end: new Date().toISOString()
        });
        nav(-2);
    };

    const playerOrderChosen = (chosenPlayerName: string) => {

        const chosenPlayerNumber = currentPlayers.length + 1;

        const nextPlayer = {
            name: chosenPlayerName
            , order: chosenPlayerNumber
        };

        const playersRemainingAfterAddingChosenPlayer = setupInfo.players.filter(
            x => x !== chosenPlayerName 
                && !currentPlayers.some(y => y.name === x)
        );
        
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
                name: nextPlayer.name
                , start: new Date().toISOString()
                , end: ""
                , cardsScored: []
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
                }
            ]
        );
            
        setCurrentTurn(
            nextPlayer 
            ? {
                name: nextPlayer.name
                , start: new Date().toISOString()
                , end: ""
                , cardsScored: []
            }
            : undefined
        );

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
                        , returnedDiceTo: []
                    }
                ]
            }
            : undefined
        );
    
        setScoreCard(undefined);    

        const winner = calcCurrentScore(activePlayer?.name ?? "") + (scoreCard ?? 0) >= 30;

        if (winner) {
            // Winner, game over...

            // Put the final current turn into turns...
            setTurns(
                [
                    ...turns
                    , {
                        name: currentTurn?.name ?? ""
                        , start: currentTurn?.start ?? ""
                        , cardsScored: currentTurn?.cardsScored ?? []
                        , end: new Date().toISOString()
                    }
                ]
            )
        }
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
                                    className={`text-xl font-bold badge badge-lg w-16 mr-5 ${activePlayer == x ? 'bg-primary' : ''}`}
                                >
                                        {
                                            calcCurrentScore(x.name)
                                        }
                                </span>
                                {x.name}
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
                                        className="flex flex-row"
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
                                        className="flex flex-row mt-3"
                                    >
                                        <button
                                            key={x.name}
                                            className="btn btn-md btn-primary capitalize"
                                            onClick={endTurn}
                                        >
                                            End Turn
                                        </button>                                    
                                        <button
                                            key={x.name}
                                            className="ml-3 btn btn-md text-light btn-ghost capitalize"
                                            onClick={() => done(x.name)}
                                        >
                                            Won
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
                            Show {showLess ? 'More': 'Less'}
                        </div>
                        {
                            showLess &&
                            <div
                                className="-mt-3 -ml-3"
                            >
                                <a
                                    className="btn btn-link capitalize text-lg"
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
                                    Keep playing until somebody wins with <span className="font-semibold">30 points</span>... 
                                </p>
            
                                <p>
                                    You can
                                    <a
                                        className="btn btn-link capitalize text-lg -ml-3 -mr-3 -mb-3"
                                    >
                                        Undo
                                    </a>
                                    scored cards through previous turns...

                                </p>
            
                                <p>
                                    Or 
                                    <a
                                        className="btn btn-link capitalize text-lg -ml-3 -mr-3 -mb-3"
                                        onClick={() => nav(-2)}
                                    >
                                        Quit
                                    </a>
                                    and not record data for this game...
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
                            <p
                                className="text-xl text-left font-bold"
                            >
                                Returned dice to...
                            </p>
                            {
                                setupInfo.players
                                    .filter(x => x != activePlayer?.name)
                                    .map(x => (
                                        <div className="form-control1 mt-5">
                                            <label className="label1 flex">
                                                <input
                                                    type="checkbox"
                                                    // checked={x.checked}
                                                    className="checkbox checkbox-primary"
                                                    // onChange={() => setChosenPlayers([
                                                    //     ...chosenPlayers.map(y => ({
                                                    //         ...y
                                                    //         , checked: x.name == y.name ? !y.checked : y.checked
                                                    //     }))
                                                    // ])}
                                                />
                                                <span 
                                                    className="label-text text-xl ml-3 capitalize"
                                                >
                                                    {x}
                                                </span>
                                            </label>
                                        </div>
                                    ))
                            }
                            {
                                calcCurrentScore(activePlayer?.name ?? "") + (scoreCard ?? 0) < 30 ?
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
                                            Yes, {activePlayer?.name} Won                                    
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
                        </div>
                    }
                </ul>
            </div>
        </div>
    );
};