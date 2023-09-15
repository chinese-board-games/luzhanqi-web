import { useState, useEffect } from 'react';
import { Grid, Container, Center, Text, Stack, Title, Button, Group } from '@mantine/core';
import { emptyBoard } from 'src/utils';
import SelectablePosition from '../SelectablePosition';
import { isEqual } from 'lodash';
import PieceModel from 'src/models/Piece';
import FrontLines from './FrontLines';
import Mountain from './Mountain';
import ConnectionLines from './ConnectionLines';

const NO_SELECT = [-1, -1];
const board = emptyBoard();
board[1][0] = PieceModel('bomb', 0);
board[3][0] = PieceModel('enemy', 1);
import PropTypes from 'prop-types';

export default function GameBoard({
  isTurn,
  board,
  sendMove,
  forfeit,
  player = 'Player',
  opponent = 'Opponent',
  affiliation
}) {
  const mockMoves = [
    [2, 0],
    [1, 1],
    [2, 1],
    [3, 0]
  ];

  const availibleMoves = new Set(mockMoves.map((move) => JSON.stringify(move)));

  const [origin, setOrigin] = useState(NO_SELECT);
  const [destination, setDestination] = useState(NO_SELECT);

  const originSelected = !isEqual(origin, NO_SELECT);
  const destinationSelected = !isEqual(destination, NO_SELECT);
  const nothingSelected = !originSelected && !destinationSelected;

  const positionDisabled = (row, col) => {
    if (nothingSelected) {
      return board[row][col]?.affiliation !== affiliation;
    }
    if (destinationSelected) {
      return !isEqual(destination, [row, col]) && !isEqual(origin, [row, col]);
    }
    if (originSelected) {
      return !isEqual(origin, [row, col]) && !availibleMoves.has(JSON.stringify([row, col]));
    }
    return true;
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        if (destinationSelected) {
          setDestination(NO_SELECT);
        } else if (originSelected) {
          setOrigin(NO_SELECT);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }),
    [];

  const gridCells = board.flatMap((row, r) =>
    row.map((piece, c) => (
      <Grid.Col span={4} key={`${r}-${c}`}>
        <SelectablePosition
          piece={piece}
          row={r}
          col={c}
          selected={isEqual(origin, [r, c]) || isEqual(destination, [r, c])}
          originSelected={isEqual(origin, [r, c])}
          destinationSelected={isEqual(destination, [r, c])}
          attackable={
            board[r][c] &&
            board[r][c].affiliation != affiliation &&
            availibleMoves.has(JSON.stringify([r, c]))
          }
          movable={board[r][c] == null && availibleMoves.has(JSON.stringify([r, c]))}
          onClick={() => {
            if (isEqual(origin, [r, c])) {
              setOrigin(NO_SELECT);
              setDestination(NO_SELECT);
              return;
            }
            if (isEqual(destination, [r, c])) {
              setDestination(NO_SELECT);
              return;
            }
            if (originSelected) {
              setDestination([r, c]);
              return;
            }
            setOrigin([r, c]);
          }}
          disabled={positionDisabled(r, c)}
        />
      </Grid.Col>
    ))
  );

  const divider = [
    <FrontLines key="1" />,
    <Mountain rotation="-90deg" key="2" />,
    <FrontLines key="3" />,
    <Mountain rotation="90deg" key="4" />,
    <FrontLines key="5" />
  ].map((content, i) => (
    <Grid.Col key={`divider-${i}`} span={4}>
      <Center mih="5em">{content}</Center>
    </Grid.Col>
  ));

  const combined = [
    ...gridCells.slice(0, gridCells.length / 2),
    ...divider,
    ...gridCells.slice(gridCells.length / 2, gridCells.length)
  ];

  return (
    <Container>
      <Center>
        <Stack>
          <Stack align="center">
            <Title order={1}>
              {player} x {opponent}
            </Title>
          </Stack>
          <Group align="center" direction="horizontal">
            <Button
              disabled={isTurn && !(originSelected && destinationSelected)}
              onClick={sendMove}>
              {isTurn ? 'Send move' : 'Waiting for opponent'}
            </Button>
            <Button
              onClick={() => {
                setOrigin(NO_SELECT);
                setDestination(NO_SELECT);
              }}>
              Reset
            </Button>
            <Button onClick={forfeit}>Forfeit</Button>
          </Group>
        </Stack>
      </Center>
      <ConnectionLines />
      <Grid columns={20}>{combined.map((cell) => cell)}</Grid>
    </Container>
  );
}

GameBoard.propTypes = {
  isTurn: PropTypes.bool,
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
  sendMove: PropTypes.func,
  forfeit: PropTypes.func,
  player: PropTypes.string,
  opponent: PropTypes.string,
  affiliation: PropTypes.number
};
