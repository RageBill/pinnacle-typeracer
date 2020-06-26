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
