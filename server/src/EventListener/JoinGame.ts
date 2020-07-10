import {Game} from "../Models/Game";
import {SocketEventListener, SocketReceivedEventView, SocketSentEventView} from "../type";

export const joinGame: SocketEventListener<SocketReceivedEventView.JOIN_GAME> = (socket, io) => async ({gameId, nickName}) => {
    try {
        let game = await Game.findById(gameId);
        if (game && game.isOpen) {
            const gameId = game._id.toString();
            socket.join(gameId);
            const player = {
                socketId: socket.id,
                nickName,
            };
            game.players.push(player);
            game = await game.save();
            io.to(gameId).emit(SocketSentEventView.UPDATE_GAME, {game});
        }
    } catch (e) {
        console.error(e);
    }
};
