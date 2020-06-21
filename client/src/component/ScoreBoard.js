import React from "react";
import {Label, Table} from "semantic-ui-react";

export const ScoreBoard = ({players, player: myself}) => {
    const scoreBoard = getScoreBoard(players);
    return (
        scoreBoard.length > 0 && (
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
                        <Table.Row>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{player._id === myself._id ? <Label ribbon>You</Label> : player.nickName}</Table.Cell>
                            <Table.Cell>{player.WPM}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        )
    );
};

function getScoreBoard(players) {
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
