import io from "socket.io-client";
import {SocketReceivedEventData, SocketReceivedEventView, SocketSentEventData, SocketSentEventView} from "./type";

const socket = io("http://" + process.env.REACT_APP_IP_ADDRESS + ":3001");

// Use customSocket for stricter type-checking
const customSocket = {
    id: () => socket.id, // use callback to get the most updated id
    on: <T extends SocketReceivedEventView>(event: T, fn: (data: SocketReceivedEventData[T]) => void) => socket.on(event, fn),
    emit: <T extends SocketSentEventView>(event: T, data: SocketSentEventData[T]) => socket.emit(event, data),
    removeListener: (event: string) => socket.removeListener(event), // TODO: seems not working, need to investigate
    removeAllListeners: () => socket.removeAllListeners(), // TODO: seems not working, need to investigate
};

export {customSocket as socket};
