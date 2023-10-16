import { getAuth } from 'firebase/auth';
import React from 'react';
import { Button } from '@mantine/core';

import { useAuthState } from 'react-firebase-hooks/auth';

import { GameContext } from 'contexts/GameContext';
import AuthModal from 'components/AuthModal';
import UserModal from 'components/UserModal';
import { Link } from 'react-router-dom';

const NavBar = () => {
  // state variable to set modal to open or closed
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showUserModal, setShowUserModal] = React.useState(false);
  const [user] = useAuthState(getAuth());

  const gameState = React.useContext(GameContext);
  const {
    isEnglish: { isEnglish, setIsEnglish }
  } = gameState;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '4em',
        margin: '1em',
        backgroundColor: '#afdfff',
        margin: 0,
        padding: '0.5em'
      }}>
      <h1>
        <Link to="/">陸戰棋</Link>
      </h1>

      {user ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h5
              style={{
                display: 'flex',
                margin: '0.5em',
                marginRight: '0.25em',
                border: '1px solid #000000',
                borderRadius: '0.25em',
                height: '2em'
              }}>
              <Button
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#007bff'
                }}
                onClick={() => {
                  setShowUserModal(true);
                }}>
                {user.displayName || user.email || user.phoneNumber}
              </Button>
            </h5>

            <Button
              variant="filled"
              color="red"
              onClick={() => {
                getAuth().signOut();
                window.location.reload();
              }}>
              Logout
            </Button>
          </div>
        </>
      ) : (
        <Button style={{ width: '11em' }} onClick={() => setShowAuthModal(true)}>
          Sign In/Sign Up
        </Button>
      )}

      <Button
        style={{ width: '4.5em' }}
        variant="filled"
        color="green"
        onClick={() => setIsEnglish(!isEnglish)}>
        {isEnglish ? 'CN' : 'EN'}
      </Button>

      <AuthModal showModal={showAuthModal} setShowModal={setShowAuthModal} />
      <UserModal showModal={showUserModal} setShowModal={setShowUserModal} />
    </div>
  );
};

export default NavBar;
