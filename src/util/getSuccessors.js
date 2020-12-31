/* eslint-disable no-plusplus */
/* eslint-disable no-throw-literal */

/**
 * Checks validity of row index
 * @param {Number} x the x value (column) of a coordinate pair
 * @returns {boolean} whether the column index is within board bounds
 * @see isValidX
 */

export const isValidX = (x) => x >= 0 && x < 5;

/**
 * Checks validity of column index
 * @param {Number} y the y value (row) of a coordinate pair
 * @returns {boolean} whether the row index is within board bounds
 * @see isValidY
 */

export const isValidY = (y) => y >= 0 && y < 12;

/**
 * Checks validity of coordinate pair as piece destination
 * @param {Object} board the Board object as defined in the backend Schema
 * @param {Number} x the column of the target coordinate pair
 * @param {Number} y the row of the target coordinate pair
 * @param {Number} affiliation 0 for host, increments by 1 for additional players
 * @returns {boolean} whether the target destination is valid
 * @see isValidDestination
 */

export const isValidDestination = (board, x, y, affiliation) =>
  isValidX(x) && isValidY(y) && board[y][x].affiliation !== affiliation;

/**
 * Checks whether the space is a railroad tile
 * @param {Number} x the column of the target coordinate pair
 * @param {Number} y the row of the target coordinate pair
 * @returns {boolean} whether the space is a railroad tile
 */

export const isRailroad = (x, y) => {
  if (!isValidX(x) || !isValidY(y)) {
    return false;
  }
  if (x === 0 || x === 4) {
    return y > 0 && y < 12;
  }
  return y === 1 || y === 5 || y === 6 || y === 10;
};

/**
 * Gets a list of possible positions the piece at a given coordinate pair can travel to
 * @param {Object} board the Board object as defined in the backend Schema
 * @param {Number} x the column of the source coordinate pair
 * @param {Number} y the row of the source coordinate pair
 * @param {Array} adjList a list of lists representing the graph of duplex tile connections
 * @param {Number} affiliation 0 for host, increments by 1 for additional players
 * @returns {Array} list of positions that the piece may travel to during its turn
 * @see getSuccessors
 */

export default function getSuccessors(board, adjList, x, y, affiliation) {
  // validate the board
  if (board.length !== 12) {
    throw "Invalid number of rows";
  }

  if (!board.every((row) => row.length === 5)) {
    throw "Invalid number of columns";
  }

  // validate from
  if (!isValidX(x)) {
    throw "Invalid x";
  }

  if (!isValidY(y)) {
    throw "Invalid y";
  }

  const piece = board[y][x];

  // get the piece type
  if (piece == null || piece === "landmine" || piece === "flag") {
    return [];
  }

  const railroadMoves = new Set();
  if (piece === "engineer") {
    if (isRailroad(x, y)) {
      // perform dfs to find availible moves
      const stack = [[x, y]];
      const visited = new Set();
      const directions = [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1],
      ];

      while (stack) {
        let [curX, curY] = null;
        [curX, curY] = stack.pop();

        visited.add([curX, curY]);

        if (isValidDestination(board, curX, curY, affiliation)) {
          // don't add the first location
          if (!(curX === x && curY === y)) {
            railroadMoves.add(JSON.stringify([curX, curY]));
          }
          directions.forEach((incX, incY) => {
            const neighbor = [curX + incX, curY, incY];
            if (!visited.has(neighbor)) {
              stack.push(neighbor);
            }
          });
        }
      }
    } else if (isRailroad(x, y)) {
      const directions = [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1],
      ];
      directions.forEach((direction) => {
        const [incX, incY] = direction;

        let curX = x + incX;
        let curY = y + incY;
        while (isValidDestination(board, curX, curY, affiliation)) {
          railroadMoves.add(JSON.stringify([curX, curY]));
          curX += incX;
          curY += incY;
        }
      });
    }
  }
  const jsonMoves = new Set([
    ...railroadMoves,
    ...adjList.get(JSON.stringify([x, y])),
  ]);
  return [...jsonMoves].map((m) => JSON.parse(m));
}

/**
 * Checks whether a given space is a camp tile
 * @param {Number} x the column of the target coordinate pair
 * @param {Number} y the row of the target coordinate pair
 * @returns {boolean} whether the tile is a camp
 * @see isCamp
 
 */
export const isCamp = (x, y) =>
  ((x === 1 || x === 3) && (y === 2 || y === 4 || y === 7 || y === 9)) ||
  (x === 2 && (y === 3 || y === 8));

/**
 * Generates the adjacency graph for a two player Luzhanqi game
 * @returns {Array<Array>} list of lists indicating duplex tile connections
 * @see generateAdjList
 */
// note that the coordinates are stored in a JSON format
export const generateAdjList = () => {
  const adjList = new Map();
  for (let originY = 0; originY < 12; originY++) {
    for (let originX = 0; originX < 5; originX++) {
      const connections =
        adjList.get(JSON.stringify([originX, originY])) || new Set();

      // add up/down and left/right connections
      const directions = [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1],
      ];

      if (isCamp(originX, originY)) {
        // add diagonal connections
        directions.push(
          ...[
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ]
        );
      }

      directions.forEach(([incX, incY]) => {
        const destX = originX + incX;
        const destY = originY + incY;
        if (isValidX(destX) && isValidY(destY)) {
          connections.add(JSON.stringify([destX, destY]));
          // set reverse direction if center piece
          if (isCamp(originX, originY)) {
            if (!adjList.has(JSON.stringify([destX, destY]))) {
              adjList.set(JSON.stringify([destX, destY]), new Set());
            }
            adjList
              .get(JSON.stringify([destX, destY]))
              .add(JSON.stringify([originX, originY]));
          }
        }
      });

      adjList.set(JSON.stringify([originX, originY]), connections);
    }
  }

  // console.log(Object.fromEntries(adjList));
  return adjList;
};

/**
 *
 * @param {Object} board the Board object as defined in the backend Schema
 * @param {Number} x the column of the target coordinate pair
 * @param {Number} y the row of the target coordinate pair
 * @param {*} piece a Piece object as defined in Piece.js
 */
export const placePiece = (board, x, y, piece) => {
  if (!isValidX(x) || !isValidY(y)) {
    throw "Invalid position passed";
  }
  return board.map((row, i) =>
    row.map((cell, j) => (i === x && j === y ? piece : cell))
  );
};
