import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GamePlayer, GameResult, SetupInfo } from "./front-end-model";

interface PlayProps {
    setupInfo: SetupInfo;
    addGameResult: (r: GameResult) => void;
}

enum ShowDrawerReason {
    None
    , ChoosePlayerOrder
    , ScoreCard 
    , GameOver
};

export const Play: React.FC<PlayProps> = ({
    setupInfo
    , addGameResult }
) => {

    console.log(setupInfo.start);
    
    const [currentPlayers, setCurrentPlayers] = useState<GamePlayer[]>([]);
    
    const [activePlayer, setActivePlayer] = useState<GamePlayer | undefined>(undefined);
    const [scoreCard, setScoreCard] = useState<2 | 5 | 10 | 15 | undefined>(undefined);
    const [gameOver, setGameOver] = useState<boolean>(false);

    const showDrawerReason =
    
        // If no active player and not all players order chosen
        !activePlayer && setupInfo.players.length != currentPlayers.length
            ? ShowDrawerReason.ChoosePlayerOrder

            // Else if active player and scoring a card
            : activePlayer && scoreCard
                ? ShowDrawerReason.ScoreCard 

                // Else if game over
                : gameOver
                    ? ShowDrawerReason.GameOver

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

    const playerOrderChosen = (x: string) => {

        const newPlayer = {
            name: x
            , order: currentPlayers.length + 1
            , turns: []
        };

        setCurrentPlayers([
            ...currentPlayers
            , newPlayer
        ]);
        
        setActivePlayer(newPlayer);
    };

    const endTurn = () => {
        setActivePlayer(

            // Choose next player if order not chosen for all players
            setupInfo.players.length != currentPlayers.length
             ? undefined

             // Otherwise, next player if not last player
             : activePlayer!.order < currentPlayers.length
                ? currentPlayers[activePlayer!.order]

                // Or if nothing else, the first player
                : currentPlayers[0]
        );
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
                            className="mb-10"
                        >

                            <h2
                                className="text-2xl text-left"
                            >
                                <span 
                                    className={`text-xl font-bold badge badge-lg w-16 mr-5 ${activePlayer == x ? 'bg-primary' : ''}`}
                                >
                                        10
                                </span>
                                {x.name}
                            </h2>

                            {
                                activePlayer == x &&
                                <div
                                    className="flex flex-col ml-5 mt-5"
                                >
                                    <div
                                        className="flex flex-row"
                                    >
                                        <button
                                            className="btn btn-primary btn-outline btn-md"
                                        >
                                            +2
                                        </button>
                                        <button
                                            className="btn btn-primary btn-outline btn-md ml-3"
                                        >
                                            +5
                                        </button>
                                        <button
                                            className="btn btn-primary btn-outline btn-md ml-3"
                                        >
                                            +10
                                        </button>
                                        <button
                                            className="btn btn-primary btn-outline btn-md ml-3"
                                        >
                                            +15
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
                                            className="ml-3 btn btn-md btn-link capitalize"
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
                        className="text-md text-left ml-5"
                    >
                        Keep playing until somebody wins... 
                    </div>
                    <div
                        className="text-md text-left ml-5 mt-3"
                    >
                        You can also
                        <a
                            className="btn btn-link capitalize text-lg -ml-3 -mr-3"
                        >
                            Undo
                        </a>
                        scored cards through previous turns...
                    </div>    
                    <div
                        className="text-md text-left ml-5 mt-3"
                    >
                        Or 
                        <a
                            className="btn btn-link capitalize text-lg -ml-3 -mr-3"
                        >
                            Quit
                        </a>
                        and not record data for this game...
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
                </ul>
            </div>
        </div>
    );
};