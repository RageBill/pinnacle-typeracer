const express = require("express");
const app = express();
const socketio = require("socket.io");
const mongoose = require("mongoose");
const Game = require("./Models/Game");
const QuotableAPI = require("./QuotableAPI");

app.use("/", express.static("../client/build"));

const expressServer = app.listen(3001);
const io = socketio(expressServer);

mongoose.connect("mongodb://localhost:27017/pinnacleTyperacer", {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("successfully connected to database");
});

io.on("connect", (socket) => {
    socket.on("user-input", async ({userInput, gameId}) => {
        try {
            let game = await Game.findById(gameId);
            if (game.isOpen === false && game.isOver === false) {
                let player = game.players.find((player) => player.socketId === socket.id);
                let word = game.words[player.currentWordIndex];
                if (word === userInput) {
                    player.currentWordIndex++;
                    if (player.currentWordIndex !== game.words.length) {
                        game = await game.save();
                        io.to(gameId).emit("update-game", game);
                    } else {
                        const endTime = new Date().getTime();
                        const {startTime} = game;
                        player.WPM = calculateWPM(startTime, endTime, player);
                        game = await game.save();
                        socket.emit("done");
                        io.to(gameId).emit("update-game", game);
                    }
                }
            }
        } catch (e) {
            //
        }
    });

    socket.on("timer", async ({gameId, playerId}) => {
        let countDown = 3; // 3 seconds before start
        let game = await Game.findById(gameId);
        let player = game.players.id(playerId);
        if (player.isPartyLeader) {
            const timerId = setInterval(async () => {
                if (countDown >= 0) {
                    io.to(gameId).emit("timer", {countDown, msg: "Starting game soon..."});
                    countDown--;
                } else {
                    game.isOpen = false;
                    game = await game.save();
                    io.to(gameId).emit("update-game", game);
                    await startGameClock(gameId);
                    clearInterval(timerId);
                }
            }, 1000);
        }
    });

    socket.on("done", async () => {});

    socket.on("join-game", async ({gameId, nickName}) => {
        try {
            let game = await Game.findById(gameId);
            if (game.isOpen) {
                const gameId = game._id.toString();
                socket.join(gameId);
                let player = {
                    socketId: socket.id,
                    nickName,
                };
                game.players.push(player);
                game = await game.save();
                io.to(gameId).emit("update-game", game);
            }
        } catch (e) {
            console.log(e);
        }
    });

    socket.on("create-game", async (nickName) => {
        try {
            const quotableData = await QuotableAPI();
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
            io.to(gameId).emit("update-game", game);
        } catch (e) {
            console.log("error");
        }
    });
});

const startGameClock = async (gameId) => {
    const game = await Game.findById(gameId);
    game.startTime = new Date().getTime();
    await game.save();
    let time = 60; // total time for the race

    const timerId = setInterval(
        (function gameIntervalFunc() {
            const formatTime = calculateTime(time);
            if (time >= 0) {
                io.to(gameId).emit("timer", {countDown: formatTime, msg: "Time Remaining"});
                time--;
            } else {
                (async () => {
                    const endTime = new Date().getTime();
                    let game = await Game.findById(gameId);
                    const {startTime} = game;
                    game.isOver = true;
                    game.players.forEach((player, index) => {
                        // calculate WPM for all those who didn't finish the race
                        if (player.WPM === -1) {
                            game.players[index].WPM = calculateWPM(startTime, endTime, player);
                        }
                    });
                    game = await game.save();
                    io.to(gameId).emit("update-game", game);
                    clearInterval(timerId);
                })();
            }
            return gameIntervalFunc; // return the function for setInterval to execute
        })(), // execute the function immediately
        1000
    );
};

const calculateTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

const calculateWPM = (startTime, endTime, player) => {
    const numOfWords = player.currentWordIndex;
    const timeInSeconds = (endTime - startTime) / 1000;
    const timeInMinutes = timeInSeconds / 60;
    return Math.floor(numOfWords / timeInMinutes); // could potentially use 2 decimals
};
