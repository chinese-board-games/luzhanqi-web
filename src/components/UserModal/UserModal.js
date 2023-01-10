import Button from 'react-bootstrap/Button';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import { useFirebaseAuth } from 'contexts/FirebaseContext';
import { Table } from 'react-bootstrap';

const UserModal = ({ showModal, setShowModal }) => {
  const user = useFirebaseAuth();

  return (
    <Modal
      ariaHideApp={false}
      isOpen={showModal}
      contentLabel="User Modal"
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
      <h1>Hi, {user?.displayName}</h1>
      <h2>{user?.uid}</h2>
      <p>You&apos;ve played x games</p>
      {/* create a table with columns date, opponent, win/loss, detail */}
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Opponent</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2021-08-01</td>
            <td>John Doe</td>
            <td>
              <a href="https://www.google.com">Win</a>
            </td>
          </tr>
          <tr>
            <td>2021-08-02</td>
            <td>John Doe</td>
            <td>
              <a href="https://www.google.com">Loss</a>
            </td>
          </tr>
        </tbody>
      </Table>
    </Modal>
  );
};

UserModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired
};

export default UserModal;
