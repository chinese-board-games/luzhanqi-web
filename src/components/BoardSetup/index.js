/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { GameContext } from 'contexts/GameContext';

import HalfBoard from './HalfBoard';

export default function BoardSetup() {
  const {
    playerList: { playerList },
    playerName: { playerName },
    roomId: { roomId },
    socket,
    submittedSide: { submittedSide }
  } = useContext(GameContext);

  const sendStartingBoard = (halfBoard) => {
    console.log('sendStartingBoard', halfBoard);
    socket.emit('playerInitialBoard', {
      playerName,
      myPositions: halfBoard,
      room: roomId
    });
  };

  return submittedSide ? (
    <>
      <h2>請等對手</h2>
      <h2>Waiting for other player</h2>
    </>
  ) : (
    <HalfBoard
      sendStartingBoard={sendStartingBoard}
      playerList={playerList}
      playerName={playerName}
    />
  );
}
