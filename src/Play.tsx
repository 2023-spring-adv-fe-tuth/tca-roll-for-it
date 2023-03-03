import { useNavigate } from "react-router-dom";
import { GameResult, SetupInfo } from "./front-end-model";

interface PlayProps {
    setupInfo: SetupInfo;
    addGameResult: (r: GameResult) => void;
}

export const Play: React.FC<PlayProps> = ({
    setupInfo
    , addGameResult}
) => {

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
        <div
            className="flex flex-col p-1"
        >
            {setupInfo.players.map(x => (
                <button 
                    className="btn btn-lg btn-primary capitalize mt-3"
                    onClick={() => done(x)}
                >
                    {x} Won
                </button>    
            ))}
        </div>
    );
};