import {Game, PlayerProps} from "../Models/Game";
import {SocketEventListener, SocketReceivedEventView, SocketSentEventView} from "../type";
import {calculateWPM} from "../util";

export const userInput: SocketEventListener<SocketReceivedEventView.USER_INPUT> = (socket, io) => async ({userInput, gameId}) => {
    try {
        let game = await Game.findById(gameId);
        if (game && game.isOpen === false && game.isOver === false) {
            const player = game.players.find((player: PlayerProps) => player.socketId === socket.id);
            if (player) {
                const word = game.words[player.currentWordIndex];
                if (word === userInput) {
                    player.currentWordIndex++;
                    if (player.currentWordIndex !== game.words.length) {
                        game = await game.save();
                        io.to(gameId).emit(SocketSentEventView.UPDATE_GAME, {game});
                    } else {
                        const endTime = new Date().getTime();
                        const {startTime} = game;
                        player.WPM = calculateWPM(startTime!, endTime, player);

                        if (game.isOpen === false && game.isOver === false) {
                            if (game.players.every((player: PlayerProps) => player.WPM >= 0)) {
                                game.isOver = true;
                            }
                        }
                        game = await game.save();

                        io.to(gameId).emit(SocketSentEventView.UPDATE_GAME, {game});
                    }
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
};
