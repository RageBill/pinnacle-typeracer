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

// TODO: not functioning as expected
export const NewGameButton = ({player, isOpen, isOver, gameId}: Props) => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        if (!isOpen && isOver) {
            setShowButton(true);
        }
    }, [isOpen, isOver]);

    const onClick = () => {
        setShowButton(false);
        socket.emit(SocketSentEventView.RESTART_GAME, {gameId});
    };

    return player.isPartyLeader && showButton ? (
        <Button onClick={onClick} secondary>
            Start A New Game
        </Button>
    ) : (
        <div />
    );
};

NewGameButton.displayName = "NewGameButton";
