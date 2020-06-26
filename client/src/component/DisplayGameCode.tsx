import React, {useRef, useState} from "react";
import {Button, Container, Header, Input, Message} from "semantic-ui-react";
import {Game} from "../type";

export const DisplayGameCode = ({gameId}: {gameId: Game["_id"]}) => {
    const [copySuccess, setCopySuccess] = useState(false);
    const textInputRef = useRef<Input>(null);

    const copyToClipboard = () => {
        textInputRef.current?.select();
        document.execCommand("copy");
        setCopySuccess(true);
    };

    return (
        <Container text textAlign="center">
            <Header as="h4">Send this code to your friends to join:</Header>
            <Input type="text" readOnly value={gameId} ref={textInputRef} />
            <Button secondary onClick={copyToClipboard}>
                Copy Code
            </Button>
            {copySuccess && (
                <Message positive>
                    <Message.Header>Code Copied To Clipboard.</Message.Header>
                </Message>
            )}
        </Container>
    );
};
