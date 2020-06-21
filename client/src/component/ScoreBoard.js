import React from "react";

export const ScoreBoard = ({players}) => {
    const scoreBoard = getScoreBoard(players);
    return (
        scoreBoard.length > 0 && (
            <table>
                <thead>
                    <tr>#</tr>
                    <tr>Player</tr>
                    <tr>WPM</tr>
                </thead>
                <tbody>
                    {scoreBoard.map((player, index) => (
                        <tr>
                            <th>{index + 1}</th>
                            <td>{player.nickName}</td>
                            <td>{player.WPM}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
