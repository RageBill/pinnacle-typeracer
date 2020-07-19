import {Game, PlayerProps} from "./Models/Game";
import {IO, SocketSentEventView} from "./type";

/**
 * Similar to [globalThis.setInterval], but calls the handler function immediately instead of after initial delay.
 * @param handler callback function to execute every [delay] milliseconds
 * @param delay   time (in milliseconds) delay between executions of [handler]
 * @param args    arguments passed to [handler] during execution
 */
function setIntervalImmediately<Args extends any[]>(handler: (...args: Args) => void, delay: number = 0, ...args: Args): NodeJS.Timeout {
    handler(...args);
    return setInterval(handler as (...args: any[]) => void, delay, ...args);
}

const startGameClock = (io: IO) => async (gameId: string) => {
    const game = await Game.findById(gameId);
    if (game) {
        game.startTime = new Date().getTime();
        await game.save();
        let time = Math.ceil((game.words.length * 60) / 40); // calculate total time for the race - the baseline is 40 wpm to finish the race

        const timerId = setIntervalImmediately(async () => {
            const game = await Game.findById(gameId);
            if (game) {
                const formatTime = calculateTime(time);
                if (time > 0 && !game.isOver) {
                    io.to(gameId).emit(SocketSentEventView.TIMER, {countDown: formatTime, msg: "Time Remaining"});
                    time--;
                } else {
                    clearInterval(timerId);
                    io.to(gameId).emit(SocketSentEventView.TIMER, {countDown: formatTime, msg: "Race Ended"});
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
                }
            }
        }, 1000);
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
