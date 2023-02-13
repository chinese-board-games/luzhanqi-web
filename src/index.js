import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import axios from 'axios';

import './index.css';
import { GameProvider } from 'contexts/GameContext';
import { FirebaseAuthProvider } from 'contexts/FirebaseContext';
import { MantineProvider } from '@mantine/core';
import App from './App';

axios.defaults.baseURL = `${process.env.REACT_APP_API}`;

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <FirebaseAuthProvider>
        <MantineProvider>
          <GameProvider>
            <App />
          </GameProvider>
        </MantineProvider>
      </FirebaseAuthProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
