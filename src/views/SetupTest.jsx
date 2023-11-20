import React from 'react';
import BoardSetup from 'components/BoardSetup';
import { GameProvider } from 'contexts/GameContext';

export default function SetupTest() {
  return (
    <GameProvider>
      <BoardSetup />
    </GameProvider>
  );
}
