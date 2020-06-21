import React from "react";

export const DisplayWords = ({words, player}) => {
    return (
        <>
            {getTypedWords(words, player)}
            {getCurrentWord(words, player)}
            {getWordsToBeTyped(words, player)}
        </>
    );
};

const typedCorrectlyStyle = {
    backgroundColor: "#34eb77",
};

function getTypedWords(words, player) {
    const typedWords = words.slice(0, player.currentWordIndex).join(" ");
    return <span style={typedCorrectlyStyle}>{typedWords} </span>;
}

const currentStyle = {
    textDecoration: "underline",
};

function getCurrentWord(words, player) {
    return <span style={currentStyle}>{words[player.currentWordIndex]} </span>;
}

function getWordsToBeTyped(words, player) {
    const wordsToBeTyped = words.slice(player.currentWordIndex + 1, words.length).join(" ");
    return <span>{wordsToBeTyped}</span>;
}
