import React from "react";
import {Container, Header, Progress} from "semantic-ui-react";

const SemanticCOLORS = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black"];

export const ProgressBar = ({players, player: myself, words}) => {
    const ownProgress = React.useMemo(() => calculatePercentage(myself, words), [myself, words]);

    return (
        <Container textAlign="left">
            <Header as="h3" color={getRandomColor()}>
                {`You (${myself.nickName})`}
            </Header>
            <Progress percent={ownProgress} indicating precision={2} size="large" />
            {players.map((player) => {
                const playerProgress = calculatePercentage(player, words);
                return player._id !== myself._id ? (
                    <>
                        <Header as="h3" color={getRandomColor()}>
                            {player.nickName}
                        </Header>
                        <Progress percent={playerProgress} precision={2} size="large" />
                    </>
                ) : null;
            })}
        </Container>
    );
};

function calculatePercentage(player, words) {
    if (player.currentWordIndex !== 0) {
        return (player.currentWordIndex / words.length) * 100;
    }
}

function getRandomColor() {
    const totalColors = SemanticCOLORS.length;
    return SemanticCOLORS[Math.floor(Math.random() * totalColors)];
}
