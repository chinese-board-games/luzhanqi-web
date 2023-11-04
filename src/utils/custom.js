import { isHalfBoardCamp, isHalfBoardHQ } from './core';

export const isValidHalfBoardPlacement = (piece, row, col) => {
  // cannot place into camps
  if (isHalfBoardCamp(row, col)) {
    return false;
  }

  // flag can only go into hq
  if (piece.name === 'flag' && !isHalfBoardHQ(row, col)) {
    return false;
  }

  // bomb cannot go into first row
  if (piece.name === 'bomb' && row == 0) {
    return false;
  }

  // landmines can only go into last two rows
  if (piece.name === 'landmine' && row != 5 && row != 4) {
    return false;
  }

  return true;
};
