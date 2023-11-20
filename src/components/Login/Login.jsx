import React from 'react';
import { Button, Container } from '@mantine/core';
import EmailAndPasswordSignIn from './EmailAndPasswordSignIn';
import CreateAccount from './CreateAccount';
import Google from './Google';
import Phone from './Phone';
import PropTypes from 'prop-types';

const LoginComponent = ({ setShowModal, roomId, playerName }) => {
  const [existingAccount, setExistingAccount] = React.useState(false);
  const [usePhone, setUsePhone] = React.useState(false);

  const displayEmail = (
    <>
      {existingAccount ? (
        <EmailAndPasswordSignIn
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

  return (
    <Container>
      <Button variant="light" onClick={() => setUsePhone(!usePhone)}>
        {usePhone ? 'Use Email' : 'Use Phone'}
      </Button>
      {usePhone ? (
        <Phone setShowModal={setShowModal} roomId={roomId} playerName={playerName} />
      ) : (
        displayEmail
      )}
    </Container>
  );
};

LoginComponent.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  playerName: PropTypes.string.isRequired,
};

export default LoginComponent;
