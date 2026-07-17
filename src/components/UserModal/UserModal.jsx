import { useState, useEffect } from 'react';
import { Button, Title, Text } from '@mantine/core';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useFirebaseAuth } from 'contexts/FirebaseContext';
import { Table } from '@mantine/core';
import { getUser, createUser, archiveGame, unarchiveGame } from 'api/User';
import { getGameById } from 'api/Game';

const UserModal = ({ showModal, setShowModal, isEnglish }) => {
  const user = useFirebaseAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [gameData, setGameData] = useState([]);
  const [archivedIds, setArchivedIds] = useState(new Set());

  useEffect(() => {
    const fetchUser = async () => {
      let myUser = await getUser(user.uid);
      if (isEmpty(myUser)) {
        console.warn('User not found, creating it now');
        myUser = await createUser(user.uid);
      }
      setUserData(myUser || {});
      setArchivedIds(new Set(myUser?.archivedGames || []));
      return myUser;
    };

    const fetchGames = async (fetchedUser) => {
      // both the fetch and the create-on-miss fallback can fail (e.g. the
      // backend rejecting the request entirely) - nothing to fetch games
      // for in that case
      if (!fetchedUser) {
        console.warn('No user data available, skipping game history fetch');
        return;
      }
      console.info(`fetching ${fetchedUser.uid} games`);
      const myGames = await Promise.all(
        fetchedUser.games.map(async (gameId) => {
          const game = await getGameById(gameId);
          if (!game.players) {
            console.warn(`Error fetching game ${gameId}`);
          }
          return game;
        })
      );
      // do not load a game with a certain _id more than once
      const myUniqueGames = myGames.filter(
        (v, i, a) => a.findIndex((v2) => v2._id === v._id) === i
      );
      setGameData(myUniqueGames);
    };

    if (user) {
      fetchUser().then(fetchGames);
    }
  }, [setUserData, user?.uid, showModal]);

  const handleRejoin = (gameId) => {
    setShowModal(false);
    navigate(`/game/${gameId}`);
  };

  const handleArchive = async (gameId) => {
    await archiveGame(user.uid, gameId);
    setArchivedIds((prev) => new Set(prev).add(gameId));
  };

  const handleUnarchive = async (gameId) => {
    await unarchiveGame(user.uid, gameId);
    setArchivedIds((prev) => {
      const next = new Set(prev);
      next.delete(gameId);
      return next;
    });
  };

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
        content: {
          width: '80%',
          maxWidth: '600px',
          height: '70%',
          margin: 'auto',
          backgroundColor: '#ffffff',
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <Button variant="subtle" color="red" onClick={() => setShowModal(false)}>
          X
        </Button>
      </div>
      <Title size={25}>
        {isEnglish ? 'Hi, ' : '您好，'}
        {user?.displayName || user?.phoneNumber || user?.email}
      </Title>
      <Text>
        {isEnglish ? (
          <>
            You&apos;ve played{' '}
            <Text span fw={700}>
              {userData?.games?.length || 'no'}
            </Text>{' '}
            games
          </>
        ) : (
          <>
            您已經玩過{' '}
            <Text span fw={700}>
              {userData?.games?.length || 0}
            </Text>{' '}
            場遊戲
          </>
        )}
      </Text>

      <Text>
        {isEnglish ? 'Your rank is ' : '您的排名是 '}
        {userData?.rank || (isEnglish ? '(no rank)' : '（無排名）')}
      </Text>
      {/* create a table with columns date, opponent, win/loss, detail */}
      {userData?.games?.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>{isEnglish ? 'Date' : '日期'}</th>
              <th>{isEnglish ? 'Opponent' : '對手'}</th>
              <th>{isEnglish ? 'Result' : '結果'}</th>
              <th>{isEnglish ? 'Actions' : '操作'}</th>
            </tr>
          </thead>
          <tbody>
            {gameData.map((myGame) => {
              if (!myGame.players) {
                console.warn(`Failure to fetch a game:`, myGame);
                return;
              }
              const isIncomplete = !myGame.winnerId;
              return (
                <tr key={myGame._id}>
                  <td>{new Date(myGame.createdAt).toLocaleDateString()}</td>
                  {myGame.hostId && myGame.hostId === myGame.clientId ? (
                    <td>{isEnglish ? 'Yourself' : '您自己'}</td>
                  ) : (
                    <td>{myGame.hostId === user?.uid ? myGame.players[1] : myGame.players[0]}</td>
                  )}
                  <td>
                    {myGame.winnerId === user?.uid
                      ? isEnglish
                        ? 'Win'
                        : '勝利'
                      : (myGame.winnerId && (isEnglish ? 'Loss' : '失敗')) ??
                        (isEnglish ? 'Incomplete' : '未完成')}
                  </td>
                  <td>
                    {isIncomplete ? (
                      <div style={{ display: 'flex', gap: '0.4em', alignItems: 'center' }}>
                        {archivedIds.has(myGame._id) ? (
                          <>
                            <Text size="xs" c="dimmed">
                              {isEnglish ? 'Archived' : '已封存'}
                            </Text>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleUnarchive(myGame._id)}
                            >
                              {isEnglish ? 'Unarchive' : '取消封存'}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="xs" onClick={() => handleRejoin(myGame._id)}>
                              {isEnglish ? 'Rejoin' : '重新加入'}
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleArchive(myGame._id)}
                            >
                              {isEnglish ? 'Archive' : '封存'}
                            </Button>
                          </>
                        )}
                      </div>
                    ) : null}
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
  isEnglish: PropTypes.bool,
};

export default UserModal;
