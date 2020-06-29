import React from "react";
import {useHistory} from "react-router";
import {Button, Container, Header} from "semantic-ui-react";

export const GameMenu = () => {
    const history = useHistory();
    return (
        <Container textAlign="center">
            <Header as="h1">Welcome To Pinnacle Typeracer</Header>
            <Button.Group>
                <Button onClick={() => history.push("/game/create")} primary>
                    Create New Game
                </Button>
                <Button.Or />
                <Button onClick={() => history.push("/game/join")} secondary>
                    Join Game
                </Button>
            </Button.Group>
        </Container>
    );
};

GameMenu.displayName = "GameMenu";
