import React, {useEffect} from "react";
import {Redirect, useParams} from "react-router-dom";
import {CountDown} from "./CountDown";
import {PartyLeaderButtonGroup} from "./PartyLeaderButtonGroup";
import {socket} from "../socketConfig";
import {DisplayWordsAndUserInput} from "./DisplayWordsAndUserInput";
import {ProgressBar} from "./ProgressBar";
import {ScoreBoard} from "./ScoreBoard";
import {DisplayGameCode} from "./DisplayGameCode";
import {Container, Dimmer, Loader} from "semantic-ui-react";
import {Game, SocketSentEventView} from "../type";
import {ChangeNameInput} from "./ChangeNameInput";
import {ChatRoom} from "./ChatRoom";

interface Props {
    gameState: Game;
}

export const TypeRacer = ({gameState}: Props) => {
    const {gameId} = useParams();
    const {_id, players, words, isOpen, isOver} = gameState;
    const player = players.find((player) => player.socketId === socket.id());

    useEffect(() => {
        if (_id === "") {
            socket.emit(SocketSentEventView.JOIN_GAME, {gameId, nickName: `Anonymous Racer ${Math.round(Math.random() * 1000)}`});
        }
    }, [gameId, _id]);

    if (_id === "") {
        return (
            <Dimmer active>
                <Loader active size="massive" indeterminate>
                    Joining Game...
                </Loader>
            </Dimmer>
        );
    } else {
        return player ? (
            <>
                <Container textAlign="center" style={{marginTop: "36px"}}>
                    <DisplayWordsAndUserInput isOpen={isOpen} isOver={isOver} gameId={_id} words={words} player={player} />
                    <CountDown isOpen={isOpen} />
                    <PartyLeaderButtonGroup player={player} isOpen={isOpen} isOver={isOver} gameId={_id} />
                    <ChangeNameInput player={player} gameId={_id} isOpen={isOpen} isOver={isOver} />
                    <ProgressBar players={players} player={player} words={words} />
                    <ScoreBoard players={players} player={player} />
                    <br />
                    <br />
                    <DisplayGameCode gameId={_id} />
                </Container>
                <ChatRoom gameId={_id} player={player} />
            </>
        ) : (
            <Redirect to="/" />
        );
    }
};

TypeRacer.displayName = "TypeRacer";
