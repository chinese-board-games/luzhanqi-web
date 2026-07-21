/* eslint-disable no-console */
import React from 'react';
import { getAuth } from 'firebase/auth';

import { useForm } from '@mantine/form';
import { Button, TextInput, PasswordInput } from '@mantine/core';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import { addGame } from 'api/User';
import { updateUidMap } from 'api/Game';
import PropTypes from 'prop-types';

const EmailAndPasswordSignIn = ({ setExistingAccount, setShowModal, roomId, playerName }) => {
  const { t } = useTranslation('auth');
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
          updateUidMap(roomId, playerName);
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
          {t('error')}
          {error.message}
        </p>
      </div>
    );
  }
  if (loading) {
    return <p>{t('loading')}</p>;
  }
  if (user) {
    return (
      <div>
        <p>
          {t('registeredUser')}
          {user.user.email}
        </p>
      </div>
    );
  }
  return (
    <div>
      <h2>{t('signIn')}</h2>
      <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
        <TextInput
          label={t('emailAddress')}
          placeholder="example@provider.com"
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label={t('password')}
          placeholder={t('enterPassword')}
          {...form.getInputProps('password')}
        />

        <Button type="submit" style={{ marginTop: '0.5em' }}>
          {t('login')}
        </Button>
        <Button variant="subtle" onClick={() => setExistingAccount(false)}>
          {t('createAccount')}
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
};

export default EmailAndPasswordSignIn;
