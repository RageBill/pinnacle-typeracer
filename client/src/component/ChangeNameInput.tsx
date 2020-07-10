import React, {useEffect, useState} from "react";
import {Container, Form} from "semantic-ui-react";
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
            <Container style={{width: 400}}>
                <Form onSubmit={onConfirm}>
                    <Form.Input type="text" value={nickName} onChange={onNickNameChange}>
                        <input />
                        <Form.Button onClick={onConfirm} color="brown" disabled={nickName === player.nickName || nickName.length === 0}>
                            Change Name
                        </Form.Button>
                    </Form.Input>
                </Form>
            </Container>
        </>
    ) : (
        <></>
    );
};

ChangeNameInput.displayName = "ChangeNameInput";
