/* eslint-disable no-console */
import React from 'react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PhoneInput from 'react-phone-input-2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-phone-input-2/lib/style.css';
import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line react/prop-types
const Phone = ({ setShowModal }) => {
  // state variable to display confirmation code input
  const [displayConfirmationCodePrompt, setDisplayConfirmationCodePrompt] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [confirmationCode, setConfirmationCode] = React.useState('');
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
    console.log(`phoneNumber: ${phoneNumber}`);

    window.verifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
          console.log(`response: ${response}`);
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
          console.log('expired-callback');
        }
      },
      getAuth()
    );

    signInWithPhoneNumber(getAuth(), `+${phoneNumber}`, window.verifier)
      .then((result) => {
        console.log(`result: ${JSON.stringify(result)}`);
        setDisplayConfirmationCodePrompt(true);
        setFinal(result);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message);
      });
  };

  const handleSubmitConfirmationCode = (e) => {
    e.preventDefault();
    if (confirmationCode === null || final === null) return;
    final
      .confirm(confirmationCode)
      .then((result) => {
        // User signed in successfully.
        const { user } = result;
        // ...
        console.log(`user: ${user} user.phoneNumber: ${user.phoneNumber}`);
        setShowModal(false);
      })
      .catch((err) => {
        // User couldn't sign in (bad verification code?)
        // ...
        console.log(`error: ${err} error.message: ${err.message}`);
        toast.error(err.message);
      });
  };

  return (
    <div>
      <h2>Phone</h2>
      {displayConfirmationCodePrompt ? (
        <Form onSubmit={handleSubmitConfirmationCode}>
          <Form.Group className="mb-3" controlId="formBasicCode">
            <Form.Label>Confirmation Code</Form.Label>
            <Form.Control
              type="code"
              placeholder="000000"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              autoComplete="code"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit Confirmation Code
          </Button>
        </Form>
      ) : (
        <>
          <div ref={recaptchaContainerRef}>
            <div id="recaptcha-container" />
          </div>
          <Form onSubmit={handleSubmitPhoneNumber}>
            <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <PhoneInput
                country="us"
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
              />
              <Form.Text className="text-muted">
                We&#39;ll never share your phone number with anyone else.
              </Form.Text>
            </Form.Group>
            <Button variant="info" type="submit">
              Login
            </Button>
          </Form>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default Phone;
