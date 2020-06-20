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
        <div className="row">
            <div className="col"></div>
            <div className="col">
                <h1 className="text-centered">Create Game</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="nickName">Enter nickName</label>
                        <input type="text" name="nickName" value={nickName} onChange={onNickNameInput} placeholder="Enter NickName" className="form-control" />
                    </div>
                    <button type="submit" className="ui primary button">
                        Submit
                    </button>
                </form>
            </div>
            <div className="col"></div>
        </div>
    );
};
