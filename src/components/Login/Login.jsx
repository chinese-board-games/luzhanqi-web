import React from 'react';
import { Button, Container } from '@mantine/core';
import EmailAndPasswordSignIn from './EmailAndPasswordSignIn';
import CreateAccount from './CreateAccount';
import Google from './Google';
import Phone from './Phone';
import PropTypes from 'prop-types';

const LoginComponent = ({ setShowModal, roomId, playerName, isEnglish }) => {
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
          isEnglish={isEnglish}
        />
      ) : (
        <CreateAccount
          setExistingAccount={setExistingAccount}
          setShowModal={setShowModal}
          roomId={roomId}
          playerName={playerName}
          isEnglish={isEnglish}
        />
      )}
      <Google
        setShowModal={setShowModal}
        roomId={roomId}
        playerName={playerName}
        isEnglish={isEnglish}
      />
    </>
  );

  return (
    <Container>
      <Button variant="light" onClick={() => setUsePhone(!usePhone)}>
        {isEnglish
          ? usePhone
            ? 'Use Email'
            : 'Use Phone'
          : usePhone
          ? '使用電子郵件'
          : '使用電話'}
      </Button>
      {usePhone ? (
        <Phone
          setShowModal={setShowModal}
          roomId={roomId}
          playerName={playerName}
          isEnglish={isEnglish}
        />
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
  isEnglish: PropTypes.bool,
};

export default LoginComponent;
