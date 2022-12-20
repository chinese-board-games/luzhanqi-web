import React from 'react';
import Button from 'react-bootstrap/Button';
import SignIn from './SignIn';
import CreateAccount from './CreateAccount';
import Google from './Google';
import Phone from './Phone';

const LoginComponent = () => {
  const [existingAccount, setExistingAccount] = React.useState(false);
  const [usePhone, setUsePhone] = React.useState(false);

  const displayEmail = (
    <>
      {existingAccount ? (
        <SignIn setExistingAccount={setExistingAccount} />
      ) : (
        <CreateAccount setExistingAccount={setExistingAccount} />
      )}
      <Google />
    </>
  );

  // return a component that allows the user to either log in or create an account with email and password
  return (
    <div>
      <Button variant="link" onClick={() => setUsePhone(!usePhone)}>
        {usePhone ? 'Use Email' : 'Use Phone'}
      </Button>
      {usePhone ? <Phone /> : displayEmail}
    </div>
  );
};

export default LoginComponent;
