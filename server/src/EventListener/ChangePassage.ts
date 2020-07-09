import {Game} from "../Models/Game";
import {SocketEventListener, SocketReceivedEventView, SocketSentEventView} from "../type";
import {getQuotableAPIData} from "../QuotableAPI";

export const changePassage: SocketEventListener<SocketReceivedEventView.CHANGE_PASSAGE> = (socket, io) => async ({gameId}) => {
    try {
        let game = await Game.findById(gameId);
        if (game && game.isOpen) {
            const minLength = Math.round(Math.random() * 200); // From 0 characters to 200 characters
            const quotableData = await getQuotableAPIData({minLength, maxLength: 400}); // Max 400 characters
            game.words = quotableData;
            game = await game.save();
            io.to(gameId).emit(SocketSentEventView.UPDATE_GAME, {game});
        }
    } catch (e) {
        console.error(e);
    }
};
