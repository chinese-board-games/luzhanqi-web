import React, { useContext } from 'react';
import { GameContext } from 'contexts/GameContext';

const GameOver = () => {
  const gameState = useContext(GameContext);
  const { winner } = gameState.winner;
  const { host } = gameState.host;
  return (
    <div>
      <h1>Game Over</h1>
      {!!winner !== host ? <h2>You win!</h2> : <h2>You lost</h2>}
    </div>
  );
};

export default GameOver;
