import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

import './index.css';
import { GameProvider } from 'contexts/GameContext';
import { FirebaseAuthProvider } from 'contexts/FirebaseContext';
import { MantineProvider } from '@mantine/core';
import ErrorBoundary from 'components/ErrorBoundary';
import App from './App';
import { CustomFonts } from './CustomFonts';
import theme, { other } from './theme';

axios.defaults.baseURL = `${import.meta.env.VITE_API}`;

// attaches the current user's Firebase ID token to every REST call, so the
// server can verify who's actually asking instead of trusting whatever uid
// a request claims - a no-op when nobody's logged in (anonymous play is
// allowed throughout this app)
axios.interceptors.request.use(async (config) => {
  const user = getAuth().currentUser;
  if (user) {
    config.headers.Authorization = `Bearer ${await user.getIdToken()}`;
  }
  return config;
});

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
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
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
