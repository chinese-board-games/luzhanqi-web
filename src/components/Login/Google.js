/* eslint-disable no-console */
import React from 'react';
import { Button } from '@mantine/core';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line react/prop-types
const Google = ({ setShowModal }) => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const { user } = result;
        // ...
        console.log(`credential: ${JSON.stringify(credential)}`);
        console.log(`token: ${token}`);
        console.log(`user: ${JSON.stringify(user)}`);
        setShowModal(false);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const { email } = error.customData;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(`errorCode: ${errorCode}`);
        console.log(`errorMessage: ${errorMessage}`);
        console.log(`email: ${email}`);
        console.log(`credential: ${JSON.stringify(credential)}`);
        toast.error(errorMessage);
      });
  };

  return (
    <div style={{ margin: '0.5em' }}>
      <Button variant="outline-primary" onClick={handleGoogleSignIn}>
        Sign in with Google
      </Button>
      <ToastContainer />
    </div>
  );
};

export default Google;
