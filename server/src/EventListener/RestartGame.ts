import {Game, PlayerProps} from "../Models/Game";
import {getQuotableAPIData} from "../QuotableAPI";
import {SocketEventListener, SocketReceivedEventView, SocketSentEventView} from "../type";

export const restartGame: SocketEventListener<SocketReceivedEventView.RESTART_GAME> = (socket, io) => async ({gameId}) => {
    try {
        let game = await Game.findById(gameId);
        if (game && game.isOpen === false && game.isOver) {
            game.words = await getQuotableAPIData();
            game.isOpen = true;
            game.isOver = false;
            // Remove disconnected players
            io.clients((err: Error, clients: string[]) => {
                if (err) {
                    console.error(err);
                }
                if (game) {
                    game.players = game.players.filter((player) => clients.includes(player.socketId));
                }
            });
            game.players.forEach((player: PlayerProps) => {
                player.currentWordIndex = 0;
                player.WPM = -1;
            });
            game = await game.save();
            io.to(gameId).emit(SocketSentEventView.UPDATE_GAME, {game});
        }
    } catch (e) {
        console.error(e);
    }
};
