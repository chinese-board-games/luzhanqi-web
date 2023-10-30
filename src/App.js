import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from 'components/NavBar';
import Menu from './views/Menu';
import Game from './views/Game';
import Debug from './views/Debug';
import SetupTest from './views/SetupTest';
import GameBoardTest from './views/GameBoardTest';
import './App.css';

const App = () => (
  <>
    <NavBar />
    <Routes>
      <Route path="/game/:roomId" element={<Game />} />
      <Route path="/debug" element={<Debug />} />
      <Route path="/setup-test" element={<SetupTest />} />
      <Route path="/gameboard-test" element={<GameBoardTest />} />
      <Route path="/*" element={<Menu />} />
    </Routes>
  </>
);

export default App;
