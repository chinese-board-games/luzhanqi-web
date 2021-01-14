import React from "react";
import { Router } from "@reach/router";
import "bootstrap/dist/css/bootstrap.min.css";

import Menu from "./views/Menu";
import Game from "./views/Game";
import Debug from "./views/Debug";

const App = () => (
  <Router>
    <Menu path="/" />
    <Game path="/game" />
    <Debug path="/debug" />
  </Router>
);

export default App;
