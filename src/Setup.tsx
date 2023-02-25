import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SetupProps {
    availablePlayers: string[];
    foo?: any;
    cat?: any;
}

export const Setup: FC<SetupProps> = ({
    availablePlayers
    , foo
    , cat
}) => {

    cat();
    cat();
    cat();

    const nav = useNavigate();

    const [chosenPlayers, setChosenPlayers] = useState(availablePlayers.map(x => ({
        name: x 
        , checked: false
    })))    

    return (
        <div
            className="flex flex-col p-1"
        >
            <button 
                className="btn btn-link capitalize"
                onClick={() => setChosenPlayers([
                    ...chosenPlayers 
                    , {
                        name: "Dummy"
                        , checked: true
                    }
                ])}
            >
                Add Dummy Player
            </button>
            <h3>
                Available Players
            </h3>
            <ul>
                {chosenPlayers.map(x => (
                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text text-xl">{x.name}</span> 
                            <input 
                                type="checkbox" 
                                checked={x.checked} 
                                className="checkbox checkbox-primary" 
                                onChange={() => setChosenPlayers([
                                    ...chosenPlayers.map(y => ({
                                        ...y
                                        , checked: x.name == y.name ? !y.checked : y.checked 
                                    }))
                                ])}
                            />
                        </label>
                    </div>
                ))}
            </ul>
            <button 
                className="btn btn-lg btn-primary capitalize"
                onClick={() => nav("/play")}
            >
                Start Playing
            </button>    
        </div>
    );
};