/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from 'react';
import { GameContext } from 'contexts/GameContext';

import Lobby from 'components/Lobby';
import BoardSetup from 'components/BoardSetup';
import GameOver from 'components/GameOver';
import { ToastContainer, toast } from 'react-toastify';
import GameBoard from 'components/GameBoard';
import { useFirebaseAuth } from 'contexts/FirebaseContext';

const Game = () => {
  const uid = useFirebaseAuth()?.uid;
  const {
    socket,
    roomId: { roomId },
    playerList: { playerList },
    playerName: { playerName },
    gamePhase: { gamePhase },
    host: { host },
    clientTurn: { clientTurn },
    errors: { errors, setErrors },
    myBoard: { myBoard }
  } = useContext(GameContext);

  const affiliation = playerList.indexOf(playerName);

  /** Clear errors after 1 second each */
  useEffect(() => {
    errors.forEach((error) => {
      toast.error(error, {
        toastId: `${Date.now()}`
      });
    });
    setErrors([]);
  }, [JSON.stringify(errors), toast.error]);

  const playerMakeMove = (source, target) => {
    // console.log(source, target);
    if (source.length && target.length) {
      // if target is in successors, make move
      socket.emit('playerMakeMove', {
        playerName,
        uid,
        room: roomId,
        turn: clientTurn,
        pendingMove: { source, target }
      });
    } else {
      setErrors((prevErrors) => [...prevErrors, 'You must have both a source and target tile']);
    }
  };

  const playerForfeit = (e) => {
    console.log('Game forfeitted!');
    e.preventDefault();
    socket.emit('playerForfeit', {
      playerName,
      uid,
      room: roomId
    });
  };

  return (
    <>
      <div
        style={{
          margin: '2em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <div style={{ width: '35em' }}>
          {roomId ? (
            <div>
              <h1>{`Your game ID is: ${roomId}`}</h1>
              <h4>
                Give this ID to your opponent, who will use it to join the game under their own
                username
              </h4>
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
            gamePhase === 1 ? <BoardSetup /> : null
          }

          {
            /** Players play the game */
            gamePhase === 2 ? (
              <GameBoard
                isTurn={(host && clientTurn % 2 === 0) || (!host && clientTurn % 2 === 1)}
                board={myBoard}
                sendMove={playerMakeMove}
                forfeit={playerForfeit}
                playerName={playerName}
                opponentName={playerList[1 - affiliation]}
                affiliation={affiliation}
              />
            ) : null
          }

          {
            /** End of game */
            gamePhase === 3 ? <GameOver /> : null
          }

          {
            /** Indicate current turn */
            // clientTurn > -1 ? <h1>The turn is {clientTurn}</h1> : null
          }

          {
            /** Display an error */
            // error ? <Alert variant="danger">{error}</Alert> : null
          }
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Game;
