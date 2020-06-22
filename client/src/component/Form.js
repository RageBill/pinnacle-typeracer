import React, {useEffect, useRef, useState} from "react";
import {socket} from "../socketConfig";
import {Input} from "semantic-ui-react";

export const Form = ({isOpen, isOver, gameId}) => {
    const [userInput, setUserInput] = useState("");
    const textInput = useRef(null);

    useEffect(() => {
        if (isOpen === false) {
            textInput.current.focus(); // user can immediate start typing once the game start
        }
    }, [isOpen]);

    const resetForm = () => setUserInput("");

    const onUserInput = (e) => {
        const value = e.target.value;
        const lastChar = value.charAt(value.length - 1);
        if (lastChar === " ") {
            socket.emit("user-input", {userInput, gameId});
            resetForm();
        } else {
            setUserInput(e.target.value);
        }
    };

    return <Input fluid type="text" readOnly={isOpen || isOver} onChange={onUserInput} value={userInput} ref={textInput} />;
};
