import Login from 'components/Login';
// import { getAuth } from 'firebase/auth';
import React from 'react';
import { Button } from 'react-bootstrap';
// import { useAuthState } from 'react-firebase-hooks/auth';
import Modal from 'react-modal';

const NavBar = () => {
  // state variable to set modal to open or closed
  const [showModal, setShowModal] = React.useState(false);
  // const [user] = useAuthState(getAuth());

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '3em',
        margin: '1em'
      }}>
      <h1>陸戰棋</h1>

      {/* disabled until fully implemented */}
      {/* {user ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h5 style={{ display: 'inline', margin: '0.5em' }}>
              {user.displayName || user.email || user.phoneNumber}
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
        <Button variant="info" onClick={() => setShowModal(true)}>
          Sign In/Sign Up
        </Button>
      )} */}

      <Modal
        ariaHideApp={false}
        isOpen={showModal}
        contentLabel="Login Modal"
        style={{
          overlay: {
            backgroundColor: '#00000080'
          },
          // 50% of the screen width and height
          content: {
            width: '80%',
            maxWidth: '500px',
            height: '70%',
            margin: 'auto',
            backgroundColor: '#ffffff'
          }
        }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}>
          <Button variant="clear" onClick={() => setShowModal(false)}>
            x
          </Button>
        </div>

        <Login setShowModal={setShowModal} />
      </Modal>
    </div>
  );
};

export default NavBar;
