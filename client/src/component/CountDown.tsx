import React, {useEffect, useState} from "react";
import {socket} from "../socketConfig";
import {Game, SocketReceivedEventData, SocketReceivedEventView} from "../type";

export const CountDown = ({isOpen}: {isOpen: Game["isOpen"]}) => {
    const [timer, setTimer] = useState<SocketReceivedEventData[SocketReceivedEventView.TIMER]>({countDown: "", msg: ""});

    useEffect(() => {
        if (isOpen) {
            setTimer({countDown: "", msg: ""});
        }

        socket.on(SocketReceivedEventView.TIMER, ({countDown, msg}) => {
            setTimer({countDown, msg});
        });

        socket.on(SocketReceivedEventView.DONE, () => {
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
