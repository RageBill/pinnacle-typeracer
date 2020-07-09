import React, {useEffect, useMemo, useState} from "react";
import {Container, Header, Progress, Segment} from "semantic-ui-react";
import {Game, Player, semanticColors} from "../type";
import {getScoreBoard} from "./ScoreBoard";

interface Props {
    players: Game["players"];
    player: Player;
    words: Game["words"];
}

export const ProgressBar = ({players, player: myself, words}: Props) => {
    const [ownProgress, setOwnProgress] = useState(0);
    const playerColor = getPlayerColor(players.findIndex((_) => _.socketId === myself.socketId));
    const scoreBoard = useMemo(() => getScoreBoard(players), [players]);
    const ownRanking = scoreBoard.findIndex((_) => _.socketId === myself.socketId);

    useEffect(() => {
        setOwnProgress(calculatePercentage(myself, words));
    }, [myself, words]);

    const getProgressHeaderStyle = (progress: number) => {
        return progress > 50
            ? {
                  position: "absolute",
                  margin: 0,
                  right: `${Math.min(100 - progress + 1, 45)}%`,
              }
            : {
                  position: "absolute",
                  margin: 0,
                  left: `${Math.min(progress + 1, 45)}%`,
              };
    };

    return (
        <Container textAlign="left">
            <Segment style={{padding: 6, marginTop: 12, marginBottom: 60, height: 40}}>
                <Progress percent={ownProgress} color={playerColor} attached="top" />
                <Header as="span" color={playerColor} style={getProgressHeaderStyle(ownProgress)}>
                    {`You (${myself.nickName})`}
                    {ownRanking >= 0 && ` [# ${ownRanking + 1}]`}
                </Header>
                <Progress percent={ownProgress} color={playerColor} attached="bottom" />
            </Segment>
            {players.map((player, index) => {
                const playerProgress = calculatePercentage(player, words);
                const playerColor = getPlayerColor(index);
                const playerRanking = scoreBoard.findIndex((_) => _.socketId === player.socketId);
                return player.socketId !== myself.socketId ? (
                    <Segment style={{padding: 6, marginBottom: 12, height: 40}}>
                        <Progress percent={playerProgress} color={playerColor} attached="top" />
                        <Header as="span" color={playerColor} style={getProgressHeaderStyle(playerProgress)}>
                            {player.nickName}
                            {playerRanking >= 0 && ` [# ${playerRanking + 1}]`}
                        </Header>
                        <Progress percent={playerProgress} color={playerColor} attached="bottom" />
                    </Segment>
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
