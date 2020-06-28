import {GameProps} from "./Models/Game";

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
        countDown: string;
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
