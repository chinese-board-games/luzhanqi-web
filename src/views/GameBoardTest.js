import React from 'react';
import GameBoard from 'components/GameBoard';
import { GameProvider } from 'contexts/GameContext';

export default function SetupTest() {
  return (
    <GameProvider>
      <GameBoard />
    </GameProvider>
  );
}
