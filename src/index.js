import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import './index.css';
import { GameProvider } from 'contexts/GameContext';
import { FirebaseAuthProvider } from 'contexts/FirebaseContext';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <FirebaseAuthProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </FirebaseAuthProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
