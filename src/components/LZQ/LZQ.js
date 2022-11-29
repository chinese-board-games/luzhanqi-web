/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { isEqual } from 'lodash';
import Button from 'react-bootstrap/Button';
import { GameContext } from '../../contexts/GameContext';
import BoardBackground from './BoardBackground';
import MountainPass from './MountainPass';

const LZQ = () => {
  const gameState = useContext(GameContext);
  const { socket } = gameState;
  const { playerName } = gameState.playerName;
  const { roomId } = gameState.roomId;
  const { host } = gameState.host;
  const { clientTurn } = gameState.clientTurn;
  const { playerList } = gameState.playerList;
  const { myBoard } = gameState.myBoard;
  const { pendingMove, setPendingMove } = gameState.pendingMove;
  const { setError } = gameState.error;

  const { successors, setSuccessors } = gameState.successors;

  // const adjList = useMemo(() => generateAdjList(), []);

  useEffect(() => {
    const { source, target } = pendingMove;
    if (source && source.length === 2) {
      socket.emit('pieceSelection', {
        board: myBoard,
        piece: source,
        playerName,
        room: roomId
      });
    }

    if (!(source && source.length === 2 && target && target.length === 2)) {
      setSuccessors([]);
    }
  }, [roomId, setSuccessors, socket, pendingMove, myBoard, playerList, playerName]);

  /**
   * Send a move to the server
   * @param {Object} e the event on the element from which this callback was called
   * @see makeMove
   */
  const makeMove = (e) => {
    e.preventDefault();
    const { source, target } = pendingMove;
    console.log(source, target);
    if (source.length && target.length) {
      // if target is in successors, make move
      if (successors.some((successor) => isEqual(successor, target))) {
        socket.emit('makeMove', {
          playerName,
          room: roomId,
          turn: clientTurn,
          pendingMove
        });
      } else {
        setError('Invalid move');
      }
      setPendingMove({ source: [], target: [] });
    } else {
      setError('You must have both a source and target tile');
    }
  };

  /**
   * Takes a set of coordinates and sets the corresponding tile as either source or target
   * @param {Number} y
   * @param {Number} x
   * @see setMove
   */

  const setMove = (y, x) => {
    y = host ? y : 11 - y;
    x = host ? x : 4 - x;

    if (pendingMove.source.length > 0) {
      const sourcePiece = myBoard[pendingMove.source[0]][pendingMove.source[1]];
      if (isEqual(pendingMove.source, [y, x])) {
        setPendingMove({
          source: [],
          target: []
        });
      } else if (myBoard[y][x] && myBoard[y][x].affiliation === sourcePiece.affiliation) {
        setPendingMove({ source: [y, x], target: [] });
      } else {
        setPendingMove((prevState) => ({ ...prevState, target: [y, x] }));
      }
    } else if (
      myBoard[y][x] !== null &&
      myBoard[y][x].affiliation === playerList.indexOf(playerName)
    ) {
      setPendingMove({ source: [y, x], target: [] });
    }
  };

  /**
   * Rotates the board values 180 degrees
   * @param {Object} board a 2D array representing the game board
   * @returns {Object}
   * @see transformBoard
   */

  const transformBoard = (board) =>
    board.map((row, y) => row.map((piece, x) => board[board.length - 1 - y][row.length - 1 - x]));

  /**
   * Takes a pair of coordinates and returns the style for the corresponding tile
   * @param {Number} y row of a tile
   * @param {Number} x column of a tile
   */

  const getHighlightStyle = (y, x) => {
    y = host ? y : 11 - y;
    x = host ? x : 4 - x;
    const { source, target } = pendingMove;
    if (y === source[0] && x === source[1]) {
      return {
        transform: 'scale(1.2)',
        filter: 'drop-shadow(0 0 1em black)'
      };
    }
    if (y === target[0] && x === target[1]) {
      return { filter: 'drop-shadow(0 0 0.3em brown)' };
    }
    if (successors.some((successor) => successor[0] === y && successor[1] === x)) {
      return {
        outline: '3px dashed orange',
        outlineOffset: '-3px'
      };
    }
    return {};
  };

  /**
   * Displays the pieces in myBoard
   * @see displayPieces
   */

  const displayPieces = () => {
    const displayedPieces = host ? myBoard : transformBoard(myBoard);

    const firstHalf = displayedPieces.slice(0, 6).map((row, y) => (
      <div
        key={`game_row_${y + 1}`}
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          zIndex: 0
        }}>
        {row.map((piece, x) => (
          <div
            key={`game_piece_${[y + 1, x + 1]}`}
            role="button"
            onClick={() => setMove(y, x)}
            onKeyDown={() => {}}
            tabIndex={0}
            style={{ margin: '1em' }}>
            {piece === null ? (
              <img
                style={getHighlightStyle(y, x)}
                key={`game_blank_${[y + 1, x + 1]}`}
                src="pieces/blank.svg"
                alt="blank"
              />
            ) : (
              <img
                style={getHighlightStyle(y, x)}
                key={`game_piece_image_${[y + 1, x + 1]}`}
                src={
                  playerList.indexOf(playerName) === piece.affiliation
                    ? `pieces/${piece.name}.svg`
                    : `pieces/enemy/${piece.name}_enemy.svg`
                }
                alt={piece.name}
              />
            )}
          </div>
        ))}
      </div>
    ));

    const secondHalf = displayedPieces.slice(6).map((row, y) => (
      <div
        key={`game_row_${y + 7}`}
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          zIndex: 0
        }}>
        {row.map((piece, x) => (
          <div
            key={`game_piece_${[y + 7, x + 1]}`}
            role="button"
            onClick={() => setMove(y + 6, x)}
            onKeyDown={() => {}}
            tabIndex={0}
            style={{ margin: '1em' }}>
            {piece === null ? (
              <img
                style={getHighlightStyle(y + 6, x)}
                key={`game_blank_${[y + 7, x + 1]}`}
                src="pieces/blank.svg"
                alt="blank"
              />
            ) : (
              <img
                style={getHighlightStyle(y + 6, x)}
                key={`game_piece_image_${[y + 7, x + 1]}`}
                src={
                  playerList.indexOf(playerName) === piece.affiliation
                    ? `pieces/${piece.name}.svg`
                    : `pieces/enemy/${piece.name}_enemy.svg`
                }
                alt={piece.name}
              />
            )}
          </div>
        ))}
      </div>
    ));

    return (
      <>
        {firstHalf}
        {MountainPass()}
        {secondHalf}
      </>
    );
  };
  return (
    <>
      <BoardBackground />
      <div
        style={{
          backgroundColor: '#4F7276',
          display: 'inline-flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1em'
        }}>
        {displayPieces()}
      </div>
      {/* <h3>
        Source: {host ? pendingMove.source[0] : 11 - pendingMove.source[0]}
        {host ? pendingMove.source[1] : 4 - pendingMove.source[1]}
      </h3>
      <h3>
        Target: {host ? pendingMove.target[0] : 11 - pendingMove.target[0]}
        {host ? pendingMove.target[1] : 4 - pendingMove.target[1]}
      </h3> */}

      {(host && clientTurn % 2 === 0) || (!host && clientTurn % 2 === 1) ? (
        <Button type="button" variant="primary" onClick={makeMove}>
          Make move
        </Button>
      ) : (
        <Button type="button" variant="secondary" onClick={makeMove}>
          Make move
        </Button>
      )}
    </>
  );
};

export default LZQ;
