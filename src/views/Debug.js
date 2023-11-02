/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from 'react';
import { Button } from '@mantine/core';

import Lobby from 'components/Lobby';
import Setup from 'components/Setup';
import LZQ from 'components/LZQ';
import GameOver from 'components/GameOver';
import Piece from '../models/Piece';

import { GameContext } from '../contexts/GameContext';

const Game = () => {
  const gameState = useContext(GameContext);
  const { roomId } = gameState.roomId;
  const { setPlayerName } = gameState.playerName;
  const { clientTurn } = gameState.clientTurn;
  const { playerList, setPlayerList } = gameState.playerList;
  const { gamePhase, setGamePhase } = gameState.gamePhase;
  const { setMyBoard } = gameState.myBoard;
  const { errors, setErrors } = gameState.errors;

  /** Clear errors after 1 second each */
  useEffect(() => {
    setTimeout(() => {
      // remove oldest error from the stack
      setErrors((prev) => prev.slice(1));
    }, 1000);
  }, [errors, setErrors]);

  const showBoardDebug = () => {
    setGamePhase(2);
    setPlayerName('admin');
    setPlayerList(['admin']);

    const example1 = [
      ['major_general', 'lieutenant', 'colonel', 'engineer', 'major_general'],
      ['engineer', 'none', 'field_marshall', 'none', 'engineer'],
      ['colonel', 'lieutenant', 'none', 'bomb', 'major'],
      ['brigadier_general', 'none', 'brigadier_general', 'none', 'lieutenant'],
      ['bomb', 'landmine', 'general', 'captain', 'captain'],
      ['landmine', 'flag', 'major', 'landmine', 'captain'],
      ['major_general', 'lieutenant', 'colonel', 'engineer', 'major_general'],
      ['engineer', 'none', 'field_marshall', 'none', 'engineer'],
      ['colonel', 'lieutenant', 'none', 'bomb', 'major'],
      ['brigadier_general', 'none', 'brigadier_general', 'none', 'lieutenant'],
      ['bomb', 'landmine', 'general', 'captain', 'captain'],
      ['landmine', 'flag', 'major', 'landmine', 'captain'],
    ];

    const exampleBoard = {};
    example1.forEach((row, y) => {
      row.forEach((pieceName, x) => {
        const pos = [y, x];
        exampleBoard[pos] = pieceName;
      });
    });

    let newBoard = Array(12).fill(null);
    newBoard = newBoard.map(() => new Array(5).fill(null));
    Object.entries(exampleBoard).forEach(([pos, name]) => {
      const randBin = Math.round(Math.random());
      const yX = pos.split(',').map((num) => parseInt(num, 10));
      if (name !== 'none') {
        newBoard[parseInt(yX[0], 10)][parseInt(yX[1], 10)] = Piece(name, randBin);
      }
    });
    setMyBoard(newBoard);
  };

  return (
    <div
      style={{
        margin: '2em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <div style={{ width: '35em' }}>
        <Button onClick={showBoardDebug}>Show Board Debug</Button>
        {roomId ? (
          <div>
            <h1>{`Your game ID is: ${roomId}`}</h1>
            <h2>
              Give this ID to your opponent, who will use it to join the game under their own
              username
            </h2>
          </div>
        ) : null}

        {playerList.length > 0 ? <h2>Players</h2> : null}

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {playerList.map((name) => (
            <div
              key={name}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '0.5em',
                paddingBottom: '0.5em',
                paddingLeft: '0.5em',
                paddingRight: '0.5em',
                margin: '0.5em',
                border: '0.2em solid green',
                borderRadius: '0.5em',
              }}>
              <h5 style={{ fontWeight: 'bold', margin: 0 }}>{name}</h5>
            </div>
          ))}
        </div>
        <br />

        {
          /** Players join the game */
          gamePhase === 0 ? <Lobby /> : null
        }

        {
          /** Players set their boards */
          gamePhase === 1 ? <Setup /> : null
        }

        {
          /** Players play the game */
          gamePhase === 2 ? <LZQ /> : null
        }

        {
          /** End of game */
          gamePhase === 3 ? <GameOver /> : null
        }

        {
          /** Indicate current turn */
          clientTurn > -1 ? <h1>The turn is {clientTurn}</h1> : null
        }

        {
          /** Display an error */
          // error ? <Alert variant="danger">{error}</Alert> : null
        }
      </div>
    </div>
  );
};

export default Game;
