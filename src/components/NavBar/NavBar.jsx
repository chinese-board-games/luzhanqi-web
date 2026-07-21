import { getAuth } from 'firebase/auth';
import React from 'react';
import { Button, ActionIcon, Flex, Title } from '@mantine/core';
import { IconUserSquareRounded } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { useAuthState } from 'react-firebase-hooks/auth';

import { GameContext } from 'contexts/GameContext';
import AuthModal from 'components/AuthModal';
import UserModal from 'components/UserModal';
import WarnModal from 'components/WarnModal';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';
import LanguageSwitcher from './LanguageSwitcher';

const NavBar = () => {
  const { t } = useTranslation();
  // state variable to set modal to open or closed
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showUserModal, setShowUserModal] = React.useState(false);
  const [showWarnModal, setShowWarnModal] = React.useState(false);

  const [user] = useAuthState(getAuth());

  const {
    socket,
    playerName: { playerName, setPlayerName },
    roomId: { roomId, setRoomId },
    storedPlayerName: { setStoredPlayerName },
    storedRoomId: { setStoredRoomId },
    storedPlayerList: { setStoredPlayerList },
    host: { setHost },
    joinedGame: { setJoinedGame },
    clientTurn: { setClientTurn },
    playerList: { playerList, setPlayerList },
    myBoard: { setMyBoard },
    myPositions: { setMyPositions },
    submittedSide: { setSubmittedSide },
    pendingMove: { setPendingMove },
    successors: { setSuccessors },
    gamePhase: { gamePhase, setGamePhase },
    startingBoard: { setStartingBoard },
    winner: { setWinner },
    gameResults: { setGameResults },
    // still consumed as a plain boolean by the many child components below
    // (AuthModal/UserModal/WarnModal) that haven't been migrated to
    // useTranslation() yet - see the compat shim in GameContext.jsx
    isEnglish: { isEnglish },
    errors: { setErrors },
  } = React.useContext(GameContext);

  const forfeit = () => {
    socket.emit('playerForfeit', {
      playerName,
      room: roomId,
    });
  };

  const resetToLanding = async () => {
    if (gamePhase == 2) {
      setShowWarnModal(true);
      return;
    }
    /** user-input: the user's name */
    const defaultName = uniqueNamesGenerator({
      dictionaries: [colors, animals],
      length: 2,
    });
    /** game ID assigned to host, or user-input: game Id entered by player */
    setStoredRoomId(null);
    setStoredPlayerList([]);
    setHost(false);
    setJoinedGame(false);
    setClientTurn(-1);
    setPlayerList([]);
    setMyBoard(Array(12).fill(Array(5).fill(null)));
    setMyPositions(Array(6).fill(Array(5).fill(null)));
    setSubmittedSide(false);
    setPendingMove({
      source: [],
      target: [],
    });
    setSuccessors([]);
    setGamePhase(0);
    const boardPositions = {};

    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 5; i++) {
        boardPositions[[j, i]] = 'none';
      }
    }
    setStartingBoard(boardPositions);
    setWinner(null);
    setGameResults({ remain: [[], []], lost: [[], []] });
    setErrors([]);
    socket.emit('playerLeaveRoom', {
      playerName,
      idToken: user ? await user.getIdToken() : null,
      leaveRoomId: roomId,
    });
    setRoomId('');
    setPlayerName(defaultName);
    setStoredPlayerName(null);
  };

  return (
    <Flex
      style={{
        justifyContent: 'space-between',
        height: '4em',
        backgroundColor: '#afdfff',
        padding: '0.5em',
      }}
    >
      {playerList.length ? (
        <Flex style={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="filled" color="violet" size="compact-lg" onClick={resetToLanding}>
            {t('nav.returnHome')}
          </Button>
        </Flex>
      ) : (
        <Title order={1} color="darkred">
          {t('nav.title')}
        </Title>
      )}

      <Flex
        style={{
          alignItems: 'center',
          gap: '0.25em',
        }}
      >
        {user ? (
          <>
            <ActionIcon
              size="lg"
              onClick={() => {
                setShowUserModal(true);
              }}
            >
              <IconUserSquareRounded />
            </ActionIcon>

            <Button
              size="compact-md"
              color="red"
              onClick={() => {
                getAuth().signOut();
                window.location.reload();
              }}
            >
              {t('nav.logout')}
            </Button>
          </>
        ) : (
          <Button size="compact-md" onClick={() => setShowAuthModal(true)}>
            {t('nav.signIn')}
          </Button>
        )}
        <LanguageSwitcher />
      </Flex>

      <AuthModal
        showModal={showAuthModal}
        setShowModal={setShowAuthModal}
        roomId={roomId}
        playerName={playerName}
        isEnglish={isEnglish}
      />
      <UserModal showModal={showUserModal} setShowModal={setShowUserModal} isEnglish={isEnglish} />
      <WarnModal
        showModal={showWarnModal}
        setShowModal={setShowWarnModal}
        forfeit={forfeit}
        isEnglish={isEnglish}
      />
    </Flex>
  );
};

export default NavBar;
