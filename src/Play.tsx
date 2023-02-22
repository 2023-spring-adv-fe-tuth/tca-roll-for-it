import { useNavigate } from "react-router-dom";

export const Play = () => {
    const nav = useNavigate();

    return (
        <div
            className="flex flex-col p-1"
        >
            <button 
                className="btn btn-lg btn-primary capitalize"
                onClick={() => nav(-2)}
            >
                Done
            </button>    
        </div>
);
};