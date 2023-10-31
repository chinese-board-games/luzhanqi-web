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

axios.defaults.baseURL = `${process.env.REACT_APP_API}`;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseAuthProvider>
        <MantineProvider
          theme={{
            colors: {
              'pastel-tan': [
                '#f6f5ef',
                '#e3e1d3',
                '#d0cdb5',
                '#beb995',
                '#aca576',
                '#938b5c',
                '#726c49',
                '#514d35',
                '#312e1f',
                '#100f09'
              ]
            }
          }}>
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
