/* eslint-disable no-console */
import React from 'react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

import { useForm } from '@mantine/form';
import { Button, TextInput } from '@mantine/core';
import PhoneInput from 'react-phone-input-2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-phone-input-2/lib/style.css';
import 'react-toastify/dist/ReactToastify.css';
import { addGame } from 'api/User';
import { updateUidMap } from 'api/Game';

// eslint-disable-next-line react/prop-types
const Phone = ({ setShowModal, roomId, playerName }) => {
  const confirmForm = useForm({
    initialValues: {
      confirmationCode: '',
    },
  });

  // state variable to display confirmation code input
  const [displayConfirmationCodePrompt, setDisplayConfirmationCodePrompt] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [final, setFinal] = React.useState('');

  // create a ref to the recaptcha container
  const recaptchaContainerRef = React.useRef();

  const handleSubmitPhoneNumber = (e) => {
    e.preventDefault();
    if (phoneNumber === '' || phoneNumber.length < 10) {
      toast.warn('Please enter a valid phone number');
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
          console.warning('expired-callback');
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
        // User signed in successfully.
        const { user } = result;
        if (roomId) {
          // already joined a room
          addGame(user.uid, roomId);
          updateUidMap(roomId, playerName, user.uid);
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
    <div>
      <h2>Phone</h2>
      {displayConfirmationCodePrompt ? (
        <form
          onSubmit={confirmForm.onSubmit(
            handleSubmitConfirmationCode,
            handleConfirmationCodeError
          )}>
          <TextInput
            label="Confirmation code"
            placeholder="000000"
            {...confirmForm.getInputProps('confirmationCode')}
          />
          <Button type="submit">Submit Confirmation Code</Button>
        </form>
      ) : (
        <>
          <div ref={recaptchaContainerRef}>
            <div id="recaptcha-container" />
          </div>
          {/* Kept old format because we use a special component to handle phone numbers */}
          <form onSubmit={handleSubmitPhoneNumber}>
            <p>Phone Number</p>
            <PhoneInput
              country="us"
              value={phoneNumber}
              onChange={(phone) => setPhoneNumber(phone)}
            />
            <p>We&#39;ll never share your phone number with anyone else.</p>
            <Button type="submit">Login</Button>
          </form>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default Phone;
