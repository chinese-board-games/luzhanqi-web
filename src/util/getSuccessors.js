function getSuccessors(board, x, y, affiliation) {
    // validate the board
    if (board.length != 13) {
        throw 'Invalid number of rows';
    }

    if (!board.every(row => row.length == 5)) {
        throw 'Invalid number of columns';
    }

    // validate from
    if (!validX(x)) {
        throw 'Invalid x';
    }

    if (!validY(y)) {
        throw 'Invalid y';
    }

    if (isMountainRange(x, y)) {
        throw 'Invalid "from" coordinates';
    }

    const piece = board[y][x];

    // get the piece type
    if (piece == null) {
        return [];
    }

    const isValidDestination = (x, y) => validX(x) && validY(y) && board[y][x].affiliation !== affiliation;

    switch (piece.name) {
        case 'landmine':
        case 'flag': {
            return []
        }
        case 'engineer': {
            // if (isRailroad(x, y)) {
                
            // } else {

            // }
            return [];
        }
        default: {
            const moves = []
            if (isRailroad(x, y)) {
                const directions = [[-1, 0], [0, -1], [1, 0], [0, 1]];
                const moves = directions.map(direction => {
                    const [incX, incY] = direction;

                    let curX = x + incX;
                    let curY = y + incY 
                    while (isValidDestination(curX, curY)) {
                        moves.push([curX, curY])
                        curX += incX
                        curY += incY
                    }
                });
                

                return moves
            } else {
                for (const i = -1; i <= 1; i++) {
                    for (const j = -1; j <= 1; j++) {
                        if (i != 0 && j != 0 && isValidDestination(x + i, y + j)) {
                            moves.push([x + i, y + j]);
                        }
                    }
                }
            }
        }
    }
}

const isMountainPass = (x, y) => y == 6 && (x == 1 || x == 3);

const validY = x => x >= 0 && x < 5;

const validX = y => y >= 0 && y < 13;

const isRailroad = (x, y) => {
    if (x == 0 || x == 4) {
        return y > 0 && y < 12;
    }
    return y == 1 || y == 5 || y == 7 || y == 11;
}
