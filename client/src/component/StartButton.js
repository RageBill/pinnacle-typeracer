import React, {useState} from "react";
import {socket} from "../socketConfig";
import {Button} from "semantic-ui-react";

export const StartButton = ({player, gameId}) => {
    const [showButton, setShowButton] = useState(true);

    const onClick = () => {
        socket.emit("timer", {playerId: player._id, gameId});
        setShowButton(false);
    };

    return (
        player.isPartyLeader &&
        showButton && (
            <Button onClick={onClick} primary>
                Start Game
            </Button>
        )
    );
};
