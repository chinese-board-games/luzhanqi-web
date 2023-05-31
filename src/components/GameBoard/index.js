/* eslint-disable react/jsx-key */
import { useState, useEffect } from 'react';
import { Grid, Container, Center, Text, Stack } from '@mantine/core';
import { emptyBoard } from 'src/utils';
import SelectablePosition from '../SelectablePosition';
import LineTo from 'react-lineto';
import { isRailroad, boardConnections } from '../../utils';
import { isEqual } from 'lodash';

const NO_SELECT = [-1, -1];

export default function GameBoard() {
  const board = emptyBoard();
  const [origin, setOrigin] = useState(NO_SELECT);
  const [destination, setDestination] = useState(NO_SELECT);

  const originSelected = !isEqual(origin, NO_SELECT);
  const destinationSelected = !isEqual(destination, NO_SELECT);

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
          selectionColor={isEqual(origin, [r, c]) ? 'blue.1' : 'yellow.1'}
          selectionHoverColor={isEqual(origin, [r, c]) ? 'blue.2' : 'yellow.2'}
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
        />
      </Grid.Col>
    ))
  );

  const divider = [
    <FrontLines />,
    <Mountain rotation="-90deg" />,
    <FrontLines />,
    <Mountain rotation="90deg" />,
    <FrontLines />
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
      <ConnectionLines />
      <Grid columns={20}>{combined.map((cell) => cell)}</Grid>
    </Container>
  );
}

function ConnectionLines() {
  return (
    <>
      {boardConnections.map(({ start, end }) => {
        const isRailroadConnection = !!(
          isRailroad(start[0], start[1]) && isRailroad(end[0], end[1])
        );
        return (
          <LineTo
            key={`${start[0]}-${start[1]}-${end[0]}-${end[1]}`}
            from={`${start[0]}-${start[1]}`}
            to={`${end[0]}-${end[1]}`}
            borderColor={isRailroadConnection ? 'gray' : 'black'}
            borderWidth={isRailroadConnection ? 4 : 3}
            borderStyle={isRailroadConnection ? 'dashed' : 'solid'}
            toAnchor="center"
            delay={0}
          />
        );
      })}
    </>
  );
}

function FrontLines() {
  return (
    <Center
      sx={{
        border: '.1em solid gray',
        fontSize: '18pt',
        zIndex: 100
      }}
      bg="whitesmoke"
      w="4em"
      h="4em">
      <Stack sx={{ gap: '0' }}>
        <Text sx={{ rotate: '180deg' }}>前綫</Text>
        <Text>前綫</Text>
      </Stack>
    </Center>
  );
}

// eslint-disable-next-line react/prop-types
function Mountain({ rotation }) {
  return (
    <Center
      sx={{
        borderRadius: '100%',
        border: '.1em solid gray',
        writingMode: 'vertical-rl',
        fontSize: '18pt',
        zIndex: 100,
        rotate: rotation || '0deg'
      }}
      bg="whitesmoke"
      w="4em"
      h="4em">
      山界
    </Center>
  );
}
