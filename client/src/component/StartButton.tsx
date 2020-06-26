import React, {useState} from "react";
import {socket} from "../socketConfig";
import {Button} from "semantic-ui-react";
import {Game, Player} from "../type";

export const StartButton = ({player, gameId}: {player: Player; gameId: Game["_id"]}) => {
    const [showButton, setShowButton] = useState(true);

    const onClick = () => {
        socket.emit("timer", {playerId: player._id, gameId});
        setShowButton(false);
    };

    return player.isPartyLeader && showButton ? (
        <Button onClick={onClick} primary>
            Start Game
        </Button>
    ) : (
        <div />
    );
};
