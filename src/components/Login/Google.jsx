import React from 'react';
import { Container, Image } from '@mantine/core';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addGame } from 'api/User';
import { updateUidMap } from 'api/Game';
import PropTypes from 'prop-types';

const Google = ({ setShowModal, roomId, playerName }) => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // Google access token
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const { user } = result;
        if (roomId) {
          // already joined a room
          addGame(user.uid, roomId);
          updateUidMap(roomId, playerName, user.uid);
        }
        console.log(`credential: ${JSON.stringify(credential)}`);
        console.log(`token: ${token}`);
        console.log(`user: ${JSON.stringify(user)}`);
        setShowModal(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(`errorCode: ${errorCode}`);
        console.log(`errorMessage: ${errorMessage}`);
        console.log(`email: ${error.customData?.email}`);
        console.log(`credential: ${JSON.stringify(credential)}`);
        if (errorCode !== 'auth/popup-closed-by-user') {
          toast.error(errorMessage);
        }
      });
  };

  return (
    <Container style={{ marginTop: '0.5em', padding: 0 }}>
      <Image
        src="/google-signin-button.png"
        onClick={handleGoogleSignIn}
        style={{
          width: '11em',
          cursor: 'pointer',
        }}
      />
      <ToastContainer />
    </Container>
  );
};

Google.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  playerName: PropTypes.string.isRequired,
};

export default Google;
