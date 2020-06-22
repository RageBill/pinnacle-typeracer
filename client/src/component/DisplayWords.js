import React from "react";
import {Header, Segment} from "semantic-ui-react";

const containerStyle = {
    marginTop: 24,
};

export const DisplayWords = ({words, player}) => {
    return (
        <Segment style={containerStyle}>
            {getTypedWords(words, player)}
            {getCurrentWord(words, player)}
            {getWordsToBeTyped(words, player)}
        </Segment>
    );
};

function getTypedWords(words, player) {
    const typedWords = words.slice(0, player.currentWordIndex).join(" ");
    return (
        <Header as="span" color="green">
            {typedWords}{" "}
        </Header>
    );
}

function getCurrentWord(words, player) {
    return (
        <Header as="span" color="blue" dividing>
            {words[player.currentWordIndex]}{" "}
        </Header>
    );
}

function getWordsToBeTyped(words, player) {
    const wordsToBeTyped = words.slice(player.currentWordIndex + 1, words.length).join(" ");
    return <Header as="span">{wordsToBeTyped}</Header>;
}
