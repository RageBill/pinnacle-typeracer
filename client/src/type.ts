export type Player = {
    _id: string;
    socketId: string;
    currentWordIndex: number;
    isPartyLeader: boolean;
    WPM: number;
    nickName: string;
};

export type Game = {
    _id: string;
    words: string[];
    isOpen: boolean;
    isOver: boolean;
    players: Player[];
    startTime: number;
};

// Data sent (to server) through socket
export enum SocketSentEventView {
    RESTART_GAME = "RESTART_GAME",
    USER_INPUT = "USER_INPUT",
    TIMER = "TIMER",
    JOIN_GAME = "JOIN_GAME",
    CREATE_GAME = "CREATE_GAME",
}

export type SocketSentEventData = {
    [SocketSentEventView.RESTART_GAME]: {
        gameId: string;
    };
    [SocketSentEventView.USER_INPUT]: {
        gameId: string;
        userInput: string;
    };
    [SocketSentEventView.TIMER]: {
        gameId: string;
        playerId: string;
    };
    [SocketSentEventView.JOIN_GAME]: {
        gameId: string;
        nickName: string;
    };
    [SocketSentEventView.CREATE_GAME]: {
        nickName: string;
    };
};

// Data received (from server) through socket
export enum SocketReceivedEventView {
    UPDATE_GAME = "UPDATE_GAME",
    TIMER = "TIMER",
    DONE = "DONE",
}

export type SocketReceivedEventData = {
    [SocketReceivedEventView.UPDATE_GAME]: {
        game: Game;
    };
    [SocketReceivedEventView.TIMER]: {
        countDown: string | number;
        msg: string;
    };
    [SocketReceivedEventView.DONE]: {
        gameId: string;
    };
};
