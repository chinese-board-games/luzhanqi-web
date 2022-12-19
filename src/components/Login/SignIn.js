import { getAuth } from 'firebase/auth';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

// eslint-disable-next-line react/prop-types
const SignIn = ({ setExistingAccount }) => {
  const auth = getAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(email, password)
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
      <h2>Sign In</h2>
      <Form onSubmit={handleSignIn}>
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
            autoComplete="current-password"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Button variant="link" onClick={() => setExistingAccount(false)}>
          Create Account
        </Button>
      </Form>
    </div>
  );
};

export default SignIn;
