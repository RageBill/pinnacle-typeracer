const express = require("express");
const app = express();
const socketio = require("socket.io");
const mongoose = require("mongoose");
const Game = require("./Models/Game");
const QuotableAPI = require("./QuotableAPI");

const expressServer = app.listen(3001);
const io = socketio(expressServer);

mongoose.connect("mongodb://localhost:27017/pinnacleTyperacer", {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("successfully connected to database");
});

io.on("connect", (socket) => {
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
                io.to(gameId).emit("updateGame", game);
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
            io.to(gameId).emit("updateGame", game);
        } catch (e) {
            console.log("error");
        }
    });
});
