import React from 'react';
import { Button } from '@mantine/core';
import Modal from 'react-modal';
import Login from 'components/Login';
import PropTypes from 'prop-types';

const AuthModal = ({ showModal, setShowModal, roomId, playerName }) => (
  <Modal
    ariaHideApp={false}
    isOpen={showModal}
    contentLabel="Login Modal"
    style={{
      overlay: {
        backgroundColor: '#00000080',
        zIndex: 120,
      },
      content: {
        width: '80%',
        maxWidth: '500px',
        height: '70%',
        margin: 'auto',
        backgroundColor: '#ffffff',
      },
    }}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
      <Button variant="subtle" color="red" onClick={() => setShowModal(false)}>
        X
      </Button>
    </div>

    <Login setShowModal={setShowModal} roomId={roomId} playerName={playerName} />
  </Modal>
);

AuthModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  playerName: PropTypes.string.isRequired,
};

export default AuthModal;
