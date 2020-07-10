import React, {useEffect, useRef, useState} from "react";
import {Game, Player, SocketSentEventView} from "../type";
import {Header, Segment} from "semantic-ui-react";
import {socket} from "../socketConfig";

interface Props {
    words: Game["words"];
    currentWordIndex: number;
    userInput: string;
    isOpen: Game["isOpen"];
    gameId: Game["_id"];
    playerSocketId: Player["socketId"];
    WPM: Player["WPM"];
}

const containerStyle = {
    marginTop: 36,
    marginBottom: 36,
};

export const DisplayWords = ({words, currentWordIndex, userInput, isOpen, gameId, playerSocketId, WPM}: Props) => {
    const [misTypedChars, setMisTypedChars] = useState(0);
    const typedWords = getTypedWords(words, currentWordIndex);
    const currentWord = getCurrentWord(words, currentWordIndex);
    const matchedChars = getMatchedChars(currentWord, userInput);
    const mistakenCharsLength = userInput.length - matchedChars.length;
    const restOfCharsLength = currentWord.length - matchedChars.length - mistakenCharsLength > 0 ? currentWord.length - matchedChars.length - mistakenCharsLength : 0;
    const wordsToBeTyped = getWordsToBeTyped(words, currentWordIndex);
    const overflowFromMistakenCharsLength = userInput.length > currentWord.length ? userInput.length - currentWord.length : 0;

    const prevMistakenCharsLength = usePrevious(mistakenCharsLength);
    useEffect(() => {
        // Reset counting misTypedChars
        if (isOpen) {
            setMisTypedChars(0);
        }

        // Only add misTyped chars when number of mistakenChars increases
        if (currentWordIndex < words.length && mistakenCharsLength > 0 && mistakenCharsLength > prevMistakenCharsLength) {
            setMisTypedChars(misTypedChars + 1);
        }

        // When game is over, and the player finishes the whole passage, send the calculation to the server.
        if (WPM >= 0) {
            socket.emit(SocketSentEventView.ACCURACY, {gameId, playerSocketId, accuracy: Math.max(typedWords.trim().length - misTypedChars, 0) / typedWords.trim().length});
        }
    }, [isOpen, currentWordIndex, words, mistakenCharsLength, prevMistakenCharsLength, WPM, gameId, playerSocketId, typedWords, misTypedChars]);

    return (
        <Segment style={containerStyle} textAlign="left">
            {typedWords && (
                <Header as="span" color="green">
                    {typedWords}
                </Header>
            )}
            {matchedChars && (
                <Header as="span" color="green" dividing>
                    {matchedChars}
                </Header>
            )}
            {mistakenCharsLength > 0 && (
                <Header as="span" color="red" dividing style={{backgroundColor: "pink"}}>
                    {currentWord.slice(matchedChars.length, matchedChars.length + mistakenCharsLength)}
                </Header>
            )}
            {restOfCharsLength > 0 && (
                <Header as="span" dividing>
                    {currentWord.slice(matchedChars.length + mistakenCharsLength)}
                </Header>
            )}
            {overflowFromMistakenCharsLength > 0 && wordsToBeTyped && (
                <Header as="span" color="red" dividing style={{backgroundColor: "pink"}}>
                    {wordsToBeTyped.slice(0, overflowFromMistakenCharsLength)}
                </Header>
            )}
            {wordsToBeTyped && <Header as="span">{wordsToBeTyped.slice(overflowFromMistakenCharsLength)}</Header>}
        </Segment>
    );
};

DisplayWords.displayName = "DisplayWords";

function getTypedWords(words: Game["words"], currentWordIndex: number): string {
    const typedWords = words.slice(0, currentWordIndex).join(" ");
    return typedWords.length > 0 ? typedWords + " " : "";
}

export function getCurrentWord(words: Game["words"], currentWordIndex: number): string {
    return currentWordIndex < words.length ? words[currentWordIndex] : "";
}

function getMatchedChars(currentWord: string, userInput: string): string {
    let matchedChars = "";
    for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === currentWord[i]) {
            matchedChars += userInput[i];
        } else {
            break;
        }
    }
    return matchedChars;
}

function getWordsToBeTyped(words: Game["words"], currentWordIndex: number): string {
    // add an empty space before this to separate it from the current word
    return " " + words.slice(currentWordIndex + 1, words.length).join(" ");
}

// Custom Hooks
function usePrevious(value: any): any {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
