import React, { useState, useEffect, createContext, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// set firebase User
const User = null;

const ContextState = { user: User };

const FirebaseAuthContext = createContext(ContextState);

// eslint-disable-next-line react/prop-types
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

export { FirebaseAuthProvider, useFirebaseAuth };
