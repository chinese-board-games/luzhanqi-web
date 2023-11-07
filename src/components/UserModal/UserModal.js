/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react';
import { Button, Title, Text } from '@mantine/core';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { useFirebaseAuth } from 'contexts/FirebaseContext';
import { Table } from '@mantine/core';
import { getUser, createUser } from 'api/User';
import { getGameById } from 'api/Game';

const UserModal = ({ showModal, setShowModal }) => {
  const user = useFirebaseAuth();
  const [userData, setUserData] = useState({});
  const [gameData, setGameData] = useState([]);

  // load user data
  useEffect(async () => {
    const fetchUser = async () => {
      let myUser = await getUser(user.uid);
      if (isEmpty(myUser)) {
        console.log('User not found, creating it now');
        myUser = await createUser(user.uid);
      }
      console.log('User loaded');
      setUserData(myUser);
      return myUser;
    };

    const fetchGames = async (fetchedUser) => {
      console.log(`fetching ${fetchedUser.uid} games`);
      const myGames = await Promise.all(
        fetchedUser.games.map(async (gameId) => {
          const game = await getGameById(gameId);
          if (!game.players) {
            console.warn(`Error fetching game ${gameId}`);
          }
          return game;
        })
      );
      console.log('Games loaded');
      // do not load a game with a certain _id more than once
      const myUniqueGames = myGames.filter(
        (v, i, a) => a.findIndex((v2) => v2._id === v._id) === i
      );
      setGameData(myUniqueGames);
    };

    if (user) {
      const myUser = await fetchUser();
      fetchGames(myUser);
    }
  }, [setUserData, user?.uid, showModal]);

  return (
    <Modal
      ariaHideApp={false}
      isOpen={showModal}
      contentLabel="User Modal"
      style={{
        overlay: {
          backgroundColor: '#00000080',
          zIndex: 120,
        },
        // 50% of the screen width and height
        content: {
          width: '80%',
          maxWidth: '600px',
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
      <Title size={25}>Hi, {user?.displayName || user?.phoneNumber || user?.email}</Title>
      <Text>
        You&apos;ve played{' '}
        <Text span fw={700}>
          {userData?.games?.length || 'no'}
        </Text>{' '}
        games
      </Text>

      <Text>Your rank is {userData?.rank || '(no rank)'}</Text>
      {/* create a table with columns date, opponent, win/loss, detail */}
      {userData?.games?.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Opponent</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {gameData.map((myGame) => {
              if (!myGame.players) {
                console.warn(`Failure to fetch a game:`, myGame);
                return;
              }
              return (
                <tr key={myGame._id}>
                  <td>{new Date(myGame.createdAt).toLocaleDateString()}</td>
                  {myGame.hostId && myGame.hostId === myGame.clientId ? (
                    <td>Yourself</td>
                  ) : (
                    <td>{myGame.hostId === user?.uid ? myGame.players[1] : myGame.players[0]}</td>
                  )}
                  <td>
                    <p>
                      {myGame.winnerId === user?.uid ? 'Win' : (myGame.winnerId && 'Loss') ?? 'Incomplete'}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Modal>
  );
};

UserModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
};

export default UserModal;
