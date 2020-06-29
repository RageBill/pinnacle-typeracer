import React from "react";
import {Redirect} from "react-router-dom";
import {CountDown} from "./CountDown";
import {StartButton} from "./StartButton";
import {socket} from "../socketConfig";
import {DisplayWords} from "./DisplayWords";
import {PlayerInputForm} from "./PlayerInputForm";
import {ProgressBar} from "./ProgressBar";
import {ScoreBoard} from "./ScoreBoard";
import {DisplayGameCode} from "./DisplayGameCode";
import {Container, Header} from "semantic-ui-react";
import {NewGameButton} from "./NewGameButton";
import {Game} from "../type";

interface Props {
    gameState: Game;
}

export const TypeRacer = ({gameState}: Props) => {
    const {_id, players, words, isOpen, isOver} = gameState;
    const player = players.find((player) => player.socketId === socket.id());

    if (_id === "") {
        return <Redirect to="/" />;
    } else {
        return player ? (
            <Container textAlign="center">
                <DisplayWords words={words} player={player} />
                <PlayerInputForm isOpen={isOpen} isOver={isOver} gameId={_id} words={words} player={player} />
                <CountDown isOpen={isOpen} />
                <ProgressBar players={players} player={player} words={words} />
                <StartButton player={player} gameId={_id} />
                <NewGameButton player={player} isOpen={isOpen} isOver={isOver} gameId={_id} />
                <ScoreBoard players={players} player={player} />
                <br />
                <br />
                <DisplayGameCode gameId={_id} />
            </Container>
        ) : (
            <Header as="h1" color="red">
                Player not found.
            </Header>
        );
    }
};

TypeRacer.displayName = "TypeRacer";
