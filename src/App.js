import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './views/Menu';
import Game from './views/Game';
import Debug from './views/Debug';

const App = () => (
  <Routes>
    <Route path="/" element={<Menu />} />
    <Route path="/game" element={<Game />} />
    <Route path="/debug" element={<Debug />} />
  </Routes>
);

export default App;
