import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

import '@mantine/core/styles.css';
import './index.css';
import './CustomFonts.css';
import { GameProvider } from 'contexts/GameContext';
import { FirebaseAuthProvider } from 'contexts/FirebaseContext';
import { MantineProvider } from '@mantine/core';
import { MantineEmotionProvider, emotionTransform } from '@mantine/emotion';
import ErrorBoundary from 'components/ErrorBoundary';
import App from './App';
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

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <FirebaseAuthProvider>
          <MantineProvider
            stylesTransform={emotionTransform}
            theme={{
              ...theme,
              other,
            }}
          >
            <MantineEmotionProvider>
              <GameProvider>
                <App />
              </GameProvider>
            </MantineEmotionProvider>
          </MantineProvider>
        </FirebaseAuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
