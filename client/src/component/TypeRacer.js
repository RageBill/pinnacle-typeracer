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

export const TypeRacer = ({gameState}) => {
    const {_id, players, words, isOpen, isOver} = gameState;
    const player = players.find((player) => player.socketId === socket.id);

    if (_id === "") {
        return <Redirect to="/" />;
    } else {
        return (
            <div className="ui container center aligned">
                <DisplayWords words={words} player={player} />
                <ProgressBar players={players} player={player} words={words} />
                <Form isOpen={isOpen} isOver={isOver} gameId={_id} />
                <CountDown />
                <StartButton player={player} gameId={_id} />
                <ScoreBoard players={players} player={player} />
                <br />
                <br />
                <DisplayGameCode gameId={_id} />
            </div>
        );
    }
};
