import React, { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GameContext } from 'contexts/GameContext';

import NavBar from 'components/NavBar';
import Menu from './views/Menu';
import Game from './views/Game';
import SetupTest from './views/SetupTest';
import GameBoardTest from './views/GameBoardTest';
import { ToastContainer, toast } from 'react-toastify';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const {
    errors: { errors, setErrors },
  } = useContext(GameContext);

  /** Clear errors after 1 second each */
  useEffect(() => {
    errors.forEach((error) => {
      toast.error(error, {
        toastId: error,
      });
    });
    setErrors([]);
  }, [JSON.stringify(errors), toast.error]);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/game/:roomId" element={<Game />} />
        <Route path="/setup-test" element={<SetupTest />} />
        <Route path="/gameboard-test" element={<GameBoardTest />} />
        <Route path="/*" element={<Menu />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
