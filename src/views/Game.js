/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { GameContext } from 'contexts/GameContext';
import { ToastContainer, toast } from 'react-toastify';

import Lobby from 'components/Lobby';
import Menu from './Menu';
import BoardSetup from 'components/BoardSetup';
import GameOver from 'components/GameOver';
import GameBoard from 'components/GameBoard';
import { useFirebaseAuth } from 'contexts/FirebaseContext';
import { Container } from '@mantine/core';

const Game = () => {
  let { roomId } = useParams();
  console.log('roomId: ', roomId);
  const uid = useFirebaseAuth()?.uid;
  const {
    socket,
    // roomId,
    playerList: { playerList },
    playerName: { playerName },
    gamePhase: { gamePhase },
    host: { host },
    clientTurn: { clientTurn },
    errors: { errors, setErrors },
    myBoard: { myBoard },
    isEnglish: { isEnglish }
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

  const rotateMove = ([row, col]) => {
    return [11 - row, 4 - col];
  };

  const playerMakeMove = (source, target, host) => {
    if (source.length && target.length) {
      // if target is in successors, make move
      socket.emit('playerMakeMove', {
        playerName,
        uid,
        room: roomId,
        turn: clientTurn,
        pendingMove: {
          source: host ? source : rotateMove(source),
          target: host ? target : rotateMove(target)
        }
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

  /**
   * Rotates the board values 180 degrees
   * @param {Object} board a 2D array representing the game board
   * @returns {Object}
   * @see transformBoard
   */

  const transformBoard = (board) =>
    board.map((row, y) => row.map((_piece, x) => board[board.length - 1 - y][row.length - 1 - x]));

  return (
    <>
      <Container
        style={{
          padding: '2em',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#d0edf5'
        }}>
        <Container style={{ width: '100%' }}>
          {roomId ? (
            <Container>
              <h1>{`Your game ID is: ${roomId}`}</h1>
              {/* if the playerList is empty, the user must have gotten here via a urlRoomId */}
              {playerList.length > 0 ? (
                <h4>
                  Give this ID to your opponent, who will use it to join the game under their own
                  username
                </h4>
              ) : null}
              {playerList.length > 0 ? <h2>Players:</h2> : null}
            </Container>
          ) : null}
          {playerList.length ? null : <Menu joinedRoom={true} urlRoomId={roomId} />}
          <Container style={{ display: 'flex', flexDirection: 'row' }}>
            {playerList.map((name) => (
              <Container
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
              </Container>
            ))}
          </Container>
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
                host={host}
                isTurn={(host && clientTurn % 2 === 0) || (!host && clientTurn % 2 === 1)}
                board={host ? myBoard : transformBoard(myBoard)}
                sendMove={playerMakeMove}
                forfeit={playerForfeit}
                playerName={playerName}
                opponentName={playerList[1 - affiliation]}
                affiliation={affiliation}
                isEnglish={isEnglish}
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
        </Container>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Game;
