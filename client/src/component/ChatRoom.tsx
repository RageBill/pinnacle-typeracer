import React from "react";
import {Game, Player} from "../type";

interface Props {
    gameId: Game["_id"];
    player: Player;
}

export const ChatRoom = ({gameId, player}: Props) => {
    return <div />;
};

ChatRoom.displayName = "ChatRoom";
