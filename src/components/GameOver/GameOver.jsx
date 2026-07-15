import React, { useContext } from 'react';
import { GameContext } from 'contexts/GameContext';
import { Container, Table } from '@mantine/core';
import { pieces } from '../../models/Piece';

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
    isEnglish: { isEnglish },
  } = gameState;

  const playerIndex = playerList.indexOf(playerName);
  const isSpectator = spectatorList.includes(spectatorName);
  const hostName = playerList[0] || (isEnglish ? 'Host' : '主持人');
  const guestName = playerList[1] || (isEnglish ? 'Guest' : '客人');

  const getCleanName = (name) => {
    if (!isEnglish) {
      return pieces[name]?.display || name;
    }
    return name
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Container style={{ backgroundColor: 'white', borderRadius: '0.5em', padding: '1em' }}>
      <h1>{isEnglish ? 'Game Over' : '遊戲結束'}</h1>
      {isSpectator ? (
        <h2>
          {isEnglish ? 'Winner: ' : '獲勝者：'}
          {winner === 0 ? hostName : guestName}
        </h2>
      ) : winner === playerIndex ? (
        <h2>{isEnglish ? 'You win!' : '您獲勝了！'}</h2>
      ) : (
        <h2>{isEnglish ? 'You lost' : '您輸了'}</h2>
      )}
      <h4>
        {isSpectator
          ? `${hostName} (${isEnglish ? 'Host' : '主持人'})`
          : host
          ? isEnglish
            ? 'Your pieces'
            : '您的棋子'
          : `${hostName} (${isEnglish ? 'Host' : '主持人'})`}
      </h4>
      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>{isEnglish ? 'Piece' : '棋子'}</th>
            <th>{isEnglish ? 'Count' : '數量'}</th>
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
        {isSpectator
          ? `${guestName} (${isEnglish ? 'Guest' : '客人'})`
          : host
          ? `${guestName} (${isEnglish ? 'Guest' : '客人'})`
          : isEnglish
          ? 'Your pieces'
          : '您的棋子'}
      </h4>
      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>{isEnglish ? 'Piece' : '棋子'}</th>
            <th>{isEnglish ? 'Count' : '數量'}</th>
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
