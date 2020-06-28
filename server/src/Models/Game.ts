import {createSchema, ExtractProps, Type, typedModel} from "ts-mongoose";

export const PlayerSchema = createSchema({
    currentWordIndex: Type.number({
        required: true,
        default: 0,
    }),
    socketId: Type.string({required: true}),
    isPartyLeader: Type.boolean({required: true, default: false}),
    WPM: Type.number({required: true, default: -1}),
    nickName: Type.string({required: true}),
});

export const GameSchema = createSchema({
    words: Type.array({required: true}).of(Type.string()),
    isOpen: Type.boolean({required: true, default: true}),
    isOver: Type.boolean({required: true, default: false}),
    players: Type.array({required: true}).of(PlayerSchema),
    startTime: Type.number({}),
});

export const Game = typedModel("Game", GameSchema);

export type PlayerProps = ExtractProps<typeof PlayerSchema>;

export type GameProps = ExtractProps<typeof GameSchema>;
