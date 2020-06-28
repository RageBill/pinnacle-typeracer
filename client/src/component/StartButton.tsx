import React, {useState} from "react";
import {socket} from "../socketConfig";
import {Button} from "semantic-ui-react";
import {Game, Player, SocketSentEventView} from "../type";

export const StartButton = ({player, gameId}: {player: Player; gameId: Game["_id"]}) => {
    const [showButton, setShowButton] = useState(true);

    const onClick = () => {
        socket.emit(SocketSentEventView.TIMER, {playerId: player._id, gameId});
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
