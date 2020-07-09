import React, {useEffect, useState} from "react";
import {Button, Container} from "semantic-ui-react";
import {socket} from "../socketConfig";
import {Game, Player, SocketSentEventView} from "../type";

interface Props {
    player: Player;
    isOpen: Game["isOpen"];
    isOver: Game["isOver"];
    gameId: Game["_id"];
}

export const PartyLeaderButtonGroup = ({player, isOpen, isOver, gameId}: Props) => {
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        if (isOpen || isOver) {
            setShowButtons(true);
        }
    }, [isOpen, isOver]);

    const onChangePassageClick = () => socket.emit(SocketSentEventView.CHANGE_PASSAGE, {gameId});

    const onStartButtonClick = () => {
        setShowButtons(false);
        socket.emit(SocketSentEventView.TIMER, {playerId: player._id, gameId});
    };

    return player.isPartyLeader && showButtons ? (
        <Container>
            {isOpen && (
                <Button onClick={onChangePassageClick} color="violet">
                    Change Passage
                </Button>
            )}
            <Button onClick={onStartButtonClick} color={isOpen ? "green" : "orange"}>
                {isOpen ? "Start Game" : "New Game"}
            </Button>
        </Container>
    ) : (
        <></>
    );
};

PartyLeaderButtonGroup.displayName = "StartButton";
