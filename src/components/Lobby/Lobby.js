/* eslint-disable no-console */
import React, { useContext } from 'react';
import { Button, Container, Title } from '@mantine/core';
import { GameContext } from 'contexts/GameContext';
import { useFirebaseAuth } from 'contexts/FirebaseContext';

const Lobby = () => {
  const gameState = useContext(GameContext);
  const { socket } = gameState;
  const { roomId } = gameState.roomId;
  const { host } = gameState.host;
  const { joinedGame } = gameState.joinedGame;
  const user = useFirebaseAuth();

  /** Tell server to begin game */
  const roomFull = () => {
    socket.emit('hostRoomFull', roomId);
  };

  return (
    <Container style={{ backgroundColor: '#d0edf5' }}>
      {
        /** You have joined the game and are waiting for the host to start */
        joinedGame && !host ? (
          <>
            <Title order={3}>請等主持人</Title>
            <Title order={3}>Waiting for the host</Title>
          </>
        ) : null
      }

      {
        /** Give host ability to start game */
        host ? (
          <>
            <Title order={3}>按 &quot;Room Full&quot; 開始遊戲</Title>
            <Title order={3}>Click &quot;Room Full&quot; to begin the game</Title>
            <Button type="button" variant="success" onClick={roomFull} style={{ width: '8em' }}>
              Room Full
            </Button>
          </>
        ) : null
      }

      {
        /** Not host and haven't joined a game, give option to join game */
        host || joinedGame ? null : (
          <>
            {user ? (
              <>
                <Title order={2}>Hello {user.email}</Title>
              </>
            ) : (
              <Container />
            )}
          </>
        )
      }
    </Container>
  );
};

export default Lobby;
