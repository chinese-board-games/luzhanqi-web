/* eslint-disable no-console */
import React, { useContext, useEffect } from 'react';
import { Button, Container, Title } from '@mantine/core';
import { GameContext } from 'contexts/GameContext';
import { ToastContainer, toast } from 'react-toastify';

const Lobby = () => {
  const {
    socket,
    roomId: { roomId },
    playerList: { playerList },
    host: { host },
    joinedGame: { joinedGame },
    errors: { errors, setErrors }
  } = useContext(GameContext);

  /** Clear errors after 1 second each */
  useEffect(() => {
    errors.forEach((error) => {
      toast.error(error, {
        toastId: `${Date.now()}`
      });
    });
    setErrors([]);
  }, [JSON.stringify(errors), toast.error]);

  /** Tell server to begin game */
  const roomFull = () => {
    // the game requires two players to begin
    if (playerList.length >= 2) {
      socket.emit('hostRoomFull', roomId);
    } else {
      setErrors((prevErrors) => [...prevErrors, 'There must be two players in the lobby']);
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

      <ToastContainer />
    </Container>
  );
};

export default Lobby;
