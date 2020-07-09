import React, {useEffect, useRef, useState} from "react";
import {Game, Player, SocketReceivedEventView, SocketSentEventView} from "../type";
import {Button, Input, List, Segment} from "semantic-ui-react";
import {socket} from "../socketConfig";

interface Props {
    gameId: Game["_id"];
    player: Player;
}

export const ChatRoom = ({gameId, player}: Props) => {
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<Array<{name: string; text: string}>>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

    const onSubmit = () => {
        socket.emit(SocketSentEventView.CHAT_MESSAGE, {gameId, name: player.nickName, text});
        setText("");
    };

    const toggleChat = () => setVisible(!visible);

    useEffect(() => {
        socket.on(SocketReceivedEventView.CHAT_MESSAGE, (message) => {
            setMessages([...messages, message]);
        });

        bottomRef.current?.scrollIntoView({behavior: "smooth"});

        return () => {
            socket.removeAllListeners();
        };
    }, [messages]);

    return (
        <Segment style={{position: "fixed", top: "30%", transition: "right 0.2s linear", right: `${visible ? "1%" : "-300px"}`, width: "300px", height: "350px", padding: 0, display: "flex", flexDirection: "column"}}>
            <Button icon={`angle ${visible ? "right" : "left"}`} style={{position: "absolute", left: "-45px"}} onClick={toggleChat} />
            <List animated style={{flex: 1, padding: 10, marginBottom: 0, overflowY: "scroll"}}>
                {messages.map((_) => (
                    <List.Item style={{width: "100%"}}>
                        <List.Icon name="user" />
                        <List.Content>
                            <List.Content>
                                <List.Header as="a">{_.name}</List.Header>
                                <List.Description>{_.text}</List.Description>
                            </List.Content>
                        </List.Content>
                    </List.Item>
                ))}
                <div ref={bottomRef} />
            </List>
            <Input fluid value={text} onChange={onInput} action>
                <input />
                <Button icon="send" disabled={text.length === 0} onClick={onSubmit} />
            </Input>
        </Segment>
    );
};

ChatRoom.displayName = "ChatRoom";
