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
        <div
            className="flex flex-col p-1"
        >
            <button 
                className="btn btn-lg btn-primary capitalize"
                onClick={() => nav("/play")}
            >
                Start Playing
            </button>    
            <p>
                Some stuff goes here : - )
            </p>
            <p>
                {foo}
            </p>
        </div>
    );
};