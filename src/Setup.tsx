import { FC } from "react";
import { useNavigate } from "react-router-dom";

export const Setup: FC<{
    foo: string
    , cat: () => void
}> = ({
    foo
    , cat
}) => {

    const nav = useNavigate();

    cat();
    cat();
    cat();
    
    return (
        <>
            <h2>
                Setup
            </h2>
            <p>
                {foo}
            </p>
            <button 
                className="btn btn-lg btn-primary capitalize"
                onClick={() => nav("/play")}
            >
                Start Playing
            </button>    
        </>
    );
};