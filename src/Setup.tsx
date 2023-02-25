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
            <h3
                className="text-2xl text-left"
            >
                Choose players...
            </h3>
            <button 
                className="btn btn-link capitalize"
                onClick={() => setChosenPlayers([
                    ...chosenPlayers 
                    , {
                        name: "Dummy Player with a really really long name, really long, yeah"
                        , checked: true
                    }
                ])}
            >
                Add Dummy Player
            </button>
            <ul>
                {chosenPlayers.map(x => (
                    <div className="form-control1 mt-5">
                        <label className="label1 flex ml-10">
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
                            <span className="label-text text-xl ml-3 capitalize">{x.name}</span> 
                        </label>
                    </div>
                ))}
            </ul>
            <button 
                className="btn btn-lg btn-primary capitalize mt-5"
                onClick={() => nav("/play")}
            >
                Start Playing
            </button>    
        </div>
    );
};