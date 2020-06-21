import React, {useState} from "react";
import {socket} from "../socketConfig";

export const StartButton = ({player, gameId}) => {
    const [showButton, setShowButton] = useState(true);

    const onClick = () => {
        socket.emit("timer", {playerId: player._id, gameId});
        setShowButton(false);
    };

    return (
        player.isPartyLeader &&
        showButton && (
            <button onClick={onClick} className="ui primary button">
                Start Game
            </button>
        )
    );
};
