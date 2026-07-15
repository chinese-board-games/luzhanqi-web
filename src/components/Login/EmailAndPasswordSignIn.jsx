/* eslint-disable no-console */
import React from 'react';
import { getAuth } from 'firebase/auth';

import { useForm } from '@mantine/form';
import { Button, TextInput, PasswordInput } from '@mantine/core';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addGame } from 'api/User';
import { updateUidMap } from 'api/Game';
import PropTypes from 'prop-types';

const EmailAndPasswordSignIn = ({
  setExistingAccount,
  setShowModal,
  roomId,
  playerName,
  isEnglish,
}) => {
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
      .then(({ user }) => {
        // Signed in
        console.info(`user: ${JSON.stringify(user)}`);
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
        console.error(`errorCode: ${errorCode}`);
        console.error(`errorMessage: ${errorMessage}`);
        toast.error(errorMessage);
      });
  };

  const handleSubmit = (values) => {
    signIn(values);
  };

  // eslint-disable-next-line no-unused-vars
  const handleError = (_errors) => {
    console.error('Form error handled serverside');
  };

  if (error) {
    return (
      <div>
        <p>
          {isEnglish ? 'Error: ' : '錯誤：'}
          {error.message}
        </p>
      </div>
    );
  }
  if (loading) {
    return <p>{isEnglish ? 'Loading...' : '載入中...'}</p>;
  }
  if (user) {
    return (
      <div>
        <p>
          {isEnglish ? 'Registered User: ' : '已註冊使用者：'}
          {user.user.email}
        </p>
      </div>
    );
  }
  return (
    <div>
      <h2>{isEnglish ? 'Sign In' : '登入'}</h2>
      <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
        <TextInput
          label={isEnglish ? 'Email address' : '電子郵件地址'}
          placeholder="example@provider.com"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label={isEnglish ? 'Password' : '密碼'}
          placeholder={isEnglish ? 'Enter password' : '請輸入密碼'}
          {...form.getInputProps('password')}
        />

        <Button type="submit" style={{ marginTop: '0.5em' }}>
          {isEnglish ? 'Login' : '登入'}
        </Button>
        <Button variant="subtle" onClick={() => setExistingAccount(false)}>
          {isEnglish ? 'Create Account' : '建立帳號'}
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

EmailAndPasswordSignIn.propTypes = {
  setExistingAccount: PropTypes.func.isRequired,
  setShowModal: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  playerName: PropTypes.string.isRequired,
  isEnglish: PropTypes.bool,
};

export default EmailAndPasswordSignIn;
