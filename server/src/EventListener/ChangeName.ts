import {Game} from "../Models/Game";
import {SocketEventListener, SocketReceivedEventView, SocketSentEventView} from "../type";

export const changeName: SocketEventListener<SocketReceivedEventView.CHANGE_NAME> = (socket, io) => async ({nickName, playerSocketId, gameId}) => {
    try {
        let game = await Game.findById(gameId);
        if (game && (game.isOpen || game.isOver)) {
            const player = game.players.find((player) => player.socketId === playerSocketId);
            if (player) {
                player.nickName = nickName;
                game = await game.save();
                io.to(gameId).emit(SocketSentEventView.UPDATE_GAME, {game});
            }
        }
    } catch (e) {
        console.error(e);
    }
};
