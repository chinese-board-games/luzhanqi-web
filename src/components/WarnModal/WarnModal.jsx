import React from 'react';
import { Button, Flex, Title, Text } from '@mantine/core';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const WarnModal = ({ showModal, setShowModal, forfeit }) => (
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
        maxWidth: '25em',
        height: '15em',
        margin: 'auto',
        backgroundColor: '#ffffff',
      },
    }}
  >
    <Flex
      style={{
        justifyContent: 'flex-end',
      }}
    >
      <Button variant="subtle" color="red" onClick={() => setShowModal(false)}>
        X
      </Button>
    </Flex>
    <Title order={2}>Are you sure?</Title>
    <Text>You will forfeit the game.</Text>
    <br />
    <Flex style={{ gap: '0.25em', justifyContent: 'flex-end' }}>
      <Button
        color="red"
        onClick={() => {
          forfeit();
          setShowModal(false);
        }}
      >
        Forfeit
      </Button>
      <Button color="green" onClick={() => setShowModal(false)}>
        Keep playing
      </Button>
    </Flex>
  </Modal>
);

WarnModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  forfeit: PropTypes.func.isRequired,
};

export default WarnModal;
