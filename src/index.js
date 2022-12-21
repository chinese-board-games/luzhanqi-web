import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import './index.css';
import { GameProvider } from 'contexts/GameContext';
import { FirebaseAuthProvider } from 'contexts/FirebaseContext';
import { MantineProvider } from '@mantine/core';
import App from './App';

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
