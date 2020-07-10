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

export const ChangeNameInput = ({player, isOpen, isOver, gameId}: Props) => {
    const [nickName, setNickname] = useState(player.nickName);

    useEffect(() => setNickname(player.nickName), [player, isOpen, isOver]);

    const onNickNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setNickname(event.target.value);

    const onConfirm = () => {
        socket.emit(SocketSentEventView.CHANGE_NAME, {nickName: nickName.trim(), playerSocketId: player.socketId, gameId});
    };

    return isOpen || isOver ? (
        <>
            <br />
            <Container>
                <Input type="text" value={nickName} onChange={onNickNameChange} />
                <Button onClick={onConfirm} color="brown" disabled={nickName === player.nickName || nickName.length === 0}>
                    Change Name
                </Button>
            </Container>
        </>
    ) : (
        <></>
    );
};

ChangeNameInput.displayName = "ChangeNameInput";
