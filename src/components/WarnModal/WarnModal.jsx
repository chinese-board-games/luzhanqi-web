import React from 'react';
import { Button, Flex, Title, Text } from '@mantine/core';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const WarnModal = ({ showModal, setShowModal, forfeit, isEnglish }) => (
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
    <Title order={2}>{isEnglish ? 'Are you sure?' : '您確定嗎？'}</Title>
    <Text>
      {isEnglish
        ? 'To leave a game in-progress is to forfeit the game.'
        : '離開進行中的遊戲將視為投降。'}
    </Text>
    <br />
    <Flex style={{ gap: '0.25em', justifyContent: 'flex-end' }}>
      <Button
        color="red"
        onClick={() => {
          forfeit();
          setShowModal(false);
        }}
      >
        {isEnglish ? 'Forfeit' : '投降'}
      </Button>
      <Button color="green" onClick={() => setShowModal(false)}>
        {isEnglish ? 'Return to game' : '返回遊戲'}
      </Button>
    </Flex>
  </Modal>
);

WarnModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  forfeit: PropTypes.func.isRequired,
  isEnglish: PropTypes.bool,
};

export default WarnModal;
