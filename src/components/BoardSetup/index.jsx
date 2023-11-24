import { useContext } from 'react';
import { GameContext } from 'contexts/GameContext';

import HalfBoard from './HalfBoard';
import { Title } from '@mantine/core';

export default function BoardSetup() {
  const {
    playerName: { playerName },
    playerList: { playerList },
    spectatorName: { spectatorName },
    spectatorList: { spectatorList },
    roomId: { roomId },
    socket,
    submittedSide: { submittedSide },
    isEnglish: { isEnglish },
  } = useContext(GameContext);

  const isSpectator = spectatorList.includes(spectatorName);

  const sendStartingBoard = (halfBoard) => {
    socket.emit('playerInitialBoard', {
      playerName,
      myPositions: halfBoard,
      room: roomId,
    });
  };

  if (isSpectator) {
    return (
      <>
        <Title order={2}>Waiting for players to set the board</Title>
        <Title order={2}>等待玩家設定棋盤</Title>
      </>
    );
  }

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
