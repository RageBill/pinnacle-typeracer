import express from "express";
import socketio from "socket.io";
import mongoose from "mongoose";
import {IO, Socket, SocketReceivedEventView} from "./type";
import {accuracy, changeName, changePassage, chatMessage, createGame, joinGame, timer, userInput} from "./EventListener";

const app = express();

app.use("/", express.static("../client/build"));

app.use("/game/*", express.static("../client/build"));

const expressServer = app.listen(3001);
const io: IO = socketio(expressServer);

mongoose.connect("mongodb://localhost:27017/pinnacleTyperacer", {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) {
        console.error("error connecting to database", err);
        process.exit(1);
    } else {
        console.info("successfully connected to database");
    }
});

io.on("connect", (socket: Socket) => {
    socket.on(SocketReceivedEventView.CREATE_GAME, createGame(socket, io));
    socket.on(SocketReceivedEventView.JOIN_GAME, joinGame(socket, io));
    socket.on(SocketReceivedEventView.TIMER, timer(socket, io));
    socket.on(SocketReceivedEventView.USER_INPUT, userInput(socket, io));
    socket.on(SocketReceivedEventView.CHANGE_PASSAGE, changePassage(socket, io));
    socket.on(SocketReceivedEventView.CHANGE_NAME, changeName(socket, io));
    socket.on(SocketReceivedEventView.CHAT_MESSAGE, chatMessage(socket, io));
    socket.on(SocketReceivedEventView.ACCURACY, accuracy(socket, io));
});
