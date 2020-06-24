import React from "react";
import {Redirect} from "react-router-dom";
import {CountDown} from "./CountDown";
import {StartButton} from "./StartButton";
import {socket} from "../socketConfig";
import {DisplayWords} from "./DisplayWords";
import {Form} from "./Form";
import {ProgressBar} from "./ProgressBar";
import {ScoreBoard} from "./ScoreBoard";
import {DisplayGameCode} from "./DisplayGameCode";
import {Container} from "semantic-ui-react";
import {NewGameButton} from "./NewGameButton";

export const TypeRacer = ({gameState}) => {
    const {_id, players, words, isOpen, isOver} = gameState;
    const player = players.find((player) => player.socketId === socket.id);

    if (_id === "") {
        return <Redirect to="/" />;
    } else {
        return (
            <Container textAlign="center">
                <DisplayWords words={words} player={player} />
                <ProgressBar players={players} player={player} words={words} />
                <Form isOpen={isOpen} isOver={isOver} gameId={_id} words={words} player={player} />
                <CountDown isOpen={isOpen} />
                <StartButton player={player} gameId={_id} />
                <NewGameButton player={player} isOpen={isOpen} isOver={isOver} gameId={_id} />
                <ScoreBoard players={players} player={player} />
                <br />
                <br />
                <DisplayGameCode gameId={_id} />
            </Container>
        );
    }
};
