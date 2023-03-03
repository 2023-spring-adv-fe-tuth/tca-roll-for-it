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


        <div className="drawer drawer-end">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">

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


                <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">Open drawer</label>

            </div> 
            <div className="drawer-side">
                <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 bg-base-100 text-base-content">
                <li><a>Sidebar Item 1</a></li>
                <li><a>Sidebar Item 2</a></li>
                </ul>
            </div>
        </div>
    );
};