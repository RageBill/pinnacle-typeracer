// Side effect import, do not re-order
require("dotenv").config();

import express from "express";
import socketio from "socket.io";
import mongoose from "mongoose";
import {getQuotableAPIData} from "./QuotableAPI";
import {Game, PlayerProps} from "./Models/Game";
import {IO, Socket, SocketReceivedEventView, SocketSentEventView} from "./type";

const app = express();

app.use("/", express.static("../client/build"));

const expressServer = app.listen(3001);
const io: IO = socketio(expressServer);

mongoose.connect("mongodb://localhost:27017/pinnacleTyperacer", {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.info("successfully connected to database");
});

io.on("connect", (socket: Socket) => {
    socket.on(SocketReceivedEventView.RESTART_GAME, async ({gameId}) => {
        try {
            let game = await Game.findById(gameId);
            if (game && game.isOpen === false && game.isOver) {
                const quotableData = await getQuotableAPIData();
                game.words = quotableData;
                game.isOpen = true;
                game.isOver = false;
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
    });

    socket.on(SocketReceivedEventView.USER_INPUT, async ({userInput, gameId}) => {
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
                            game = await game.save();
                            socket.emit(SocketSentEventView.DONE, {gameId});

                            if (game.isOpen === false && game.isOver === false) {
                                if (game.players.every((player: PlayerProps) => player.WPM >= 0)) {
                                    game.isOver = true;
                                }
                                game = await game.save();
                            }

                            io.to(gameId).emit(SocketSentEventView.UPDATE_GAME, {game});
                        }
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    });

    socket.on(SocketReceivedEventView.TIMER, async ({gameId, playerId}) => {
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
                    await startGameClock(gameId);
                    clearInterval(timerId);
                }
            }, 1000);
        }
    });

    socket.on(SocketReceivedEventView.JOIN_GAME, async ({gameId, nickName}) => {
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
    });

    socket.on(SocketReceivedEventView.CREATE_GAME, async ({nickName}) => {
        try {
            const quotableData = await getQuotableAPIData();
            let game = new Game();
            game.words = quotableData;
            const player = {
                socketId: socket.id,
                isPartyLeader: true,
                nickName,
            };
            game.players.push(player);
            game = await game.save();

            const gameId = game._id.toString();
            socket.join(gameId);
            io.to(gameId).emit(SocketSentEventView.UPDATE_GAME, {game});
        } catch (e) {
            console.error(e);
        }
    });
});

/**
 * Helper functions
 */

const startGameClock = async (gameId: string) => {
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
