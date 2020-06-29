import React, {useEffect, useState} from "react";
import {socket} from "../socketConfig";
import {Game, SocketReceivedEventData, SocketReceivedEventView} from "../type";

interface Props {
    isOpen: Game["isOpen"];
}

export const CountDown = ({isOpen}: Props) => {
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

CountDown.displayName = "CountDown";
