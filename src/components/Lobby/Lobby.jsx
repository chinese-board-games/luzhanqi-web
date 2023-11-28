import React, { useContext } from 'react';
import { Button, Checkbox, Container, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { GameContext } from 'contexts/GameContext';
import { useFirebaseAuth } from 'contexts/FirebaseContext';

const Lobby = () => {
  const {
    socket,
    roomId: { roomId },
    playerName: { playerName },
    playerList: { playerList },
    spectatorName: { spectatorName },
    spectatorList: { spectatorList },
    host: { host },
    joinedGame: { joinedGame },
    errors: { setErrors },
  } = useContext(GameContext);

  const user = useFirebaseAuth();
  const configForm = useForm({
    initialValues: {
      fogOfWar: true,
    },
  });

  /** Tell server to begin game */
  const roomFull = (gameConfig) => {
    // the game requires two players to begin
    if (playerList.length >= 2) {
      socket.emit('hostRoomFull', roomId, gameConfig);
    } else {
      setErrors((prevErrors) => [...prevErrors, 'There must be two players in the lobby']);
    }
  };

  const playerLeaveRoom = () => {
    socket.emit('playerLeaveRoom', {
      playerName,
      uid: user?.uid || null,
      leaveRoomId: roomId,
    });
  };

  const spectatorLeaveRoom = () => {
    socket.emit('spectatorLeaveRoom', {
      spectatorName,
      uid: user?.uid || null,
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
      {
        /** You have joined the game and are waiting for the host to start */
        joinedGame && !host ? (
          <>
            <Title order={3}>請等主持人</Title>
            <Title order={3}>Waiting for the host</Title>
            <Button variant="outline" color="red" onClick={memberLeaveRoom}>
              Leave Room
            </Button>
          </>
        ) : null
      }

      {
        /** Give host ability to start game */
        host ? (
          <>
            <Title order={3}>按 &quot;Room Full&quot; 開始遊戲</Title>
            <Title order={3}>Click &quot;Room Full&quot; to begin the game</Title>
            <Container style={{ display: 'flex', gap: '0.5em' }}>
              <Button
                variant="filled"
                color="green"
                onClick={() => roomFull(configForm.values)}
                style={{ width: '8em' }}
              >
                Room Full
              </Button>
              <Button variant="outline" color="red" onClick={playerLeaveRoom}>
                Delete Room
              </Button>
            </Container>
            <Title order={4}>Rules</Title>
            <form>
              <Checkbox
                mt="md"
                label="Enable fog of war"
                {...configForm.getInputProps('fogOfWar', { type: 'checkbox' })}
              />
            </form>
          </>
        ) : null
      }
    </Container>
  );
};

export default Lobby;
