import {Game} from "../Models/Game";
import {SocketEventListener, SocketReceivedEventView, SocketSentEventView} from "../type";
import {startGameClock} from "../util";

export const timer: SocketEventListener<SocketReceivedEventView.TIMER> = (socket, io) => async ({gameId, playerId}) => {
    let countDown = 3; // 3 seconds before start
    let game = await Game.findById(gameId);
    const player = game?.players.id(playerId);
    if (player && player.isPartyLeader) {
        const timerId = setInterval(async () => {
            if (countDown >= 0) {
                io.to(gameId).emit(SocketSentEventView.TIMER, {countDown, msg: "Starting game soon..."});
                countDown--;
            } else {
                if (game) {
                    game.isOpen = false;
                    game = await game.save();
                    io.to(gameId).emit(SocketSentEventView.UPDATE_GAME, {game});
                }
                await startGameClock(io)(gameId);
                clearInterval(timerId);
            }
        }, 1000);
    }
};
