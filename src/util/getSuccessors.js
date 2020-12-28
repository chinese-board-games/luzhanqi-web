export default function getSuccessors(board, x, y, affiliation) {
    // validate the board
    if (board.length != 12) {
        throw 'Invalid number of rows';
    }

    if (!board.every(row => row.length == 5)) {
        throw 'Invalid number of columns';
    }

    // validate from
    if (!isValidX(x)) {
        throw 'Invalid x';
    }

    if (!isValidY(y)) {
        throw 'Invalid y';
    }

    const piece = board[y][x];

    // get the piece type
    if (piece == null) {
        return [];
    }

    switch (piece.name) {
        case 'landmine':
        case 'flag': {
            return []
        }
        case 'engineer': {
            if (isRailroad(x, y)) {
                // perform dfs to find availible moves
                const moves = [];
                const stack = [[x, y]];
                const visited = new Set();
                const directions = [[-1, 0], [0, -1], [1, 0], [0, 1]];

                while (stack) {
                    [curX, curY] = stack.pop()

                    visited.add([curX, curY]);

                    if (isValidDestination(board, curX, curY, affiliation)) {
                        // don't add the first location
                        if (!(curX == x && curY == y)) {
                            moves.push([curX, curY])
                        }
                        directions.forEach((incX, incY) => {
                            const neighbor = [curX + incX, curY, incY]
                            if (!visited.has(neighbor)) {
                                stack.push(neighbor);
                            }
                        });
                    }
                }
                return moves;
            } 
            return notRailroadSuccessors(board, x, y)
        }
        default: {
            if (isRailroad(x, y)) {
                const directions = [[-1, 0], [0, -1], [1, 0], [0, 1]];
                const moves = directions.map(direction => {
                    const [incX, incY] = direction;

                    let curX = x + incX;
                    let curY = y + incY 
                    while (isValidDestination(board, curX, curY, affiliation)) {
                        moves.push([curX, curY])
                        curX += incX
                        curY += incY
                    }
                });
                return moves;
            }
            return notRailroadSuccessors(board, x, y, affiliation);
        }
    }
}

export const isValidX = x => x >= 0 && x < 5;

export const isValidY = y => y >= 0 && y < 12;

export const isRailroad = (x, y) => {
    if (!isValidX(x) || !isValidY(y)) {
        return false;
    }
    if (x == 0 || x == 4) {
        return y > 0 && y < 12;
    }
    return y == 1 || y == 5 || y == 6 || y == 10;
}

export const isValidDestination = (board, x, y, affiliation) => isValidX(x) && isValidY(y) && board[y][x].affiliation !== affiliation;

export const notRailroadSuccessors = (board, x, y , affiliation) => {
    const moves = [];
    for (const i = -1; i <= 1; i++) {
        for (const j = -1; j <= 1; j++) {
            if (i != 0 && j != 0 && isValidDestination(board, x + i, y + j), affiliation) {
                moves.push([x + i, y + j]);
            }
        }
    }
    return moves;
}

export const placePiece = (board, x, y, piece) => {
    if (!isValidX(x) || !isValidY(y)) {
        throw 'Invalid position passed';
    }
    return board.map((row, i) => row.map((cell, j) => i == x && j == y ? piece : cell));
}