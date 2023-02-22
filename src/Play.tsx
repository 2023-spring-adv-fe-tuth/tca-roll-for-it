import { useNavigate } from "react-router-dom";

export const Play = () => {
    const nav = useNavigate();

    return (
        <>
            <h2>
                Play
            </h2>
                <button 
                className="btn btn-lg btn-primary capitalize"
                onClick={() => nav(-2)}
            >
                Done
            </button>    
        </>
);
};