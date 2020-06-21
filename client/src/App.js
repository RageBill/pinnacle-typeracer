import React, {useEffect, useState} from "react";
import "fomantic-ui-css/semantic.css";
import {Router, Route, Switch} from "react-router";
import {history} from "./history";
import {GameMenu} from "./component/GameMenu";
import {socket} from "./socketConfig";
import {CreateGame} from "./component/CreateGame";
import {JoinGame} from "./component/JoinGame";

export const App = () => {
    const [gameState, setGameState] = useState({_id: "", isOpen: false, players: [], words: []});

    useEffect(() => {
        socket.on("updateGame", (game) => {
            setGameState(game);
        });

        return () => {
            socket.removeAllListeners();
        };
    }, []);

    useEffect(() => {
        if (gameState._id) {
            history.push(`/game/${gameState._id}`);
        }
    }, [gameState._id]);

    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={GameMenu} />
                <Route path="/game/create" component={CreateGame} />
                <Route path="/game/join" component={JoinGame} />
            </Switch>
        </Router>
    );
};

App.displayName = "App";
