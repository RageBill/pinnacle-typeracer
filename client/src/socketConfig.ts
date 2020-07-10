import io from "socket.io-client";
import {SocketReceivedEventData, SocketReceivedEventView, SocketSentEventData, SocketSentEventView} from "./type";

const socket = io(window.location.origin);

// Use customSocket for stricter type-checking
const customSocket = {
    id: () => socket.id, // use callback to get the most updated id
    on: <T extends SocketReceivedEventView>(event: T, fn: (data: SocketReceivedEventData[T]) => void) => socket.on(event, fn),
    emit: <T extends SocketSentEventView>(event: T, data: SocketSentEventData[T]) => socket.emit(event, data),
    removeListener: (event: string) => socket.removeListener(event),
    removeAllListeners: () => socket.removeAllListeners(),
};

export {customSocket as socket};
