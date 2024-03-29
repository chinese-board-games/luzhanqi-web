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

export const isHalfBoardCamp = (r, c) =>
  (r === 1 && c === 1) ||
  (r === 1 && c === 3) ||
  (r === 2 && c === 2) ||
  (r === 3 && c === 1) ||
  (r === 3 && c === 3);

const generateHalfBoardConnections = () => {
  const connections = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      connections.push({
        start: [r, c],
        end: [r, c + 1],
      });
    }
  }
  for (let c = 0; c < 5; c++) {
    for (let r = 0; r < 5; r++) {
      connections.push({
        start: [r, c],
        end: [r + 1, c],
      });
    }
  }
  const camps = [
    [1, 1],
    [1, 3],
    [3, 1],
    [3, 3],
  ];
  camps.forEach(([r, c]) => {
    connections.push({ start: [r, c], end: [r - 1, c - 1] });
    connections.push({ start: [r, c], end: [r - 1, c + 1] });
    connections.push({ start: [r, c], end: [r + 1, c - 1] });
    connections.push({ start: [r, c], end: [r + 1, c + 1] });
  });
  return connections;
};
export const halfBoardConnections = generateHalfBoardConnections();

const generateBoardConnections = () => {
  const connections = [];
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 4; c++) {
      connections.push({
        start: [r, c],
        end: [r, c + 1],
      });
    }
  }
  for (let c = 0; c < 5; c++) {
    for (let r = 0; r < 11; r++) {
      if (!(r == 5 && (c == 1 || c == 3))) {
        // no connection through mountains
        connections.push({
          start: [r, c],
          end: [r + 1, c],
        });
      }
    }
  }
  const camps = [
    [2, 1],
    [2, 3],
    [4, 1],
    [4, 3],
    [7, 1],
    [7, 3],
    [9, 1],
    [9, 3],
  ];
  camps.forEach(([r, c]) => {
    connections.push({ start: [r, c], end: [r - 1, c - 1] });
    connections.push({ start: [r, c], end: [r - 1, c + 1] });
    connections.push({ start: [r, c], end: [r + 1, c - 1] });
    connections.push({ start: [r, c], end: [r + 1, c + 1] });
  });
  return connections;
};
export const boardConnections = generateBoardConnections();

export const isHalfBoardHQ = (r, c) => r === 5 && (c === 1 || c === 3);

export const isHalfBoardRailroad = (r, c) => {
  if (r === 5) {
    return false;
  }
  return r === 0 || r === 4 || c === 0 || c === 4;
};

export const isRailroad = (r, c) => {
  if (c === 0 || c === 4) {
    return r >= 1 && r <= 10;
  }
  return r === 1 || r === 5 || r === 6 || r === 10;
};

export const emptyBoard = () => {
  const board = [];
  for (let i = 0; i < 12; i++) {
    board.push(Array(5).fill(null));
  }
  return board;
};

export const isHQ = (r, c) => (c == 1 || c == 3) && (r == 0 || r == 11);

/**
 * Checks validity of row index
 *
 * @function
 * @param r The row index of a coordinate pair.
 * @see isValidRow
 * @returns Whether the row index is within board bounds.
 */
export const isValidRow = (r) => r >= 0 && r < 12;
/**
 * Checks validity of column index
 *
 * @function
 * @param {number} c The column index of a coordinate pair.
 * @see isValidCol
 * @returns {boolean} Whether the column index is within board bounds.
 */
export const isValidCol = (c) => c >= 0 && c < 5;

export const isOccupied = (board, r, c) => {
  if (!isValidRow(r) || !isValidCol(c)) {
    return false;
  }
  return board[r][c] !== null;
};
