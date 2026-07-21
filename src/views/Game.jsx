import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { GameContext } from 'contexts/GameContext';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Lobby from 'components/Lobby';
import Menu from './Menu';
import BoardSetup from 'components/BoardSetup';
import GameOver from 'components/GameOver';
import GameBoard from 'components/GameBoard';
import HelpButton from 'components/HelpButton';
import { useFirebaseAuth } from 'contexts/FirebaseContext';
import { Container, Flex, Center, Title, Loader } from '@mantine/core';
import { applyMoveOptimistically } from 'utils/predictOutcome';

const Game = () => {
  const { t } = useTranslation('game');
  let { roomId } = useParams();
  const user = useFirebaseAuth();
  const {
    socket,
    spectatorName: { spectatorName },
    spectatorList: { spectatorList },
    playerList: { playerList },
    playerName: { playerName },
    gamePhase: { gamePhase },
    host: { host },
    clientTurn: { clientTurn },
    errors: { errors, setErrors },
    myBoard: { myBoard, setMyBoard },
    myDeadPieces: { myDeadPieces },
    lastMove: { lastMove, setLastMove },
    gameConfig: { gameConfig },
    joinedGame: { joinedGame },
    rejoining: { rejoining },
    disconnectedPlayer: { disconnectedPlayer },
    connected: { connected },
    attemptRejoin,
  } = useContext(GameContext);

  const affiliation = playerList.indexOf(playerName);

  /** true from the moment a move is sent until the server's response (a
   * turn change) or a rejection (an error) resolves it - blocks a second
   * move from being sent in the meantime, including across a disconnect,
   * where the fate of the first move isn't known until reconnection
   * resyncs state (see issue #109). */
  const [moveInFlight, setMoveInFlight] = useState(false);
  useEffect(() => {
    setMoveInFlight(false);
  }, [clientTurn]);

  /** On mount (or a hard reload), silently try to reclaim a seat using a
   * locally-stored session - or, on a device with none but a logged-in
   * user, ask the server to match a verified uid against the game's
   * players - before falling back to the normal join form. */
  useEffect(() => {
    if (roomId && !joinedGame && playerList.length === 0) {
      attemptRejoin(roomId, user);
    }
    // only re-run when the room in the URL changes, not on every state update
  }, [roomId]);

  /** Clear errors after 1 second each */
  useEffect(() => {
    if (errors.length) {
      // a rejected move is exactly the kind of error this list carries
      // during gameplay - unblock sending rather than leaving the player
      // stuck until some unrelated event happens to flip clientTurn
      setMoveInFlight(false);
    }
    errors.forEach((error) => {
      toast.error(error, {
        toastId: `${Date.now()}`,
      });
    });
    setErrors([]);
  }, [JSON.stringify(errors), toast.error]);

  const rotateMove = ([row, col]) => {
    return [11 - row, 4 - col];
  };

  // last move coordinates are always stored host-perspective; rotate for
  // display the same way the board itself is rotated for the guest
  const displayLastMove = lastMove
    ? {
        source: host ? lastMove.source : rotateMove(lastMove.source),
        target: host ? lastMove.target : rotateMove(lastMove.target),
        affiliation: lastMove.affiliation,
      }
    : null;

  const playerMakeMove = async (source, target, host) => {
    if (source.length && target.length) {
      const moveSource = host ? source : rotateMove(source);
      const moveTarget = host ? target : rotateMove(target);

      // optimistic update: apply the move locally immediately so the
      // player doesn't wait for the server round-trip to see it take
      // effect - GameContext's playerMadeMove handler overwrites this with
      // the authoritative board once the server responds, which also
      // corrects any guess this couldn't make (an attack on a fogged piece)
      setMyBoard((board) => applyMoveOptimistically(board, moveSource, moveTarget, gameConfig));
      setLastMove({ source: moveSource, target: moveTarget, affiliation });
      setMoveInFlight(true);

      socket.emit('playerMakeMove', {
        playerName,
        idToken: user ? await user.getIdToken() : null,
        room: roomId,
        turn: clientTurn,
        pendingMove: {
          source: moveSource,
          target: moveTarget,
        },
      });
    } else {
      setErrors((prevErrors) => [...prevErrors, t('sourceTargetRequired')]);
    }
  };

  const playerForfeit = (e) => {
    console.info('Game forfeitted!');
    e.preventDefault();
    // the server derives winnerId from the *other* player's already-
    // recorded uid, not from anything the forfeiting client sends
    socket.emit('playerForfeit', {
      playerName,
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
      <Container
        sx={{
          width: '90%',
          minWidth: '23em',
          // 23em (368px) forces horizontal overflow on phones narrower than
          // that - drop the minimum and use the full width instead
          '@media (max-width: 450px)': {
            width: '100%',
            minWidth: 'unset',
          },
        }}
      >
        {roomId ? (
          <Container>
            {/* if the playerList is empty, the user must have gotten here via a urlRoomId */}
            {playerList.length > 0 ? (
              <Container>
                <Title order={2}>{t('players')}</Title>
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
                <Title order={2}>{t('spectators')}</Title>
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
              </Container>
            ) : null}
          </Container>
        ) : null}

        {disconnectedPlayer ? (
          <Center>
            <Title order={4}>{t('disconnected', { name: disconnectedPlayer })}</Title>
          </Center>
        ) : null}

        {playerList.length ? null : rejoining ? (
          <Center style={{ padding: '2em' }}>
            <Loader />
          </Center>
        ) : (
          <Menu joinedRoom={true} urlRoomId={roomId} />
        )}
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
              isTurn={
                ((host && clientTurn % 2 === 0) || (!host && clientTurn % 2 === 1)) &&
                connected &&
                !moveInFlight
              }
              board={host ? myBoard : transformBoard(myBoard)}
              deadPieces={myDeadPieces}
              sendMove={playerMakeMove}
              forfeit={playerForfeit}
              playerName={playerName}
              opponentName={playerList[1 - affiliation]}
              affiliation={affiliation}
              gameConfig={gameConfig}
              isSpectator={spectatorList.includes(spectatorName)}
              gamePhase={gamePhase}
              lastMove={displayLastMove}
            />
          ) : null
        }
      </Container>
      <HelpButton gamePhase={gamePhase} />
      <ToastContainer />
    </>
  );
};

export default Game;
