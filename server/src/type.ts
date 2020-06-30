import {GameProps} from "./Models/Game";
import SocketIO from "socket.io";

// Data sent (to client) through socket
export enum SocketSentEventView {
    UPDATE_GAME = "UPDATE_GAME",
    TIMER = "TIMER",
    DONE = "DONE",
}

export type SocketSentEventData = {
    [SocketSentEventView.UPDATE_GAME]: {
        game: GameProps;
    };
    [SocketSentEventView.TIMER]: {
        countDown: string | number;
        msg: string;
    };
    [SocketSentEventView.DONE]: {
        gameId: string;
    };
};

// Data received (from client) through socket
export enum SocketReceivedEventView {
    RESTART_GAME = "RESTART_GAME",
    USER_INPUT = "USER_INPUT",
    TIMER = "TIMER",
    JOIN_GAME = "JOIN_GAME",
    CREATE_GAME = "CREATE_GAME",
}

export type SocketReceivedEventData = {
    [SocketReceivedEventView.RESTART_GAME]: {
        gameId: string;
    };
    [SocketReceivedEventView.USER_INPUT]: {
        gameId: string;
        userInput: string;
    };
    [SocketReceivedEventView.TIMER]: {
        gameId: string;
        playerId: string;
    };
    [SocketReceivedEventView.JOIN_GAME]: {
        gameId: string;
        nickName: string;
    };
    [SocketReceivedEventView.CREATE_GAME]: {
        nickName: string;
    };
};

// Typing the socket
export interface Socket extends SocketIO.Socket {
    on<T extends SocketReceivedEventView>(event: T, listener: (data: SocketReceivedEventData[T]) => void): this;
    emit<T extends SocketSentEventView>(event: T, data: SocketSentEventData[T]): boolean;
}

interface Namespace extends SocketIO.Namespace {
    emit<T extends SocketSentEventView>(event: T, data: SocketSentEventData[T]): boolean;
}

export interface IO extends SocketIO.Server {
    to(room: string): Namespace;
    clients(...args: any[]): Namespace;
}

// Typing listeners
export type SocketEventListener<T extends SocketReceivedEventView> = (socket: Socket, io: IO) => (data: SocketReceivedEventData[T]) => void;
