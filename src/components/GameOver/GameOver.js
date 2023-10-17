import React, { useContext } from 'react';
import { GameContext } from 'contexts/GameContext';
import { Container, Table } from '@mantine/core';

const GameOver = () => {
  const gameState = useContext(GameContext);
  const {
    winner: { winner },
    playerName: { playerName },
    playerList: { playerList },
    gameResults: { gameResults },
    host: { host }
  } = gameState;

  console.log(gameResults);
  const { remain } = gameResults;
  console.log(remain);

  // get player's index from playerName and playerList
  const playerIndex = playerList.indexOf(playerName);
  console.log(gameState);

  const getCleanName = (name) => {
    return name
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Container style={{ backgroundColor: 'white', borderRadius: '0.5em', padding: '1em' }}>
      <h1>Game Over</h1>
      {winner === playerIndex ? <h2>You win!</h2> : <h2>You lost</h2>}
      <h4>Your pieces</h4>
      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Piece</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {remain[host ? 0 : 1]
            .sort((a, b) => b.order - a.order)
            .map(({ name, count }) => {
              return (
                <tr key={name}>
                  <td>{getCleanName(name)}</td>
                  <td>{count}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <br />
      <h4>Opponent&apos;s pieces</h4>
      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Piece</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {remain[host ? 1 : 0]
            .sort((a, b) => b.order - a.order)
            .map(({ name, count }) => {
              return (
                <tr key={name}>
                  <td>{getCleanName(name)}</td>
                  <td>{count}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Container>
  );
};

export default GameOver;
