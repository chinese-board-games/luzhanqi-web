/* eslint-disable no-console */
import { getAuth } from 'firebase/auth';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';

// eslint-disable-next-line react/prop-types
const CreateAccount = ({ setExistingAccount, setShowModal }) => {
  const auth = getAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(
    auth
  );

  const handleCreateAccount = (e) => {
    e.preventDefault();
    console.log(`email: ${email}`, `password: ${password}`, `confirmPassword: ${confirmPassword}`);
    createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        console.log(`userCredential: ${userCredential}`);
        // ...
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.log(`errorCode: ${errorCode}`);
        console.log(`errorMessage: ${errorMessage}`);
        setShowModal(false);
      });
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
      <h2>Create Account</h2>

      <Form onSubmit={handleCreateAccount}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="example@provider.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          <Form.Text className="text-muted">
            We&#39;ll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </Form.Group>

        <Button variant="info" type="submit" disabled={!(password === confirmPassword)}>
          Sign Up
        </Button>
        <Button variant="link" onClick={() => setExistingAccount(true)}>
          Sign In
        </Button>
      </Form>
    </div>
  );
};

export default CreateAccount;
