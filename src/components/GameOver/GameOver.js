import React, { useContext } from 'react';
import { GameContext } from 'contexts/GameContext';

const GameOver = () => {
  const gameState = useContext(GameContext);
  const {
    winner: { winner },
    playerName: { playerName },
    playerList: { playerList }
  } = gameState;
  // get player's index from playerName and playerList
  const playerIndex = playerList.indexOf(playerName);

  return (
    <div>
      <h1>Game Over</h1>
      {winner === playerIndex ? <h2>You win!</h2> : <h2>You lost</h2>}
    </div>
  );
};

export default GameOver;
