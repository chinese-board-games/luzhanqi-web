import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

import './index.css';
import { GameProvider } from 'contexts/GameContext';
import { FirebaseAuthProvider } from 'contexts/FirebaseContext';
import { MantineProvider } from '@mantine/core';
import App from './App';
import { CustomFonts } from './CustomFonts';
import theme, { other } from './theme';

axios.defaults.baseURL = `${import.meta.env.VITE_API}`;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseAuthProvider>
        <MantineProvider
          theme={{
            ...theme,
            other,
          }}
        >
          <CustomFonts />
          <GameProvider>
            <App />
          </GameProvider>
        </MantineProvider>
      </FirebaseAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
