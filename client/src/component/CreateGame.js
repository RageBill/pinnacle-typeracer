import React, {useState} from "react";
import {socket} from "../socketConfig";

export const CreateGame = () => {
    const [nickName, setNickName] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        socket.emit("create-game", nickName);
    };

    const onNickNameInput = (e) => setNickName(e.target.value);

    return (
        <div className="ui container center aligned">
            <h1 className="text-centered">Create Game</h1>
            <form onSubmit={onSubmit}>
                <label htmlFor="nickName">Enter NickName:</label>
                <input type="text" name="nickName" value={nickName} onChange={onNickNameInput} placeholder="Enter NickName" />
                <br />
                <button type="submit" className="ui primary button">
                    Submit
                </button>
            </form>
        </div>
    );
};
