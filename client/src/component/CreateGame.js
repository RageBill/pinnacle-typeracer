import React, {useState} from "react";
import {socket} from "../socketConfig";
import {Button, Container, Form, Header} from "semantic-ui-react";

export const CreateGame = () => {
    const [nickName, setNickName] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        socket.emit("create-game", nickName);
    };

    const onNickNameInput = (e) => setNickName(e.target.value);

    return (
        <Container textAlign="center">
            <Header as="h1">Create Game</Header>
            <Container text textAlign="left">
                <Form onSubmit={onSubmit}>
                    <Form.Field>
                        <label htmlFor="nickName">Enter your nickname:</label>
                        <input type="text" name="nickName" value={nickName} onChange={onNickNameInput} placeholder="Enter your nickname here" />
                    </Form.Field>
                    <Container textAlign="center">
                        <Button type="submit" primary disabled={nickName.length === 0}>
                            Submit
                        </Button>
                    </Container>
                </Form>
            </Container>
        </Container>
    );
};
