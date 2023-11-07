import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mantine/core';
import SignIn from './SignIn';
import CreateAccount from './CreateAccount';
import Google from './Google';
import Phone from './Phone';

const LoginComponent = ({ setShowModal, roomId, playerName }) => {
  const [existingAccount, setExistingAccount] = React.useState(false);
  const [usePhone, setUsePhone] = React.useState(false);

  const displayEmail = (
    <>
      {existingAccount ? (
        <SignIn
          setExistingAccount={setExistingAccount}
          setShowModal={setShowModal}
          roomId={roomId}
          playerName={playerName}
        />
      ) : (
        <CreateAccount
          setExistingAccount={setExistingAccount}
          setShowModal={setShowModal}
          roomId={roomId}
          playerName={playerName}
        />
      )}
      <Google setShowModal={setShowModal} roomId={roomId} playerName={playerName} />
    </>
  );

  // return a component that allows the user to either log in or create an account with email and password
  return (
    <div>
      <Button variant="light" onClick={() => setUsePhone(!usePhone)}>
        {usePhone ? 'Use Email' : 'Use Phone'}
      </Button>
      {usePhone ? (
        <Phone setShowModal={setShowModal} roomId={roomId} playerName={playerName} />
      ) : (
        displayEmail
      )}
    </div>
  );
};

LoginComponent.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  playerName: PropTypes.string.isRequired,
};

export default LoginComponent;
