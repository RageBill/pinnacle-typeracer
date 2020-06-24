import React, {useEffect, useState} from "react";
import {Button} from "semantic-ui-react";
import {socket} from "../socketConfig";

export const NewGameButton = ({player, isOpen, isOver, gameId}) => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        if (isOpen === false && isOver) {
            setShowButton(true);
        }
    }, [isOpen, isOver]);

    const onClick = () => {
        setShowButton(false);
        socket.emit("restart-game", gameId);
    };

    return (
        player.isPartyLeader &&
        showButton && (
            <Button onClick={onClick} secondary>
                Start A New Game
            </Button>
        )
    );
};
