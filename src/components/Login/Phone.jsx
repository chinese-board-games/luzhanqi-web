import React from 'react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

import { useForm } from '@mantine/form';
import { Button, Container, Text, TextInput, Title } from '@mantine/core';
import PhoneInput from 'react-phone-input-2';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import 'react-phone-input-2/lib/style.css';
import 'react-toastify/dist/ReactToastify.css';
import { addGame } from 'api/User';
import { updateUidMap } from 'api/Game';
import PropTypes from 'prop-types';

const Phone = ({ setShowModal, roomId, playerName }) => {
  const { t } = useTranslation('auth');
  const confirmForm = useForm({
    initialValues: {
      confirmationCode: '',
    },
  });

  const [displayConfirmationCodePrompt, setDisplayConfirmationCodePrompt] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [final, setFinal] = React.useState('');

  const recaptchaContainerRef = React.useRef();

  const handleSubmitPhoneNumber = (e) => {
    e.preventDefault();
    if (phoneNumber === '' || phoneNumber.length < 10) {
      toast.warn(t('invalidPhone'));
      window.verifier.clear();
      return;
    }

    if (window.verifier && recaptchaContainerRef.current) {
      window.verifier.clear();
      recaptchaContainerRef.current.innerHTML = `<div id="recaptcha-container" />`;
    }
    console.info(`phoneNumber: ${phoneNumber}`);

    window.verifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
          console.info(`response: ${response}`);
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
          console.warn('expired-callback');
        },
      },
      getAuth()
    );

    signInWithPhoneNumber(getAuth(), `+${phoneNumber}`, window.verifier)
      .then((result) => {
        setDisplayConfirmationCodePrompt(true);
        setFinal(result);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleSubmitConfirmationCode = ({ confirmationCode }) => {
    if (confirmationCode === null || final === null) return;
    final
      .confirm(confirmationCode)
      .then((result) => {
        const { user } = result;
        if (roomId) {
          // already joined a room
          addGame(user.uid, roomId);
          updateUidMap(roomId, playerName);
        }
        console.info(`user: ${JSON.stringify(user)} user.phoneNumber: ${user.phoneNumber}`);
        setShowModal(false);
      })
      .catch((err) => {
        // User couldn't sign in (bad verification code?)
        // ...
        console.error(`error: ${err} error.message: ${err.message}`);
        toast.error(err.message);
      });
  };

  const handleConfirmationCodeError = () => {};

  return (
    <Container>
      <Title order={2}>{t('phoneTitle')}</Title>
      {displayConfirmationCodePrompt ? (
        <form
          onSubmit={confirmForm.onSubmit(handleSubmitConfirmationCode, handleConfirmationCodeError)}
        >
          <TextInput
            label={t('confirmationCode')}
            placeholder="000000"
            {...confirmForm.getInputProps('confirmationCode')}
          />
          <Button type="submit">{t('submitConfirmationCode')}</Button>
        </form>
      ) : (
        <>
          <Container ref={recaptchaContainerRef}>
            <Container id="recaptcha-container" />
          </Container>
          {/* Do not change to Mantine Form because we use a special component to handle phone numbers */}
          <form onSubmit={handleSubmitPhoneNumber}>
            <Text>{t('phoneNumber')}</Text>
            <PhoneInput
              country="us"
              value={phoneNumber}
              onChange={(phone) => setPhoneNumber(phone)}
            />
            <Text>{t('phonePrivacyNote')}</Text>
            <Button type="submit">{t('login')}</Button>
          </form>
        </>
      )}
      <ToastContainer />
    </Container>
  );
};

Phone.propTypes = {
  setShowModal: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  playerName: PropTypes.string.isRequired,
};

export default Phone;
