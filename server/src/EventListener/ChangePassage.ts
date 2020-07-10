import {Game} from "../Models/Game";
import {SocketEventListener, SocketReceivedEventView, SocketSentEventView} from "../type";
import {getQuotableAPIData} from "../QuotableAPI";

export const changePassage: SocketEventListener<SocketReceivedEventView.CHANGE_PASSAGE> = (socket, io) => async ({gameId, minLength, maxLength}) => {
    try {
        let game = await Game.findById(gameId);
        if (game && game.isOpen) {
            const quotableData = await getQuotableAPIData({minLength, maxLength});
            game.words = quotableData;
            game = await game.save();
            io.to(gameId).emit(SocketSentEventView.UPDATE_GAME, {game});
        }
    } catch (e) {
        console.error(e);
    }
};
