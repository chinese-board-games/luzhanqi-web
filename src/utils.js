/**
 * Checks whether a given space is a camp tile.
 *
 * @function
 * @param {number} r The row index of the target coordinate pair.
 * @param {number} c The column index of the target coordinate pair.
 * @see isCamp
 * @returns {boolean} Whether the tile is a camp.
 */
export const isCamp = (r, c) =>
  ((c === 1 || c === 3) && (r === 2 || r === 4 || r === 7 || r === 9)) ||
  (c === 2 && (r === 3 || r === 8));

/**
 * Maps through a board array and returns the result of the application of the
 * callback function to each piece. Equivalent to calling `map` on an array.
 *
 * @function
 * @param {Board} board The gameboard.
 * @param {utilCallback} callback The callback function to be applied to each piece.
 * @returns {Board} The result of applying the callback to each piece in the board.
 */
export const mapBoard = (board, callback) => {
  const newBoard = [];
  for (let i = 0; i < board.length; i++) {
    const row = [];
    for (let j = 0; j < board[i].length; j++) {
      row.push(callback(board[i][j], i, j));
    }
    newBoard.push(row);
  }
  return newBoard;
};

export const copyBoard = (board) => mapBoard(board, (p) => p);

/**
 * Iterates through a board array and applies a callback function to each
 * piece. Equivalent to calling `forEach` on an array.
 *
 * @function
 * @param {Board} board The gameboard.
 * @param {utilCallback} callback The callback function to be applied to each piece.
 * @see iterBoard
 */
export const iterBoard = (board, callback) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      callback(board[i][j], i, j);
    }
  }
};

export const getPieceLocationById = (board, id) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j]?.id === id) {
        return [i, j];
      }
    }
  }
  return null;
};
