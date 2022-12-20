import Login from 'components/Login';
import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';

const NavBar = () => {
  // state variable to set modal to open or closed
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <h1>NavBar</h1>
      <Button onClick={() => setShowModal(true)}>open</Button>

      <Modal
        isOpen={showModal}
        // onRequestClose={() => setShowModal(false)}
        contentLabel="Example Modal">
        <Button onClick={() => setShowModal(false)}>close</Button>
        <Login />
      </Modal>
    </div>
  );
};

export default NavBar;
