import React from "react";
import {Redirect} from "react-router-dom";
import {CountDown} from "./CountDown";
import {StartButton} from "./StartButton";
import {socket} from "../socketConfig";

export const TypeRacer = ({gameState}) => {
    const {_id, players} = gameState;
    const player = players.find((player) => player.socketId === socket.id);

    if (_id === "") {
        return <Redirect to="/" />;
    } else {
        return (
            <div>
                <CountDown />
                <StartButton player={player} gameId={_id} />
            </div>
        );
    }
};
