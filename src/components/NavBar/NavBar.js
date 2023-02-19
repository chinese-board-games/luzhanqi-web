import { getAuth } from 'firebase/auth';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuthState } from 'react-firebase-hooks/auth';

import AuthModal from 'components/AuthModal';
import UserModal from 'components/UserModal';

const NavBar = () => {
  // state variable to set modal to open or closed
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showUserModal, setShowUserModal] = React.useState(false);
  const [user] = useAuthState(getAuth());

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '3em',
        margin: '1em'
      }}>
      <h1>
        <a href="https://ancientchess.com/page/play-luzhanqi.htm" target="_blank" rel="noreferrer">
          陸戰棋
        </a>
      </h1>

      {/* disabled until fully implemented */}
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
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: 'none'
                }}
                type="button"
                onClick={() => {
                  setShowUserModal(true);
                }}>
                {user.displayName || user.email || user.phoneNumber}
              </button>
            </h5>

            <Button
              variant="danger"
              onClick={() => {
                getAuth().signOut();
                window.location.reload();
              }}>
              Logout
            </Button>
          </div>
        </>
      ) : (
        <Button variant="info" onClick={() => setShowAuthModal(true)}>
          Sign In/Sign Up
        </Button>
      )}

      <AuthModal showModal={showAuthModal} setShowModal={setShowAuthModal} />
      <UserModal showModal={showUserModal} setShowModal={setShowUserModal} />
    </div>
  );
};

export default NavBar;
