import { getAuth } from 'firebase/auth';
import React from 'react';
import { Button, ActionIcon } from '@mantine/core';
import { IconUserSquareRounded } from '@tabler/icons-react';

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
    isEnglish: { isEnglish, setIsEnglish },
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
        padding: '0.5em',
      }}>
      <h1>
        <Link to="/">陸戰棋</Link>
      </h1>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.25em',
        }}>
        {user ? (
          <>
            <ActionIcon
              size="lg"
              onClick={() => {
                setShowUserModal(true);
              }}>
              <IconUserSquareRounded />
            </ActionIcon>
            {/* </h5> */}

            <Button
              size="compact-sm"
              color="red"
              onClick={() => {
                getAuth().signOut();
                window.location.reload();
              }}>
              Logout
            </Button>
          </>
        ) : (
          <Button style={{ width: '11em' }} onClick={() => setShowAuthModal(true)}>
            Sign In/Sign Up
          </Button>
        )}
        <Button
          size="compact-sm"
          color="green"
          style={{ width: '3em' }}
          onClick={() => setIsEnglish(!isEnglish)}>
          {isEnglish ? '中文' : 'en'}
        </Button>
      </div>

      <AuthModal showModal={showAuthModal} setShowModal={setShowAuthModal} />
      <UserModal showModal={showUserModal} setShowModal={setShowUserModal} />
    </div>
  );
};

export default NavBar;
