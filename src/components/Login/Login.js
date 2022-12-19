import React from 'react';
import SignIn from './SignIn';
import CreateAccount from './CreateAccount';

const LoginComponent = () => {
  const [existingAccount, setExistingAccount] = React.useState(false);

  // return a component that allows the user to either log in or create an account with email and password
  return (
    <>
      {existingAccount ? (
        <SignIn setExistingAccount={setExistingAccount} />
      ) : (
        <CreateAccount setExistingAccount={setExistingAccount} />
      )}
    </>
  );
};

export default LoginComponent;