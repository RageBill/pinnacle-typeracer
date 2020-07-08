import React, {useEffect, useState} from "react";
import {Button} from "semantic-ui-react";
import {socket} from "../socketConfig";
import {Game, Player, SocketSentEventView} from "../type";

interface Props {
    player: Player;
    isOpen: Game["isOpen"];
    isOver: Game["isOver"];
    gameId: Game["_id"];
}

export const StartButton = ({player, isOpen, isOver, gameId}: Props) => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        if (isOpen || isOver) {
            setShowButton(true);
        }
    }, [isOpen, isOver]);

    const onClick = () => {
        setShowButton(false);
        socket.emit(SocketSentEventView.TIMER, {playerId: player._id, gameId});
    };

    return player.isPartyLeader && showButton ? (
        <Button onClick={onClick} secondary>
            {isOpen ? "Start Game" : "New Game"}
        </Button>
    ) : (
        <></>
    );
};

StartButton.displayName = "StartButton";
