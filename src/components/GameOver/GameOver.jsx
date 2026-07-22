import React, { useContext } from 'react';
import { GameContext } from 'contexts/GameContext';
import { Container, Table } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const GameOver = () => {
  const { t } = useTranslation('gameOver');
  const { t: tPieces } = useTranslation('pieces');
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
  const hostName = playerList[0] || t('host');
  const guestName = playerList[1] || t('guest');

  return (
    <Container style={{ backgroundColor: 'white', borderRadius: '0.5em', padding: '1em' }}>
      <h1>{t('gameOver')}</h1>
      {isSpectator ? (
        <h2>
          {t('winner')}
          {winner === 0 ? hostName : guestName}
        </h2>
      ) : winner === playerIndex ? (
        <h2>{t('youWin')}</h2>
      ) : (
        <h2>{t('youLost')}</h2>
      )}
      <h4>
        {isSpectator
          ? `${hostName} (${t('host')})`
          : host
            ? t('yourPieces')
            : `${hostName} (${t('host')})`}
      </h4>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('piece')}</Table.Th>
            <Table.Th>{t('count')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {remain[0]
            .sort((a, b) => b.order - a.order)
            .filter((c) => c.name != 'enemy')
            .map(({ name, count }) => {
              return (
                <Table.Tr key={name}>
                  <Table.Td>{tPieces(`${name}.title`)}</Table.Td>
                  <Table.Td>{count}</Table.Td>
                </Table.Tr>
              );
            })}
        </Table.Tbody>
      </Table>
      <br />
      <h4>
        {isSpectator
          ? `${guestName} (${t('guest')})`
          : host
            ? `${guestName} (${t('guest')})`
            : t('yourPieces')}
      </h4>
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('piece')}</Table.Th>
            <Table.Th>{t('count')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {remain[1]
            .sort((a, b) => b.order - a.order)
            .filter((c) => c.name != 'enemy')
            .map((obj) => {
              return (
                <Table.Tr key={obj.name}>
                  <Table.Td>{tPieces(`${obj.name}.title`)}</Table.Td>
                  <Table.Td>{obj.count}</Table.Td>
                </Table.Tr>
              );
            })}
        </Table.Tbody>
      </Table>
    </Container>
  );
};

export default GameOver;
