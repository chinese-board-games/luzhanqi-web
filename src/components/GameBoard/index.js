import { useState, useEffect } from 'react';
import { Grid, Container, Center, Stack, Title, Button, Group } from '@mantine/core';
import { emptyBoard } from 'src/utils/core';
import SelectablePosition from '../SelectablePosition';
import { isEqual } from 'lodash';
import FrontLines from './FrontLines';
import Mountain from './Mountain';
import ConnectionLines from './ConnectionLines';
import PropTypes from 'prop-types';
import { getSuccessors } from 'src/utils';

const NO_SELECT = [-1, -1];

export default function GameBoard({
  host,
  isTurn,
  board = emptyBoard(),
  sendMove,
  forfeit,
  player = 'Player',
  opponent = 'Opponent',
  affiliation,
  isEnglish = false
}) {
  const [origin, setOrigin] = useState(NO_SELECT);
  const [destination, setDestination] = useState(NO_SELECT);

  const originSelected = !isEqual(origin, NO_SELECT);
  const destinationSelected = !isEqual(destination, NO_SELECT);
  const nothingSelected = !originSelected && !destinationSelected;

  const moves = originSelected ? getSuccessors(board, origin[0], origin[1], affiliation) : [];
  const availibleMoves = new Set(moves.map((move) => JSON.stringify(move)));

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
            // disallow selection if not your turn
            if (!isTurn) return;

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
          isEnglish={isEnglish}
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
    <Container bg="rgb(224, 224, 224)" sx={{ borderRadius: '1em' }} p="1em 2em" maw="40em">
      <Center>
        <Stack>
          <Stack align="center">
            <Title order={1}>
              {player} x {opponent}
            </Title>
          </Stack>
          <Group align="center" direction="horizontal">
            <Button
              disabled={!isTurn || !(originSelected && destinationSelected)}
              onClick={() => {
                sendMove(origin, destination, host);
                setOrigin(NO_SELECT);
                setDestination(NO_SELECT);
              }}>
              {isTurn ? 'Send move' : 'Opponent turn'}
            </Button>
            <Button
              variant="outline"
              color="red"
              onClick={() => {
                setOrigin(NO_SELECT);
                setDestination(NO_SELECT);
              }}>
              Reset
            </Button>
            <Button variant="filled" color="red" onClick={forfeit}>
              Forfeit
            </Button>
          </Group>
        </Stack>
      </Center>
      <ConnectionLines />
      <Grid columns={20}>{combined.map((cell) => cell)}</Grid>
    </Container>
  );
}

GameBoard.propTypes = {
  host: PropTypes.bool,
  isTurn: PropTypes.bool,
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
  sendMove: PropTypes.func,
  forfeit: PropTypes.func,
  player: PropTypes.string,
  opponent: PropTypes.string,
  affiliation: PropTypes.number,
  isEnglish: PropTypes.bool
};
