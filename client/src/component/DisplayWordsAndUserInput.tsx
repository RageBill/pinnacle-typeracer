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
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const textInput = useRef<Input>(null);
    const clearForm = () => setUserInput("");

    useEffect(() => {
        if (!isOpen) {
            textInput.current?.focus(); // user can immediate start typing once the game start
        } else {
            clearForm();
            setCurrentWordIndex(0);
        }
    }, [isOpen]);

    const onUserInput = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // handle last word specially - to auto submit if the last word matches
        if (player.currentWordIndex === words.length - 1) {
            if (value.trim() === getCurrentWord(words, currentWordIndex).trim()) {
                socket.emit(SocketSentEventView.USER_INPUT, {userInput: value, gameId});
                setCurrentWordIndex(currentWordIndex + 1);
                clearForm();
            }
        }

        const lastChar = value.charAt(value.length - 1);
        if (lastChar === " " && value.trim() === getCurrentWord(words, currentWordIndex).trim()) {
            socket.emit(SocketSentEventView.USER_INPUT, {userInput, gameId});
            setCurrentWordIndex(currentWordIndex + 1);
            clearForm();
        } else {
            setUserInput(e.target.value);
        }
    };

    return (
        <>
            <DisplayWords words={words} currentWordIndex={currentWordIndex} userInput={userInput} isOpen={isOpen} gameId={gameId} playerSocketId={player.socketId} WPM={player.WPM} accuracy={player.accuracy} />
            <Input fluid type="text" disabled={currentWordIndex >= words.length || isOpen || isOver} onChange={onUserInput} value={userInput} ref={textInput} placeholder={getCurrentWord(words, currentWordIndex)} />
        </>
    );
};

DisplayWordsAndUserInput.displayName = "DisplayWordsAndUserInput";
