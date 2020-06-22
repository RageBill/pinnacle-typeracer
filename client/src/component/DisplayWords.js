import React from "react";
import {Header, Segment} from "semantic-ui-react";

const containerStyle = {
    marginTop: 36,
    marginBottom: 36,
};

export const DisplayWords = ({words, player}) => {
    const typedWords = getTypedWords(words, player);
    const currentWord = getCurrentWord(words, player);
    const wordsToBeTyped = getWordsToBeTyped(words, player);
    return (
        <Segment style={containerStyle}>
            {typedWords && (
                <Header as="span" color="green">
                    {typedWords}
                </Header>
            )}
            {currentWord && (
                <Header as="span" color="blue" dividing>
                    {currentWord}
                </Header>
            )}
            {wordsToBeTyped && <Header as="span">{wordsToBeTyped}</Header>}
        </Segment>
    );
};

function getTypedWords(words, player) {
    return words.slice(0, player.currentWordIndex).join(" ") + " ";
}

export function getCurrentWord(words, player) {
    return player.currentWordIndex < words.length ? words[player.currentWordIndex] + " " : "";
}

function getWordsToBeTyped(words, player) {
    return words.slice(player.currentWordIndex + 1, words.length).join(" ");
}
