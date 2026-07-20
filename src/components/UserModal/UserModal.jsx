import { useState, useEffect } from 'react';
import { ActionIcon, Box, Button, Title, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
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
          if (!game?.players) {
            console.warn(`Error fetching game ${gameId}`);
          }
          return game;
        })
      );
      // drop games that failed to fetch (e.g. deleted but still referenced
      // by the user), and do not load a game with a certain _id more than once
      const myUniqueGames = myGames
        .filter((game) => game?.players)
        .filter((v, i, a) => a.findIndex((v2) => v2._id === v._id) === i);
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
          zIndex: 300,
        },
        content: {
          // override react-modal's default 40px top/left/right/bottom inset
          // - margin:auto needs the full viewport to center within, since 2x
          // 40px insets leave less room than minWidth on narrow phone
          // screens, forcing the box off-center
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: 'auto',
          minWidth: '320px',
          maxWidth: 'min(600px, 90vw)',
          maxHeight: '80vh',
          margin: 'auto',
          backgroundColor: '#ffffff',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* position:relative lives here, not on react-modal's own content box -
       * that box relies on position:absolute + left/right + margin:auto
       * (from react-modal's default styles) to stay centered, and overriding
       * it to relative turns those left/right insets into an offset instead
       * of a centering anchor, pushing the modal off-center */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        <ActionIcon
          variant="subtle"
          color="gray"
          radius="xl"
          size="lg"
          onClick={() => setShowModal(false)}
          aria-label={isEnglish ? 'Close' : '關閉'}
          sx={{ position: 'absolute', top: '0.5em', right: '0.5em', zIndex: 10 }}
        >
          <IconX size={20} />
        </ActionIcon>
        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '1.5em' }}>
          <Title size={25} pr="2em">
            {isEnglish ? 'Hi, ' : '您好，'}
            {user?.displayName || user?.phoneNumber || user?.email}
          </Title>
          <Text>
            {isEnglish ? (
              <>
                You&apos;ve played{' '}
                <Text span fw={700}>
                  {gameData.length || 'no'}
                </Text>{' '}
                games
              </>
            ) : (
              <>
                您已經玩過{' '}
                <Text span fw={700}>
                  {gameData.length || 0}
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
          {gameData.length > 0 && (
            <Box sx={{ overflowX: 'auto' }}>
              <Table
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
                sx={{ whiteSpace: 'nowrap', width: 'auto' }}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{isEnglish ? 'Date' : '日期'}</Table.Th>
                    <Table.Th>{isEnglish ? 'Opponent' : '對手'}</Table.Th>
                    <Table.Th>{isEnglish ? 'Result' : '結果'}</Table.Th>
                    <Table.Th>{isEnglish ? 'Actions' : '操作'}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {gameData.map((myGame) => {
                    if (!myGame.players) {
                      console.warn(`Failure to fetch a game:`, myGame);
                      return;
                    }
                    const isIncomplete = !myGame.winnerId;
                    return (
                      <Table.Tr key={myGame._id}>
                        <Table.Td>
                          {new Date(myGame.createdAt).toLocaleDateString(undefined, {
                            year: '2-digit',
                            month: 'numeric',
                            day: 'numeric',
                          })}
                        </Table.Td>
                        {myGame.hostId && myGame.hostId === myGame.clientId ? (
                          <Table.Td>{isEnglish ? 'Yourself' : '您自己'}</Table.Td>
                        ) : (
                          <Table.Td>
                            {myGame.hostId === user?.uid ? myGame.players[1] : myGame.players[0]}
                          </Table.Td>
                        )}
                        <Table.Td>
                          {myGame.winnerId === user?.uid
                            ? isEnglish
                              ? 'Win'
                              : '勝利'
                            : (myGame.winnerId && (isEnglish ? 'Loss' : '失敗')) ??
                              (isEnglish ? 'Incomplete' : '未完成')}
                        </Table.Td>
                        <Table.Td>
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
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Box>
          )}
        </Box>
      </div>
    </Modal>
  );
};

UserModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  isEnglish: PropTypes.bool,
};

export default UserModal;
