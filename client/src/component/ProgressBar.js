import React from "react";
import {Progress} from "semantic-ui-react";

export const ProgressBar = ({players, player: myself, words}) => {
    const ownProgress = React.useMemo(() => calculatePercentage(myself, words), [myself, words]);

    return (
        <div>
            <h5>{myself.nickName}</h5>
            <div key={myself._id}>
                <Progress percent={ownProgress} indicating precision={2} />
            </div>
            {players.map((player) => {
                const playerProgress = calculatePercentage(player, words);
                return player._id !== myself._id ? (
                    <>
                        <h5>{player.nickName}</h5>
                        <div key={player._id}>
                            <Progress percent={playerProgress} precision={2} />
                        </div>
                    </>
                ) : null;
            })}
        </div>
    );
};

function calculatePercentage(player, words) {
    if (player.currentWordIndex !== 0) {
        return (player.currentWordIndex / words.length) * 100;
    }
}
