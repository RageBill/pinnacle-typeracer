const express = require("express");
const app = express();
const socketio = require("socket.io");
const mongoose = require("mongoose");

const expressServer = app.listen(3001);
const io = socketio(expressServer);

const Game = require("./Models/Game");

mongoose.connect("mongodb://localhost:27017/pinnacleTyperacer", {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("successfully connected to database");
});
