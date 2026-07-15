import { getAuth } from 'firebase/auth';
import React from 'react';
import { useForm } from '@mantine/form';
import { Button, TextInput, PasswordInput } from '@mantine/core';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { ToastContainer, toast } from 'react-toastify';
import { addGame, createUser } from 'api/User';
import { updateUidMap } from 'api/Game';
import PropTypes from 'prop-types';

const CreateAccount = ({ setExistingAccount, setShowModal, roomId, playerName, isEnglish }) => {
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
      errors.add(isEnglish ? 'Please provide a valid email.' : '請提供有效的電子郵件地址。');
    }
    // present error if password is blank
    if (password.length === 0) {
      errors.add(isEnglish ? 'Please provide a password.' : '請提供密碼。');
    }
    // present error if passwords don't match
    if (password !== confirmPassword) {
      errors.add(isEnglish ? 'Passwords do not match.' : '密碼不相符。');
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
          updateUidMap(roomId, playerName, user.uid);
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

  const handleSubmit = (values) => {
    createAccount(values);
  };

  // eslint-disable-next-line no-unused-vars
  const handleError = (_errors) => {
    console.error('Form error handled serverside');
  };
  return (
    <div>
      <h2>{isEnglish ? 'Create Account' : '建立帳號'}</h2>

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
        <PasswordInput
          label={isEnglish ? 'Confirm password' : '確認密碼'}
          placeholder={isEnglish ? 'Confirm password' : '請再次輸入密碼'}
          {...form.getInputProps('confirmPassword')}
        />
        <Button type="submit" style={{ marginTop: '0.5em' }}>
          {isEnglish ? 'Sign Up' : '註冊'}
        </Button>
        <Button variant="subtle" onClick={() => setExistingAccount(true)}>
          {isEnglish ? 'Sign In' : '登入'}
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
  isEnglish: PropTypes.bool,
};

export default CreateAccount;
