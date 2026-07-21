import { getAuth } from 'firebase/auth';
import React from 'react';
import { useForm } from '@mantine/form';
import { Button, TextInput, PasswordInput } from '@mantine/core';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { addGame, createUser } from 'api/User';
import { updateUidMap } from 'api/Game';
import PropTypes from 'prop-types';

const CreateAccount = ({ setExistingAccount, setShowModal, roomId, playerName }) => {
  const { t } = useTranslation('auth');
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
    let errors = new Set();
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    // present error if email invalid
    if (!emailPattern.test(email)) {
      errors.add(t('invalidEmail'));
    }
    // present error if password is blank
    if (password.length === 0) {
      errors.add(t('passwordRequired'));
    }
    // present error if passwords don't match
    if (password !== confirmPassword) {
      errors.add(t('passwordMismatch'));
    }
    if (errors.size !== 0) {
      // there are validation errors
      errors.forEach((e) => toast.error(e));
      return;
    }

    createUserWithEmailAndPassword(email, password)
      .then(async ({ user }) => {
        // Signed in
        console.info(`user: ${JSON.stringify(user)}`);
        await createUser(user.uid);
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
      });
  };
  if (error) {
    console.error('Error in user creation');
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

  const handleSubmit = (values) => {
    createAccount(values);
  };

  // eslint-disable-next-line no-unused-vars
  const handleError = (_errors) => {
    console.error('Form error handled serverside');
  };
  return (
    <div>
      <h2>{t('createAccount')}</h2>

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
        <PasswordInput
          label={t('confirmPasswordLabel')}
          placeholder={t('confirmPasswordPlaceholder')}
          {...form.getInputProps('confirmPassword')}
        />
        <Button type="submit" style={{ marginTop: '0.5em' }}>
          {t('signUp')}
        </Button>
        <Button variant="subtle" onClick={() => setExistingAccount(true)}>
          {t('signIn')}
        </Button>
        <ToastContainer />
      </form>
    </div>
  );
};

CreateAccount.propTypes = {
  setExistingAccount: PropTypes.func.isRequired,
  setShowModal: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  playerName: PropTypes.string.isRequired,
};

export default CreateAccount;
