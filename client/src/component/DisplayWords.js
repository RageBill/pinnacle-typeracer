import React from "react";
import {Header, Segment} from "semantic-ui-react";

const containerStyle = {
    marginTop: 36,
    marginBottom: 36,
};

export const DisplayWords = ({words, player}) => {
    return (
        <Segment style={containerStyle}>
            <Header as="span" color="green">
                {getTypedWords(words, player)}
            </Header>
            <Header as="span" color="blue" dividing>
                {getCurrentWord(words, player)}
            </Header>
            <Header as="span">{getWordsToBeTyped(words, player)}</Header>
        </Segment>
    );
};

function getTypedWords(words, player) {
    return words.slice(0, player.currentWordIndex).join(" ") + " ";
}

export function getCurrentWord(words, player) {
    return words[player.currentWordIndex] + " ";
}

function getWordsToBeTyped(words, player) {
    return words.slice(player.currentWordIndex + 1, words.length).join(" ");
}
