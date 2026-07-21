import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { GameContext } from 'contexts/GameContext';

import HalfBoard from './HalfBoard';
import { Title } from '@mantine/core';

export default function BoardSetup() {
  const { t } = useTranslation('boardSetup');
  const {
    playerName: { playerName },
    playerList: { playerList },
    spectatorName: { spectatorName },
    spectatorList: { spectatorList },
    roomId: { roomId },
    socket,
    submittedSide: { submittedSide },
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
    return <Title order={2}>{t('waitingForBoard')}</Title>;
  }

  return submittedSide ? (
    <Title order={2}>{t('waitingForOpponent')}</Title>
  ) : (
    <HalfBoard
      sendStartingBoard={sendStartingBoard}
      playerList={playerList}
      playerName={playerName}
    />
  );
}
