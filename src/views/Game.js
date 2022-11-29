/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';

import Lobby from '../components/Lobby';
import Setup from '../components/Setup';
import LZQ from '../components/LZQ';

import { GameContext } from '../contexts/GameContext';

const Game = () => {
  const gameState = useContext(GameContext);
  const { roomId } = gameState.roomId;
  const { clientTurn } = gameState.clientTurn;
  const { playerList } = gameState.playerList;
  const { gamePhase } = gameState.gamePhase;
  const { error, setError } = gameState.error;

  /** Clear errors after 5 seconds */
  useEffect(() => {
    setTimeout(() => {
      setError('');
    }, 5000);
  }, [error, setError]);

  return (
    <div
      style={{
        margin: '2em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
      <div style={{ width: '35em' }}>
        <h1>陸戰棋 Luzhanqi</h1>
        {roomId ? <h1>{`Your game ID is: ${roomId}`}</h1> : null}

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
                borderRadius: '0.5em'
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
          /** Indicate current turn */
          // clientTurn > -1 ? <h1>The turn is {clientTurn}</h1> : null
        }

        {
          /** Display an error */
          error ? <Alert variant="danger">{error}</Alert> : null
        }
      </div>
    </div>
  );
};

export default Game;
