import React, {useEffect, useState} from "react";
import {Button} from "semantic-ui-react";
import {socket} from "../socketConfig";
import {Game, Player, SocketSentEventView} from "../type";

// TODO: not functioning as expected
export const NewGameButton = ({player, isOpen, isOver, gameId}: {player: Player; isOpen: Game["isOpen"]; isOver: Game["isOver"]; gameId: Game["_id"]}) => {
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
