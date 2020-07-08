import React, {useEffect, useState} from "react";
import {Container, Header, Progress, SemanticCOLORS} from "semantic-ui-react";
import {Game, Player} from "../type";

const semanticColors: SemanticCOLORS[] = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black"];

interface Props {
    players: Game["players"];
    player: Player;
    words: Game["words"];
}

export const ProgressBar = ({players, player: myself, words}: Props) => {
    const [ownProgress, setOwnProgress] = useState(0);
    const ownIndex = players.findIndex((_) => _.socketId === myself.socketId);

    useEffect(() => {
        setOwnProgress(calculatePercentage(myself, words));
    }, [myself, words]);

    return (
        <Container textAlign="left">
            <Header as="h3" color={getPlayerColor(ownIndex)} style={{position: "relative", left: `${ownProgress}%`, transition: "left"}}>
                {`You (${myself.nickName})`}
            </Header>
            <Progress percent={ownProgress} indicating precision={2} size="large" />
            {players.map((player, index) => {
                const playerProgress = calculatePercentage(player, words);
                return player.socketId !== myself.socketId ? (
                    <>
                        <Header as="h3" color={getPlayerColor(index)} style={{position: "relative", left: `${playerProgress}%`, transition: "left"}}>
                            {player.nickName}
                        </Header>
                        <Progress percent={playerProgress} precision={2} size="large" />
                    </>
                ) : null;
            })}
        </Container>
    );
};

ProgressBar.displayName = "ProgressBar";

function calculatePercentage(player: Player, words: Game["words"]) {
    if (player.currentWordIndex !== 0) {
        return (player.currentWordIndex / words.length) * 100;
    } else {
        return 0;
    }
}

function getPlayerColor(index: number) {
    return semanticColors[index % semanticColors.length];
}
