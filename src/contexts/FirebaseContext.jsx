import React, { useState, useEffect, createContext, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import PropTypes from 'prop-types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// set firebase User
const User = null;

const ContextState = { user: User };

const FirebaseAuthContext = createContext(ContextState);

const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(User);
  const value = { user, app };

  useEffect(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return <FirebaseAuthContext.Provider value={value}>{children}</FirebaseAuthContext.Provider>;
};

const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context.user;
};

FirebaseAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { FirebaseAuthProvider, useFirebaseAuth };
