import { FC } from "react";

export const Setup: FC<{
    foo: string
    , cat: () => void
}> = ({
    foo
    , cat
}) => {

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
        </>
    );
};