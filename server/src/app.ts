import express from "express";
import socketio from "socket.io";
import mongoose from "mongoose";
import {IO, Socket, SocketReceivedEventView} from "./type";
import {createGame, joinGame, timer, userInput, changePassage} from "./EventListener";

const app = express();

app.use("/", express.static("../client/build"));

const expressServer = app.listen(3001);
const io: IO = socketio(expressServer);

mongoose.connect("mongodb://localhost:27017/pinnacleTyperacer", {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.info("successfully connected to database");
});

io.on("connect", (socket: Socket) => {
    socket.on(SocketReceivedEventView.CREATE_GAME, createGame(socket, io));
    socket.on(SocketReceivedEventView.JOIN_GAME, joinGame(socket, io));
    socket.on(SocketReceivedEventView.TIMER, timer(socket, io));
    socket.on(SocketReceivedEventView.USER_INPUT, userInput(socket, io));
    socket.on(SocketReceivedEventView.CHANGE_PASSAGE, changePassage(socket, io));
});
