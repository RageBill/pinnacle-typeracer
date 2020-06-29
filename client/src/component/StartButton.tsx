import React, {useState} from "react";
import {socket} from "../socketConfig";
import {Button} from "semantic-ui-react";
import {Game, Player, SocketSentEventView} from "../type";

interface Props {
    player: Player;
    gameId: Game["_id"];
}

export const StartButton = ({player, gameId}: Props) => {
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

StartButton.displayName = "StartButton";
