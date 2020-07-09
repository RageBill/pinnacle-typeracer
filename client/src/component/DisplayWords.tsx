import React from "react";
import {Game, Player} from "../type";
import {Header, Segment} from "semantic-ui-react";

interface Props {
    words: Game["words"];
    player: Player;
    userInput: string;
}

const containerStyle = {
    marginTop: 36,
    marginBottom: 36,
};

export const DisplayWords = ({words, player, userInput}: Props) => {
    const typedWords = getTypedWords(words, player);
    const currentWord = getCurrentWord(words, player);
    const matchedChars = getMatchedChars(currentWord, userInput);
    const mistakenCharsLength = userInput.length - matchedChars.length;
    const restOfCharsLength = currentWord.length - matchedChars.length - mistakenCharsLength > 0 ? currentWord.length - matchedChars.length - mistakenCharsLength : 0;
    const wordsToBeTyped = getWordsToBeTyped(words, player);
    return (
        <Segment style={containerStyle}>
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
                <Header as="span" color="red" dividing>
                    {currentWord.slice(matchedChars.length, matchedChars.length + mistakenCharsLength)}
                </Header>
            )}
            {restOfCharsLength > 0 && (
                <Header as="span" dividing>
                    {currentWord.slice(matchedChars.length + mistakenCharsLength)}
                </Header>
            )}
            {wordsToBeTyped && <Header as="span">{wordsToBeTyped}</Header>}
        </Segment>
    );
};

DisplayWords.displayName = "DisplayWords";

function getTypedWords(words: Game["words"], player: Player): string {
    return words.slice(0, player.currentWordIndex).join(" ") + " ";
}

export function getCurrentWord(words: Game["words"], player: Player): string {
    return player.currentWordIndex < words.length ? words[player.currentWordIndex] : "";
}

function getMatchedChars(currentWord: string, userInput: string): string {
    if (currentWord.includes(userInput)) {
        return userInput;
    } else {
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
}

function getWordsToBeTyped(words: Game["words"], player: Player): string {
    // add an empty space before this to separate it from the current word
    return " " + words.slice(player.currentWordIndex + 1, words.length).join(" ");
}
