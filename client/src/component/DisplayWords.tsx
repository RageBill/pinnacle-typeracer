import React from "react";
import {Header, Segment} from "semantic-ui-react";
import {Game, Player} from "../type";

interface Props {
    words: Game["words"];
    player: Player;
}

const containerStyle = {
    marginTop: 36,
    marginBottom: 36,
};

export const DisplayWords = ({words, player}: Props) => {
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

DisplayWords.displayName = "DisplayWords";

function getTypedWords(words: Game["words"], player: Player): string {
    return words.slice(0, player.currentWordIndex).join(" ") + " ";
}

export function getCurrentWord(words: Game["words"], player: Player): string {
    return player.currentWordIndex < words.length ? words[player.currentWordIndex] + " " : "";
}

function getWordsToBeTyped(words: Game["words"], player: Player): string {
    return words.slice(player.currentWordIndex + 1, words.length).join(" ");
}
