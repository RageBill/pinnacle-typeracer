import React, {useEffect, useState} from "react";
import "fomantic-ui-css/semantic.css";
import {Router, Route, Switch} from "react-router";
import {history} from "./history";
import {GameMenu} from "./component/GameMenu";
import {socket} from "./socketConfig";
import {CreateGame} from "./component/CreateGame";
import {JoinGame} from "./component/JoinGame";
import {TypeRacer} from "./component/TypeRacer";
import {Game, SocketReceivedEventView} from "./type";

export const App = () => {
    const [gameState, setGameState] = useState<Game>({_id: "", isOpen: false, isOver: false, players: [], words: [], startTime: 0});

    useEffect(() => {
        socket.on(SocketReceivedEventView.UPDATE_GAME, ({game}) => {
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
                <Route path="/game/:gameId" render={() => <TypeRacer gameState={gameState} />} />
            </Switch>
        </Router>
    );
};

App.displayName = "App";
