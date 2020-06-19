import React from "react";
import {useHistory} from "react-router";

export const GameMenu = () => {
    const history = useHistory();
    return (
        <div className="ui container center aligned">
            <h1>Welcome To Pinnacle Typeracer</h1>
            <button onClick={() => history.push("/game/create")} className="ui primary button">
                Create New Game
            </button>
            <button onClick={() => history.push("/game/join")} className="ui secondary button">
                Join Game
            </button>
        </div>
    );
}

GameMenu.displayName = "GameMenu";
