import {Game, PlayerProps} from "../Models/Game";
import {SocketEventListener, SocketReceivedEventView, SocketSentEventView} from "../type";
import {startGameClock} from "../util";
import {getQuotableAPIData} from "../QuotableAPI";

let timerId: NodeJS.Timeout | null = null;

export const timer: SocketEventListener<SocketReceivedEventView.TIMER> = (socket, io) => async ({gameId, playerId}) => {
    let game = await Game.findById(gameId);
    // Two cases: [1] isOpen (start new game) or [2] isOver (make game room open again)
    if (game) {
        // Case 1: start new game
        if (game.isOpen) {
            let countDown = 5; // 5 seconds before start
            const player = game.players.id(playerId);
            if (player && player.isPartyLeader) {
                timerId = setInterval(async () => {
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
                        clearInterval(timerId!);
                        timerId = null;
                    }
                }, 1000);
            }
        }

        // Case 2: make game room open again
        if (game.isOver) {
            const minLength = Math.round(Math.random() * 200); // From 0 characters to 200 characters
            game.words = await getQuotableAPIData({minLength, maxLength: 400}); // Max 400 characters
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
    }
};
