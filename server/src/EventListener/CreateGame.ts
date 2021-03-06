import {getQuotableAPIData} from "../QuotableAPI";
import {Game} from "../Models/Game";
import {SocketEventListener, SocketReceivedEventView, SocketSentEventView} from "../type";

export const createGame: SocketEventListener<SocketReceivedEventView.CREATE_GAME> = (socket, io) => async ({nickName}) => {
    try {
        const minLength = Math.round(Math.random() * 200); // From 0 characters to 200 characters
        const quotableData = await getQuotableAPIData({minLength, maxLength: 400}); // Max 400 characters
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
};
