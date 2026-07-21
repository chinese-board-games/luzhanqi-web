import React, { useContext, useEffect } from 'react';
import { Button, Checkbox, Container, CopyButton, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { GameContext } from 'contexts/GameContext';
import { ToastContainer, toast } from 'react-toastify';
import { useFirebaseAuth } from 'contexts/FirebaseContext';

const Lobby = () => {
  const { t } = useTranslation('lobby');
  const {
    socket,
    roomId: { roomId },
    joinCode: { joinCode },
    playerName: { playerName },
    playerList: { playerList },
    spectatorName: { spectatorName },
    spectatorList: { spectatorList },
    host: { host },
    joinedGame: { joinedGame },
    errors: { errors, setErrors },
  } = useContext(GameContext);

  const user = useFirebaseAuth();
  const configForm = useForm({
    initialValues: {
      fogOfWar: true,
      landminesSurvive: false,
      flyingBombs: false,
      captureTheFlag: false,
    },
  });

  /** Clear errors after 1 second each */
  useEffect(() => {
    errors.forEach((error) => {
      toast.error(error, {
        toastId: `${Date.now()}`,
      });
    });
    setErrors([]);
  }, [JSON.stringify(errors), toast.error]);

  /** Tell server to begin game */
  const roomFull = (gameConfig) => {
    // the game requires two players to begin
    if (playerList.length >= 2) {
      socket.emit('hostRoomFull', roomId, gameConfig);
    } else {
      setErrors((prevErrors) => [...prevErrors, t('twoPlayersRequired')]);
    }
  };

  const playerLeaveRoom = async () => {
    socket.emit('playerLeaveRoom', {
      playerName,
      idToken: user ? await user.getIdToken() : null,
      leaveRoomId: roomId,
    });
  };

  const spectatorLeaveRoom = async () => {
    socket.emit('spectatorLeaveRoom', {
      spectatorName,
      idToken: user ? await user.getIdToken() : null,
      leaveRoomId: roomId,
    });
  };

  const memberLeaveRoom = () => {
    if (spectatorList.includes(spectatorName)) {
      spectatorLeaveRoom();
    } else {
      playerLeaveRoom();
    }
  };

  return (
    <Container style={{ backgroundColor: '#d0edf5' }}>
      {joinCode ? (
        <Container style={{ display: 'flex', alignItems: 'center', gap: '0.5em', padding: 0 }}>
          <Text size="md">{t('roomCode')}</Text>
          <Text size="xl" weight={700} sx={{ fontFamily: 'monospace', letterSpacing: '0.15em' }}>
            {joinCode}
          </Text>
          <CopyButton value={joinCode}>
            {({ copied, copy }) => (
              <Button size="xs" color={copied ? 'green' : 'blue'} onClick={copy}>
                {copied ? t('copied') : t('copy')}
              </Button>
            )}
          </CopyButton>
        </Container>
      ) : null}
      {
        /** You have joined the game and are waiting for the host to start */
        joinedGame && !host ? (
          <>
            <Title order={3}>{t('waitingForHost')}</Title>
            <Button variant="outline" color="red" onClick={memberLeaveRoom}>
              {t('leaveRoom')}
            </Button>
          </>
        ) : null
      }

      {
        /** Give host ability to start game */
        host ? (
          <>
            <Title order={3}>{t('clickRoomFull')}</Title>
            <Container style={{ display: 'flex', gap: '0.5em' }}>
              <Button
                variant="filled"
                color="green"
                onClick={() => roomFull(configForm.values)}
                style={{ width: '8em' }}
              >
                {t('roomFull')}
              </Button>
              <Button variant="outline" color="red" onClick={playerLeaveRoom}>
                {t('deleteRoom')}
              </Button>
            </Container>
            <Title order={4}>{t('rules')}</Title>
            <form>
              <Checkbox
                mt="md"
                label={t('enableFogOfWar')}
                {...configForm.getInputProps('fogOfWar', { type: 'checkbox' })}
              />
              <Checkbox
                mt="sm"
                label={t('landminesSurvive')}
                {...configForm.getInputProps('landminesSurvive', { type: 'checkbox' })}
              />
              <Checkbox
                mt="sm"
                label={t('flyingBombs')}
                {...configForm.getInputProps('flyingBombs', { type: 'checkbox' })}
              />
              <Checkbox
                mt="sm"
                label={t('captureTheFlag')}
                {...configForm.getInputProps('captureTheFlag', { type: 'checkbox' })}
              />
            </form>
          </>
        ) : null
      }

      <ToastContainer />
    </Container>
  );
};

export default Lobby;
