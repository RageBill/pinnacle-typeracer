import React from "react";
import {Label, Table} from "semantic-ui-react";
import {Game, Player} from "../type";

export const ScoreBoard = ({players, player: myself}: {players: Game["players"]; player: Player}) => {
    const scoreBoard = getScoreBoard(players);
    return scoreBoard.length > 0 ? (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>Player</Table.HeaderCell>
                    <Table.HeaderCell>WPM</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {scoreBoard.map((player, index) => (
                    <Table.Row key={player.socketId}>
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>{player.socketId === myself.socketId ? <Label ribbon>You</Label> : player.nickName}</Table.Cell>
                        <Table.Cell>{player.WPM}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    ) : (
        <div />
    );
};

function getScoreBoard(players: Game["players"]) {
    const scoreBoard = players.filter((player) => player.WPM !== -1);
    return scoreBoard.sort((a, b) => {
        if (a.WPM > b.WPM) {
            return -1;
        } else if (b.WPM > a.WPM) {
            return 1;
        } else {
            return 0;
        }
    });
}
