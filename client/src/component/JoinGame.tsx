import React, {ChangeEvent, FormEvent, useState} from "react";
import {socket} from "../socketConfig";
import {Button, Container, Form, Header} from "semantic-ui-react";
import {Game, Player, SocketSentEventView} from "../type";

type UserInput = {
    gameId: Game["_id"];
    nickName: Player["nickName"];
};

export const JoinGame = () => {
    const [userInput, setUserInput] = useState<UserInput>({gameId: "", nickName: ""});

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit(SocketSentEventView.JOIN_GAME, userInput);
    };

    const onGameIdInput = (e: ChangeEvent<HTMLInputElement>) => setUserInput({...userInput, gameId: e.target.value});

    const onNickNameInput = (e: ChangeEvent<HTMLInputElement>) => setUserInput({...userInput, nickName: e.target.value});

    return (
        <Container textAlign="center" style={{marginTop: "36px"}}>
            <Header as="h1">Join Game</Header>
            <Container textAlign="left">
                <Form onSubmit={onSubmit}>
                    <Form.Field>
                        <label htmlFor="gameId">Enter Game ID:</label>
                        <input type="text" name="gameId" value={userInput.gameId} onChange={onGameIdInput} placeholder="Enter Game ID" />
                    </Form.Field>
                    <Form.Field>
                        <label htmlFor="nickName">Enter NickName:</label>
                        <input type="text" name="nickName" value={userInput.nickName} onChange={onNickNameInput} placeholder="Enter NickName" />
                    </Form.Field>
                    <Container textAlign="center">
                        <Button type="submit" primary disabled={userInput.gameId === "" || userInput.nickName === ""}>
                            Submit
                        </Button>
                    </Container>
                </Form>
            </Container>
        </Container>
    );
};

JoinGame.displayName = "JoinGame";
