import React, {useEffect, useState} from "react";
import {socket} from "../socketConfig";

export const CountDown = ({isOpen}) => {
    const [timer, setTimer] = useState({countDown: "", msg: ""});

    useEffect(() => {
        if (isOpen) {
            setTimer({countDown: "", msg: ""});
        }
        socket.on("timer", (data) => {
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
