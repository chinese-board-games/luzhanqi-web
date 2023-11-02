/* eslint-disable no-console */
import React from 'react';
import { getAuth } from 'firebase/auth';

import { useForm } from '@mantine/form';
import { Button, TextInput, PasswordInput } from '@mantine/core';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line react/prop-types
const SignIn = ({ setExistingAccount, setShowModal }) => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
  });

  const auth = getAuth();
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

  const signIn = ({ email, password }) => {
    signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        console.log(`userCredential: ${userCredential}`);
        // ...
        setShowModal(false);
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.log(`errorCode: ${errorCode}`);
        console.log(`errorMessage: ${errorMessage}`);
        toast.error(errorMessage);
      });
  };

  const handleSubmit = (values) => {
    signIn(values);
  };

  // eslint-disable-next-line no-unused-vars
  const handleError = (_errors) => {
    console.log('Form error handled serverside');
  };

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (user) {
    return (
      <div>
        <p>Registered User: {user.user.email}</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
        <TextInput
          label="Email address"
          placeholder="example@provider.com"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          placeholder="Enter password"
          {...form.getInputProps('password')}
        />

        <Button type="submit" style={{ marginTop: '0.5em' }}>
          Login
        </Button>
        <Button variant="subtle" onClick={() => setExistingAccount(false)}>
          Create Account
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
