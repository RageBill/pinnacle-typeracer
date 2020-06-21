import React, {useRef, useState} from "react";
import {Message} from "semantic-ui-react";

export const DisplayGameCode = ({gameId}) => {
    const [copySuccess, setCopySuccess] = useState(false);
    const textInputRef = useRef(null);

    const copyToClipboard = () => {
        textInputRef.current.select();
        document.execCommand("copy");
        setCopySuccess(true);
    };

    return (
        <div>
            <h4>Send this code to your friends to join:</h4>
            <input type="text" readOnly value={gameId} ref={textInputRef} />
            <button className="ui secondary button" onClick={copyToClipboard}>
                Copy Code
            </button>
            {copySuccess && (
                <Message positive>
                    <Message.Header>Code Copied To Clipboard.</Message.Header>
                </Message>
            )}
        </div>
    );
};
