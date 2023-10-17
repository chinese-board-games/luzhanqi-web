// no longer in use, use BoardSetup.js instead

/* eslint-disable no-console */
import React, { useEffect, useContext } from 'react';
import { Button, Container, Select } from '@mantine/core';
import { GameContext } from 'contexts/GameContext';
import Piece from '../../models/Piece';
import { pieces } from '../../models/Piece/Piece';

const Setup = () => {
  const gameState = useContext(GameContext);
  const { socket } = gameState;
  const { playerName } = gameState.playerName;
  const { roomId } = gameState.roomId;
  const { playerList } = gameState.playerList;
  const { myPositions, setMyPositions } = gameState.myPositions;
  const { submittedSide } = gameState.submittedSide;
  const { startingBoard, setStartingBoard } = gameState.startingBoard;

  useEffect(() => {
    if (playerList.length > 0) {
      let newHalf = Array(6).fill(null);
      newHalf = newHalf.map(() => new Array(5).fill(null));
      Object.entries(startingBoard).forEach(([pos, name]) => {
        const yX = pos.split(',').map((num) => parseInt(num, 10));
        if (name !== 'none') {
          newHalf[parseInt(yX[0], 10)][parseInt(yX[1], 10)] = Piece(
            name,
            playerList.indexOf(playerName)
          );
        }
      });
      setMyPositions(newHalf);
    }
  }, [startingBoard, playerList, playerName, setMyPositions]);

  /** Send the starting board to the server (my side) */
  const sendStartingBoard = (e) => {
    e.preventDefault();
    console.log('sendStartingBoard', myPositions);
    socket.emit('playerInitialBoard', {
      playerName,
      myPositions,
      room: roomId
    });
  };

  const setExampleOne = () => {
    const example1 = [
      ['major_general', 'lieutenant', 'colonel', 'engineer', 'major_general'],
      ['engineer', 'none', 'field_marshall', 'none', 'engineer'],
      ['colonel', 'lieutenant', 'none', 'bomb', 'major'],
      ['brigadier_general', 'none', 'brigadier_general', 'none', 'lieutenant'],
      ['bomb', 'landmine', 'general', 'captain', 'captain'],
      ['landmine', 'flag', 'major', 'landmine', 'captain']
    ];

    const exampleBoard = {};
    example1.forEach((row, y) => {
      row.forEach((pieceName, x) => {
        const pos = [y, x];
        exampleBoard[pos] = pieceName;
      });
    });
    setStartingBoard(exampleBoard);
  };

  return submittedSide ? (
    <>
      <h2>請等對手</h2>
      <h2>Waiting for other player</h2>
    </>
  ) : (
    <>
      <h2>前線</h2>
      <form
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '25em'
        }}>
        {Object.keys(startingBoard).map((pos) => (
          <Container style={{ width: '5em' }} key={pos}>
            <Select
              as="select"
              size="sm"
              value={startingBoard[pos]}
              onChange={(e) => {
                setStartingBoard({
                  ...startingBoard,
                  [pos]: e.target.value
                });
              }}>
              {Object.keys(pieces)
                .sort((a, b) => pieces[b].order - pieces[a].order)
                .map((piece) => (
                  // eslint-disable-next-line react/no-unknown-property
                  <option key={piece} piece={piece}>
                    {piece}
                  </option>
                ))}
              <option>none</option>
            </Select>
          </Container>
        ))}
      </form>
      <Button type="button" variant="secondary" onClick={setExampleOne}>
        Set Example 1
      </Button>
      <Button type="button" variant="info" onClick={sendStartingBoard}>
        Send Board Placement
      </Button>
    </>
  );
};

export default Setup;
