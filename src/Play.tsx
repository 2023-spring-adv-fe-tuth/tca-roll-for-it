import { useNavigate } from "react-router-dom";
import { AddGameResultFunc } from "./front-end-model";

interface PlayProps {
    addGameResult: AddGameResultFunc;
}

export const Play: React.FC<PlayProps> = ({addGameResult}) => {
    const nav = useNavigate();

    const done = () => {
        addGameResult({
            winner: "Larry"
            , players: ["Larry", "Curly", "Moe"]
        });
        nav(-2);
    };

    return (
        <div
            className="flex flex-col p-1"
        >
            <button 
                className="btn btn-lg btn-primary capitalize"
                onClick={done}
            >
                Done
            </button>    
        </div>
);
};