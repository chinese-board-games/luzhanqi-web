import React from 'react';
import { Button } from '@mantine/core';
import SignIn from './SignIn';
import CreateAccount from './CreateAccount';
import Google from './Google';
import Phone from './Phone';

// eslint-disable-next-line react/prop-types
const LoginComponent = ({ setShowModal }) => {
  const [existingAccount, setExistingAccount] = React.useState(false);
  const [usePhone, setUsePhone] = React.useState(false);

  const displayEmail = (
    <>
      {existingAccount ? (
        <SignIn setExistingAccount={setExistingAccount} setShowModal={setShowModal} />
      ) : (
        <CreateAccount setExistingAccount={setExistingAccount} setShowModal={setShowModal} />
      )}
      <Google setShowModal={setShowModal} />
    </>
  );

  // return a component that allows the user to either log in or create an account with email and password
  return (
    <div>
      <Button variant="light" onClick={() => setUsePhone(!usePhone)}>
        {usePhone ? 'Use Email' : 'Use Phone'}
      </Button>
      {usePhone ? <Phone setShowModal={setShowModal} /> : displayEmail}
    </div>
  );
};

export default LoginComponent;
