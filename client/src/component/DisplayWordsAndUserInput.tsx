import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {socket} from "../socketConfig";
import {Input} from "semantic-ui-react";
import {Game, Player, SocketSentEventView} from "../type";
import {DisplayWords, getCurrentWord} from "./DisplayWords";

interface Props {
    isOpen: Game["isOpen"];
    isOver: Game["isOver"];
    gameId: Game["_id"];
    words: Game["words"];
    player: Player;
}

export const DisplayWordsAndUserInput = ({isOpen, isOver, gameId, words, player}: Props) => {
    const [userInput, setUserInput] = useState("");
    const textInput = useRef<Input>(null);
    const resetForm = () => setUserInput("");

    useEffect(() => {
        if (!isOpen) {
            textInput.current?.focus(); // user can immediate start typing once the game start
        } else {
            resetForm();
        }
    }, [isOpen]);

    const onUserInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // handle last word specially - to auto submit if the last word matches
        if (player.currentWordIndex === words.length - 1) {
            if (value.trim() === getCurrentWord(words, player).trim()) {
                socket.emit(SocketSentEventView.USER_INPUT, {userInput: value, gameId});
                resetForm();
            }
        }

        const lastChar = value.charAt(value.length - 1);
        if (lastChar === " " && value.trim() === getCurrentWord(words, player).trim()) {
            socket.emit(SocketSentEventView.USER_INPUT, {userInput, gameId});
            resetForm();
        } else {
            setUserInput(e.target.value);
        }
    };

    return (
        <>
            <DisplayWords words={words} player={player} userInput={userInput} />
            <Input fluid type="text" readOnly={isOpen || isOver} onChange={onUserInput} value={userInput} ref={textInput} placeholder={getCurrentWord(words, player)} />
        </>
    );
};

DisplayWordsAndUserInput.displayName = "DisplayWordsAndUserInput";
