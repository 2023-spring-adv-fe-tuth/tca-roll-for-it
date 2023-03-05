import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GamePlayer, GameResult, SetupInfo } from "./front-end-model";

interface PlayProps {
    setupInfo: SetupInfo;
    addGameResult: (r: GameResult) => void;
}

export const Play: React.FC<PlayProps> = ({
    setupInfo
    , addGameResult }
) => {

    console.log(setupInfo.start);
    const [currentPlayers, setCurrentPlayers] = useState<GamePlayer[]>([]);
    const allPlayersOrderChosen = setupInfo.players.length == currentPlayers.length;

    const nav = useNavigate();

    const done = (winner: string) => {
        addGameResult({
            winner: winner
            , players: setupInfo.players.map(x => ({
                name: x
                , order: 0
            }))
        });
        nav(-2);
    };

    return (
        <div className="drawer drawer-end">
            <input 
                id="choose-order-drawer" 
                type="checkbox" 
                className="drawer-toggle" 
                checked={!allPlayersOrderChosen} 
                readOnly
            />
            <div className="drawer-content">
                <div
                    className="flex flex-col p-1"
                >
                    {currentPlayers.map(x => (
                        <button
                            key={x.name}
                            className="btn btn-lg btn-primary capitalize mt-3"
                            onClick={() => done(x.name)}
                        >
                            {x.name} Won
                        </button>
                    ))}
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="cnoose-order-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 bg-base-100 text-base-content">
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
                                    onClick={() => setCurrentPlayers([
                                            ...currentPlayers
                                            , {
                                                name: x
                                                , order: currentPlayers.length + 1
                                                , turns: []
                                            }
                                        ])
                                    }
                                >
                                    {x}                                    
                                </button>
                            ))
                    }
                </ul>
            </div>
        </div>
    );
};