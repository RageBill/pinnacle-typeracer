import React, {useState} from "react";
import {socket} from "../socketConfig";

export const JoinGame = () => {
    const [userInput, setUserInput] = useState({gameId: "", nickName: ""});

    const onSubmit = (e) => {
        e.preventDefault();
        socket.emit("join-game", userInput);
    };

    const onGameIdInput = (e) => setUserInput({...userInput, gameId: e.target.value});

    const onNickNameInput = (e) => setUserInput({...userInput, nickName: e.target.value});

    return (
        <div className="row">
            <div className="col"></div>
            <div className="col">
                <h1 className="text-centered">Join Game</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="gameId">Enter Game ID:</label>
                        <input type="text" name="gameId" value={userInput.gameId} onChange={onGameIdInput} placeholder="Enter Game ID" className="form-control" />
                        <label htmlFor="nickName">Enter nickName</label>
                        <input type="text" name="nickName" value={userInput.nickName} onChange={onNickNameInput} placeholder="Enter NickName" className="form-control" />
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
