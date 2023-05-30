/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { GameContext } from 'contexts/GameContext';

import HalfBoard from './HalfBoard';

const emptyBoard = [];
for (let i = 0; i < 6; i++) {
  emptyBoard.push([null, null, null, null, null]);
}

export default function BoardSetup() {
  const {
    submittedSide: { submittedSide }
  } = useContext(GameContext);

  return submittedSide ? (
    <>
      <h2>請等對手</h2>
      <h2>Waiting for other player</h2>
    </>
  ) : (
    <HalfBoard />
  );
}
