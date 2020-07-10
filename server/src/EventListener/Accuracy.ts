import {SocketEventListener, SocketReceivedEventView, SocketSentEventView} from "../type";
import {Game} from "../Models/Game";

export const accuracy: SocketEventListener<SocketReceivedEventView.ACCURACY> = (socket, io) => async ({gameId, playerSocketId, accuracy}) => {
    try {
        let game = await Game.findById(gameId);
        if (game) {
            const player = game.players.find((_) => _.socketId === playerSocketId);
            if (player) {
                player.accuracy = accuracy;
                game = await game.save();
                io.to(gameId).emit(SocketSentEventView.UPDATE_GAME, {game});
            }
        }
    } catch (e) {
        console.error(e);
    }
};
