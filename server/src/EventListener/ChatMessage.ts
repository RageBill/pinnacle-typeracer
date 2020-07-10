import {SocketEventListener, SocketReceivedEventView, SocketSentEventView} from "../type";

export const chatMessage: SocketEventListener<SocketReceivedEventView.CHAT_MESSAGE> = (socket, io) => async ({gameId, name, text}) => {
    try {
        io.to(gameId).emit(SocketSentEventView.CHAT_MESSAGE, {name, text});
    } catch (e) {
        console.error(e);
    }
};
