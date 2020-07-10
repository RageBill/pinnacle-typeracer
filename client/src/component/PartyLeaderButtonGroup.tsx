import React, {useEffect, useState} from "react";
import {Button, Container, Input} from "semantic-ui-react";
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
    const [minLengthText, setMinLengthText] = useState("");
    const [maxLengthText, setMaxLengthText] = useState("");

    useEffect(() => {
        if (isOpen || isOver) {
            setShowButtons(true);
        }
    }, [isOpen, isOver]);

    const onMinLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => setMinLengthText(e.target.value);

    const onMaxLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => setMaxLengthText(e.target.value);

    const onChangePassageClick = () => {
        let maxLength = Math.round(parseFloat(maxLengthText));
        maxLength = isNaN(maxLength) ? 400 : maxLength; // default maxLength is 400
        let minLength = Math.round(parseFloat(minLengthText));
        minLength = isNaN(minLength) ? Math.round(Math.random() * Math.min(200, maxLength)) : minLength; // default minLength is random from 0 to 200 (or maxLength if it is small than 200) - because when minLength is 0, there are overwhelmingly more short passages
        socket.emit(SocketSentEventView.CHANGE_PASSAGE, {gameId, minLength, maxLength});
    };

    const onStartButtonClick = () => {
        setShowButtons(false);
        socket.emit(SocketSentEventView.TIMER, {playerId: player._id, gameId});
    };

    return player.isPartyLeader && showButtons ? (
        <Container>
            <Button onClick={onStartButtonClick} color={isOpen ? "green" : "orange"}>
                {isOpen ? "Start Game" : "New Game"}
            </Button>
            {isOpen && (
                <>
                    <br />
                    <br />
                    <Input label="Min Length" type="number" value={minLengthText} onChange={onMinLengthChange} />
                    <span> </span>
                    <Input label="Max Length" type="number" value={maxLengthText} onChange={onMaxLengthChange} />
                    <span> </span>
                    <Button onClick={onChangePassageClick} color="violet">
                        Change Passage
                    </Button>
                </>
            )}
        </Container>
    ) : (
        <></>
    );
};

PartyLeaderButtonGroup.displayName = "StartButton";
