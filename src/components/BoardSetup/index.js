/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { GameContext } from 'contexts/GameContext';

import HalfBoard from './HalfBoard';
import { Title } from '@mantine/core';

export default function BoardSetup() {
  const {
    playerList: { playerList },
    playerName: { playerName },
    roomId: { roomId },
    socket,
    submittedSide: { submittedSide },
    isEnglish: { isEnglish },
  } = useContext(GameContext);

  const sendStartingBoard = (halfBoard) => {
    console.log('sendStartingBoard', halfBoard);
    socket.emit('playerInitialBoard', {
      playerName,
      myPositions: halfBoard,
      room: roomId,
    });
  };

  return submittedSide ? (
    <>
      <Title order={2}>請等對手</Title>
      <Title order={2}>Waiting for other player</Title>
    </>
  ) : (
    <HalfBoard
      sendStartingBoard={sendStartingBoard}
      playerList={playerList}
      playerName={playerName}
      isEnglish={isEnglish}
    />
  );
}
