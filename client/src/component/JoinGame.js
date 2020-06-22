import React, {useState} from "react";
import {socket} from "../socketConfig";
import {Button, Container, Form, Header} from "semantic-ui-react";

export const JoinGame = () => {
    const [userInput, setUserInput] = useState({gameId: "", nickName: ""});

    const onSubmit = (e) => {
        e.preventDefault();
        socket.emit("join-game", userInput);
    };

    const onGameIdInput = (e) => setUserInput({...userInput, gameId: e.target.value});

    const onNickNameInput = (e) => setUserInput({...userInput, nickName: e.target.value});

    return (
        <Container textAlign="center">
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
