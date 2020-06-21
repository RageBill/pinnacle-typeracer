import React from "react";
import {Redirect} from "react-router-dom";
import {CountDown} from "./CountDown";
import {StartButton} from "./StartButton";
import {socket} from "../socketConfig";
import {DisplayWords} from "./DisplayWords";
import {Form} from "./Form";

export const TypeRacer = ({gameState}) => {
    const {_id, players, words, isOpen, isOver} = gameState;
    const player = players.find((player) => player.socketId === socket.id);

    if (_id === "") {
        return <Redirect to="/" />;
    } else {
        return (
            <div>
                <DisplayWords words={words} player={player} />
                <Form isOpen={isOpen} isOver={isOver} gameId={_id} />
                <CountDown />
                <StartButton player={player} gameId={_id} />
            </div>
        );
    }
};
