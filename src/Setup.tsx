import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SetupInfo } from "./front-end-model";

interface SetupProps {
    availablePlayers: string[];
    setSetupInfo: (info: SetupInfo) => void;
    setTitle: (title: string) => void;
}

export const Setup: FC<SetupProps> = ({
    availablePlayers
    , setSetupInfo
    , setTitle
}) => {

    setTitle("Game Setup");

    const nav = useNavigate();

    const [chosenPlayers, setChosenPlayers] = useState(availablePlayers.map(x => ({
        name: x
        , checked: false
    })))

    const playerChecked = chosenPlayers.some(x => x.checked);

    const [newPlayerName, setNewPlayerName] = useState("");

    const addPlayerWithValidation = () => {
        // Check if newPlayerName is blank or already exists.
        if (
            newPlayerName.length == 0
            || chosenPlayers.some(x => 0 == x.name.localeCompare(newPlayerName))
        )
            return;

        // If not, add it defaulted to checked.
        setChosenPlayers(
            [
                ...chosenPlayers
                , {
                    name: newPlayerName
                    , checked: true
                }
            ].sort((a, b) => a.name.localeCompare(b.name))
        );

        // Clear out the text box.
        setNewPlayerName("");
    };

    const startGame = () => {

        setSetupInfo({
            start: new Date().toISOString()
            , players: chosenPlayers
                .filter(x => x.checked)
                .map(x => x.name)
        });
        nav("/play");
    };

    return (
        <div
            className="flex flex-col p-1"
        >
            <button
                className={`btn btn-lg btn-primary capitalize mt-3 mx-3 ${playerChecked ? '' : 'btn-disabled'}`}
                onClick={startGame}
            >
                {playerChecked ? 'Start Playing' : 'Choose players below...'}
            </button>
            <div
                className="flex mt-3"
            >
                <div className="card w-0 bg-base-100 shadow-xl grow overflow-x-hidden">
                    <div className="card-body">
                        <h2 className="card-title">Choose or add players...</h2>
                        <div className="form-control">
                            <div className="input-group mt-3">
                                <input
                                    type="text"
                                    placeholder="New Player Name"
                                    className="input input-bordered grow w-0"
                                    value={newPlayerName}
                                    onChange={(e) => setNewPlayerName(e.target.value)}
                                />
                                <button
                                    className="btn btn-square btn-primary"
                                    onClick={() => addPlayerWithValidation()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <ul>
                            {chosenPlayers.map(x => (
                                <div className="form-control1 mt-5">
                                    <label className="label1 flex">
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
                                        <span 
                                            className="label-text text-xl ml-3 capitalize"
                                        >
                                            {x.name}
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};