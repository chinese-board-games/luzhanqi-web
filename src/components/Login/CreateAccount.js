/* eslint-disable no-console */
import { getAuth } from 'firebase/auth';
import React from 'react';
import { useForm } from '@mantine/form';
import { Button, TextInput, PasswordInput } from '@mantine/core';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { ToastContainer, toast } from 'react-toastify';
import { addGame, createUser } from 'api/User';

// eslint-disable-next-line react/prop-types
const CreateAccount = ({ setExistingAccount, setShowModal, roomId, playerName }) => {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const auth = getAuth();

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const createAccount = ({ email, password, confirmPassword }) => {
    console.log(`email: ${email}`, `password: ${password}`, `confirmPassword: ${confirmPassword}`);
    let errors = new Set();
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    // present error if email invalid
    if (!emailPattern.test(email)) {
      errors.add('Please provide a valid email.');
    }
    // present error if password is blank
    if (password.length === 0) {
      errors.add('Please provide a password.');
    }
    // present error if passwords don't match
    if (password !== confirmPassword) {
      errors.add('Passwords do not match.');
    }
    if (errors.size !== 0) {
      // there are validation errors
      errors.forEach((e) => toast.error(e));
      return;
    }

    createUserWithEmailAndPassword(email, password)
      .then(async ({ user }) => {
        // Signed in
        console.log(`user: ${JSON.stringify(user)}`);
        await createUser(user.uid);
        if (roomId) {
          // already joined a room
          addGame(user.uid, roomId);
          updateUidMap(roomId, playerName, user.uid);
        }
        setShowModal(false);
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.log(`errorCode: ${errorCode}`);
        console.log(`errorMessage: ${errorMessage}`);
      });
  };
  if (error) {
    console.log('Error in user creation');
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

  const handleSubmit = (values) => {
    createAccount(values);
  };

  // eslint-disable-next-line no-unused-vars
  const handleError = (_errors) => {
    console.log('Form error handled serverside');
  };
  return (
    <div>
      <h2>Create Account</h2>

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
        <PasswordInput
          label="Confirm password"
          placeholder="Confirm password"
          {...form.getInputProps('confirmPassword')}
        />
        <Button type="submit" style={{ marginTop: '0.5em' }}>
          Sign Up
        </Button>
        <Button variant="subtle" onClick={() => setExistingAccount(true)}>
          Sign In
        </Button>
        <ToastContainer />
      </form>
    </div>
  );
};

export default CreateAccount;
