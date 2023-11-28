import React, { useContext } from 'react';
import { useParams } from 'react-router';
import { GameContext } from 'contexts/GameContext';

import Lobby from 'components/Lobby';
import Menu from './Menu';
import BoardSetup from 'components/BoardSetup';
import GameOver from 'components/GameOver';
import GameBoard from 'components/GameBoard';
import { useFirebaseAuth } from 'contexts/FirebaseContext';
import { Container, Flex, Center, Button, CopyButton, Title } from '@mantine/core';

const Game = () => {
  let { roomId } = useParams();
  const uid = useFirebaseAuth()?.uid;
  const {
    socket,
    spectatorName: { spectatorName },
    spectatorList: { spectatorList },
    playerList: { playerList },
    playerName: { playerName },
    gamePhase: { gamePhase },
    host: { host },
    clientTurn: { clientTurn },
    errors: { setErrors },
    myBoard: { myBoard },
    myDeadPieces: { myDeadPieces },
    isEnglish: { isEnglish },
  } = useContext(GameContext);

  const affiliation = playerList.indexOf(playerName);

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
          target: host ? target : rotateMove(target),
        },
      });
    } else {
      setErrors((prevErrors) => [...prevErrors, 'You must have both a source and target tile']);
    }
  };

  const playerForfeit = (e) => {
    console.info('Game forfeitted!');
    e.preventDefault();
    socket.emit('playerForfeit', {
      playerName,
      uid,
      room: roomId,
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
      <Container style={{ minWidth: '23em', width: '90%' }}>
        {roomId ? (
          <Container>
            {/* if the playerList is empty, the user must have gotten here via a urlRoomId */}
            {playerList.length > 0 ? (
              <Container>
                <Title order={2}>Players:</Title>
                <Flex wrap="wrap">
                  {playerList.map((name, i) => (
                    <Center
                      key={name}
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0.2em',
                        padding: '0.2em',
                        border: `0.2em solid ${i ? 'darkgreen' : 'darkred'}`,
                        borderRadius: '0.5em',
                      }}
                    >
                      <h5 style={{ fontWeight: 'bold', margin: 0 }}>{name}</h5>
                    </Center>
                  ))}
                </Flex>
                {spectatorList.length ? <Title order={2}>Spectators:</Title> : null}
                <Flex wrap="wrap">
                  {spectatorList.map((name) => (
                    <Center
                      key={name}
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0.2em',
                        padding: '0.2em',
                        border: `0.2em solid darkblue`,
                        borderRadius: '0.5em',
                      }}
                    >
                      <h5 style={{ fontWeight: 'bold', margin: 0 }}>{name}</h5>
                    </Center>
                  ))}
                </Flex>
                <br />
                {gamePhase == 0 ? (
                  <CopyButton value={window.location.href}>
                    {({ copied, copy }) => (
                      <Button color={copied ? 'green' : 'blue'} onClick={copy}>
                        {copied ? 'Copied' : 'Copy URL'}
                      </Button>
                    )}
                  </CopyButton>
                ) : null}
              </Container>
            ) : null}
          </Container>
        ) : null}

        {playerList.length ? null : <Menu joinedRoom={true} urlRoomId={roomId} />}
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
          /** End of game */
          gamePhase === 3 ? <GameOver /> : null
        }
        <br />
        {
          /** Players play the game */
          gamePhase === 2 || gamePhase === 3 ? (
            <GameBoard
              host={host}
              isTurn={(host && clientTurn % 2 === 0) || (!host && clientTurn % 2 === 1)}
              board={host ? myBoard : transformBoard(myBoard)}
              deadPieces={myDeadPieces}
              sendMove={playerMakeMove}
              forfeit={playerForfeit}
              playerName={playerName}
              opponentName={playerList[1 - affiliation]}
              affiliation={affiliation}
              isEnglish={isEnglish}
              isSpectator={spectatorList.includes(spectatorName)}
              gamePhase={gamePhase}
            />
          ) : null
        }
      </Container>
    </>
  );
};

export default Game;
