import { useNavigate } from "react-router-dom";
import { GameResult } from "./front-end-model";

interface PlayProps {
    addGameResult: (r: GameResult) => void;
}

export const Play: React.FC<PlayProps> = ({addGameResult}) => {
    const nav = useNavigate();

    const done = () => {
        addGameResult({
            winner: "Larry"
            , players: [{ name: "Larry", order: 0, diceColor: "red"}, { name: "Curly", order: 0, diceColor: "red"}, { name: "Moe", order: 0, diceColor: "red"}]
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