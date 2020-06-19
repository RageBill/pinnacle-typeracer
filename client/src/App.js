import React from "react";
import "fomantic-ui-css/semantic.css";
import {Router, Route, Switch} from "react-router";
import {history} from "./history";
import {GameMenu} from "./component/GameMenu";
import {socket} from "./socketConfig";

export const App = () => {
    React.useEffect(() => {
        socket.on("test", (msg) => console.log(msg));
    }, []);

    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={GameMenu} />
            </Switch>
        </Router>
    );
};

App.displayName = "App";
