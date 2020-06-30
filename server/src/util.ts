import {Game, PlayerProps} from "./Models/Game";
import {IO, SocketSentEventView} from "./type";

const startGameClock = (io: IO) => async (gameId: string) => {
    const game = await Game.findById(gameId);
    if (game) {
        game.startTime = new Date().getTime();
        await game.save();
        let time = 60; // total time for the race

        const timerId = setInterval(
            (function gameIntervalFunc() {
                const formatTime = calculateTime(time);
                if (time >= 0) {
                    io.to(gameId).emit(SocketSentEventView.TIMER, {countDown: formatTime, msg: "Time Remaining"});
                    time--;
                } else {
                    (async () => {
                        const endTime = new Date().getTime();
                        let game = await Game.findById(gameId);
                        if (game) {
                            const {startTime} = game;
                            game.isOver = true;
                            game.players.forEach((player: PlayerProps, index: number) => {
                                // calculate WPM for all those who didn't finish the race
                                if (game && player.WPM === -1) {
                                    game.players[index].WPM = calculateWPM(startTime!, endTime, player);
                                }
                            });
                            game = await game.save();
                            io.to(gameId).emit(SocketSentEventView.UPDATE_GAME, {game});
                        }
                        clearInterval(timerId!);
                    })();
                }
                return gameIntervalFunc; // return the function for setInterval to execute
            })(), // execute the function immediately
            1000
        );
    }
};

const calculateTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

const calculateWPM = (startTime: number, endTime: number, player: PlayerProps) => {
    const numOfWords = player.currentWordIndex;
    const timeInSeconds = (endTime - startTime) / 1000;
    const timeInMinutes = timeInSeconds / 60;
    return Math.floor(numOfWords / timeInMinutes); // could potentially use 2 decimals
};

export {startGameClock, calculateTime, calculateWPM};
