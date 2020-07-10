import React, {useEffect, useMemo, useState} from "react";
import {Container, Header, Icon, Progress, Segment} from "semantic-ui-react";
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

    return (
        <Container textAlign="left">
            <Segment style={{padding: 6, marginTop: 24, marginBottom: 60, height: 40}}>
                <Progress percent={ownProgress} color={playerColor} attached="top" />
                <div style={{display: "flex", alignItems: "center"}}>
                    <Header as="span" color={playerColor} style={{flexGrow: ownProgress, flexShrink: 0, display: "inline", transition: "all 1s linear", margin: 0}} textAlign="right">
                        {`You (${myself.nickName})`}
                        {ownRanking >= 0 && ` [# ${ownRanking + 1}]`}
                    </Header>
                    <div style={{flex: 100 - ownProgress, transition: "all 1s linear"}} />
                </div>
                <Progress percent={ownProgress} color={playerColor} attached="bottom" />
                <div style={{position: "absolute", width: "100%", top: -22, zIndex: 2}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div style={{flex: ownProgress, display: "inline", transition: "all 1s linear"}}>
                            <Icon name="wheelchair" size="large" color={playerColor} style={{float: "right"}} />
                        </div>
                        <div style={{flex: 100 - ownProgress, transition: "all 1s linear"}} />
                    </div>
                </div>
            </Segment>
            {players.map((player, index) => {
                const playerProgress = calculatePercentage(player, words);
                const playerColor = getPlayerColor(index);
                const playerRanking = scoreBoard.findIndex((_) => _.socketId === player.socketId);
                return player.socketId !== myself.socketId ? (
                    <Segment style={{padding: 6, marginBottom: 30, height: 40}}>
                        <Progress percent={playerProgress} color={playerColor} attached="top" />
                        <div style={{display: "flex", alignItems: "center"}}>
                            <Header as="span" color={playerColor} style={{flexGrow: playerProgress, flexShrink: 0, display: "inline", transition: "all 1s linear", margin: 0}} textAlign="right">
                                {player.nickName}
                                {playerRanking >= 0 && ` [# ${playerRanking + 1}]`}
                            </Header>
                            <div style={{flex: 100 - playerProgress, transition: "all 1s linear"}} />
                        </div>
                        <Progress percent={playerProgress} color={playerColor} attached="bottom" />
                        <div style={{position: "absolute", width: "100%", top: -22, zIndex: 2}}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <div style={{flex: playerProgress, display: "inline", transition: "all 1s linear"}}>
                                    <Icon name="wheelchair" size="large" color={playerColor} style={{float: "right"}} />
                                </div>
                                <div style={{flex: 100 - playerProgress, transition: "all 1s linear"}} />
                            </div>
                        </div>
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
