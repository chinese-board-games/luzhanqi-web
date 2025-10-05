import React, { useContext } from 'react';
import { GameContext } from 'contexts/GameContext';
import { Container, Table } from '@mantine/core';

const GameOver = () => {
  const gameState = useContext(GameContext);
  const {
    winner: { winner },
    playerName: { playerName },
    playerList: { playerList },
    spectatorName: { spectatorName },
    spectatorList: { spectatorList },
    gameResults: {
      gameResults: { remain },
    },
    host: { host },
  } = gameState;

  const playerIndex = playerList.indexOf(playerName);
  const isSpectator = spectatorList.includes(spectatorName);
  const hostName = playerList[0] || 'Host';
  const guestName = playerList[1] || 'Guest';

  const getCleanName = (name) => {
    return name
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Container style={{ backgroundColor: 'white', borderRadius: '0.5em', padding: '1em' }}>
      <h1>Game Over</h1>
      {isSpectator ? (
        <h2>Winner: {winner === 0 ? hostName : guestName}</h2>
      ) : winner === playerIndex ? (
        <h2>You win!</h2>
      ) : (
        <h2>You lost</h2>
      )}
      <h4>{isSpectator ? `${hostName} (Host)` : host ? 'Your pieces' : `${hostName} (Host)`}</h4>
      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Piece</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {remain[0]
            .sort((a, b) => b.order - a.order)
            .filter((c) => c.name != 'enemy')
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
      <h4>
        {isSpectator ? `${guestName} (Guest)` : host ? `${guestName} (Guest)` : 'Your pieces'}
      </h4>
      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Piece</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {remain[1]
            .sort((a, b) => b.order - a.order)
            .filter((c) => c.name != 'enemy')
            .map((obj) => {
              return (
                <tr key={obj.name}>
                  <td>{getCleanName(obj.name)}</td>
                  <td>{obj.count}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Container>
  );
};

export default GameOver;
