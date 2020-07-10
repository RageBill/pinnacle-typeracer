import React, {useEffect, useRef, useState} from "react";
import {Game, Player, SocketReceivedEventView, SocketSentEventView} from "../type";
import {Button, Form, List, Segment} from "semantic-ui-react";
import {socket} from "../socketConfig";

interface Props {
    gameId: Game["_id"];
    player: Player;
    isOpen: Game["isOpen"];
    isOver: Game["isOver"];
}

export const ChatRoom = ({gameId, player, isOpen, isOver}: Props) => {
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<Array<{name: string; text: string}>>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

    const onSubmit = () => {
        if (text.length > 0) {
            socket.emit(SocketSentEventView.CHAT_MESSAGE, {gameId, name: player.nickName, text});
            setText("");
        }
    };

    const toggleChat = () => setVisible(!visible);

    useEffect(() => {
        socket.on(SocketReceivedEventView.CHAT_MESSAGE, (message) => {
            setMessages([...messages, message]);
        });

        bottomRef.current?.scrollIntoView({behavior: "smooth"});

        if (player.WPM >= 0 || isOpen || isOver) {
            setVisible(true);
        } else {
            setVisible(false);
        }

        return () => {
            socket.removeListener(SocketReceivedEventView.CHAT_MESSAGE);
        };
    }, [messages, player.WPM, isOpen, isOver]);

    return (
        <Segment style={{position: "fixed", top: "30%", transition: "right 0.2s linear", right: `${visible ? "1%" : "-300px"}`, width: "300px", height: "350px", padding: 0, display: "flex", flexDirection: "column", zIndex: 3}}>
            <Button icon={`angle ${visible ? "right" : "left"}`} style={{position: "absolute", left: "-45px"}} onClick={toggleChat} />
            <List animated style={{flex: 1, padding: 10, marginBottom: 0, overflowY: "scroll"}}>
                {messages.map((_, index) => (
                    <List.Item style={{width: "100%"}} key={index}>
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
            <Form onSubmit={onSubmit}>
                <Form.Input fluid value={text} onChange={onInput} action>
                    <input />
                    <Button icon="send" disabled={text.length === 0} onClick={onSubmit} />
                </Form.Input>
            </Form>
        </Segment>
    );
};

ChatRoom.displayName = "ChatRoom";
