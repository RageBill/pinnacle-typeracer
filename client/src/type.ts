import {SemanticCOLORS} from "semantic-ui-react";

export const semanticColors: SemanticCOLORS[] = ["red", "orange", "yellow", "olive", "green", "teal", "blue", "violet", "purple", "pink", "brown", "grey", "black"];

export type Player = {
    _id: string;
    socketId: string;
    currentWordIndex: number;
    isPartyLeader: boolean;
    WPM: number;
    nickName: string;
    accuracy?: number;
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
    USER_INPUT = "USER_INPUT",
    TIMER = "TIMER",
    JOIN_GAME = "JOIN_GAME",
    CREATE_GAME = "CREATE_GAME",
    CHANGE_PASSAGE = "CHANGE_PASSAGE",
    CHANGE_NAME = "CHANGE_NAME",
    CHAT_MESSAGE = "CHAT_MESSAGE",
    ACCURACY = "ACCURACY",
}

export type SocketSentEventData = {
    [SocketSentEventView.USER_INPUT]: {
        gameId: string;
        userInput: string;
        accuracy?: number;
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
    [SocketSentEventView.CHANGE_PASSAGE]: {
        gameId: string;
        minLength: number;
        maxLength: number;
    };
    [SocketSentEventView.CHANGE_NAME]: {
        nickName: string;
        playerSocketId: string;
        gameId: string;
    };
    [SocketSentEventView.CHAT_MESSAGE]: {
        gameId: string;
        name: string;
        text: string;
    };
    [SocketSentEventView.ACCURACY]: {
        gameId: string;
        playerSocketId: string;
        accuracy: number;
    };
};

// Data received (from server) through socket
export enum SocketReceivedEventView {
    UPDATE_GAME = "UPDATE_GAME",
    TIMER = "TIMER",
    CHAT_MESSAGE = "CHAT_MESSAGE",
}

export type SocketReceivedEventData = {
    [SocketReceivedEventView.UPDATE_GAME]: {
        game: Game;
    };
    [SocketReceivedEventView.TIMER]: {
        countDown: string | number;
        msg: string;
    };
    [SocketReceivedEventView.CHAT_MESSAGE]: {
        name: string;
        text: string;
    };
};
