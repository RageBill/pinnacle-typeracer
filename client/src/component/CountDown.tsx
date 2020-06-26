import React, {useEffect, useState} from "react";
import {socket} from "../socketConfig";
import {Game} from "../type";

type TimerState = {
    countDown: string;
    msg: string;
};

export const CountDown = ({isOpen}: {isOpen: Game["isOpen"]}) => {
    const [timer, setTimer] = useState<TimerState>({countDown: "", msg: ""});

    useEffect(() => {
        if (isOpen) {
            setTimer({countDown: "", msg: ""});
        }
        socket.on("timer", (data: TimerState) => {
            setTimer(data);
        });
        socket.on("done", () => {
            socket.removeListener("timer");
        });
    }, [isOpen]);

    const {countDown, msg} = timer;
    return (
        <>
            <h1>{countDown}</h1>
            <h3>{msg}</h3>
        </>
    );
};
