import { useState, useEffect, useRef } from 'react';
import { Box, Grid, Container, Center, Button, Flex, Popover } from '@mantine/core';
import { emptyBoard } from 'utils/core';
import SelectablePosition from '../SelectablePosition';
import PieceInfoPanel from '../PieceInfoPanel';
import MoveConfirmCard from '../MoveConfirmCard';
import { isEqual } from 'lodash';
import FrontLines from './FrontLines';
import Mountain from './Mountain';
import ConnectionLines from './ConnectionLines';
import LastMoveArrow from './LastMoveArrow';
import DeadPieces from './DeadPieces';
import PropTypes from 'prop-types';
import { getSuccessors } from 'utils';
import useWindowSize from 'hooks/useWindowSize';

const NO_SELECT = [-1, -1];
// the info panel needs real estate beside the board - below this width
// there's no room for it, and it's a hover-driven feature that doesn't
// translate to touch devices anyway
const DESKTOP_PANEL_BREAKPOINT = 900;

export default function GameBoard({
  host,
  isTurn,
  board = emptyBoard(),
  deadPieces = [],
  sendMove,
  forfeit,
  affiliation,
  isEnglish = false,
  gameConfig = {},
  isSpectator = false,
  gamePhase = 2,
  lastMove = null,
}) {
  const [origin, setOrigin] = useState(NO_SELECT);
  const [destination, setDestination] = useState(NO_SELECT);
  const [hoveredPiece, setHoveredPiece] = useState(null);
  const [width] = useWindowSize();
  const showInfoPanel = width >= DESKTOP_PANEL_BREAKPOINT;
  const gridContainerRef = useRef(null);

  const originSelected = !isEqual(origin, NO_SELECT);
  const destinationSelected = !isEqual(destination, NO_SELECT);
  const nothingSelected = !originSelected && !destinationSelected;

  const originPiece = originSelected ? board[origin[0]][origin[1]] : null;
  const destinationPiece = destinationSelected ? board[destination[0]][destination[1]] : null;

  const moves = originSelected
    ? getSuccessors(board, origin[0], origin[1], affiliation, {
        flyingBombs: gameConfig.flyingBombs,
      })
    : [];
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
    row.map((piece, c) => {
      const isDestinationCell = isEqual(destination, [r, c]);

      const cell = (
        <SelectablePosition
          piece={piece}
          row={r}
          col={c}
          selected={isEqual(origin, [r, c]) || isDestinationCell}
          originSelected={isEqual(origin, [r, c])}
          destinationSelected={isDestinationCell}
          attackable={
            board[r][c] &&
            board[r][c].affiliation != affiliation &&
            availibleMoves.has(JSON.stringify([r, c]))
          }
          movable={board[r][c] == null && availibleMoves.has(JSON.stringify([r, c]))}
          isLastMove={
            !!lastMove && (isEqual(lastMove.source, [r, c]) || isEqual(lastMove.target, [r, c]))
          }
          onClick={() => {
            // disallow selection if not your turn
            if (!isTurn) return;

            if (isEqual(origin, [r, c])) {
              setOrigin(NO_SELECT);
              setDestination(NO_SELECT);
              return;
            }
            if (isDestinationCell) {
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
          onHoverPiece={setHoveredPiece}
        />
      );

      return (
        <Grid.Col span={4} key={`${r}-${c}`}>
          {isDestinationCell ? (
            <Popover
              opened
              withinPortal
              position="bottom"
              withArrow
              shadow="md"
              radius="md"
              trapFocus
              closeOnClickOutside={false}
            >
              <Popover.Target>{cell}</Popover.Target>
              <Popover.Dropdown>
                <MoveConfirmCard
                  originPiece={originPiece}
                  destinationPiece={destinationPiece}
                  gameConfig={gameConfig}
                  isEnglish={isEnglish}
                  onConfirm={() => {
                    sendMove(origin, destination, host);
                    setOrigin(NO_SELECT);
                    setDestination(NO_SELECT);
                  }}
                  onCancel={() => setDestination(NO_SELECT)}
                />
              </Popover.Dropdown>
            </Popover>
          ) : (
            cell
          )}
        </Grid.Col>
      );
    })
  );

  const divider = [
    <FrontLines key="1" isEnglish={isEnglish} />,
    <Mountain rotation="-90deg" key="2" isEnglish={isEnglish} />,
    <FrontLines key="3" isEnglish={isEnglish} />,
    <Mountain rotation="90deg" key="4" isEnglish={isEnglish} />,
    <FrontLines key="5" isEnglish={isEnglish} />,
  ].map((content, i) => (
    <Grid.Col key={`divider-${i}`} span={4}>
      <Center mih="5em">{content}</Center>
    </Grid.Col>
  ));

  const combined = [
    ...gridCells.slice(0, gridCells.length / 2),
    ...divider,
    ...gridCells.slice(gridCells.length / 2, gridCells.length),
  ];

  return (
    <>
      <Flex gap="1em" justify="center" wrap="wrap" align="flex-start">
        <Container
          bg="rgb(224, 224, 224)"
          maw="40em"
          sx={{
            borderRadius: '1em',
            padding: '1em 2em',
            overflowX: 'auto',
            '@media (max-width: 450px)': {
              padding: '1em 0.5em',
            },
            '@media (max-width: 375px)': {
              padding: '0.75em 0.25em',
            },
          }}
        >
          {isSpectator || gamePhase > 2 ? null : (
            <Center py="1em">
              <Button variant="filled" color="red" onClick={forfeit}>
                {isEnglish ? 'Forfeit' : '投降'}
              </Button>
            </Center>
          )}

          <Box ref={gridContainerRef} sx={{ position: 'relative' }}>
            <ConnectionLines containerRef={gridContainerRef} />
            <LastMoveArrow
              lastMove={lastMove}
              containerRef={gridContainerRef}
              viewerAffiliation={affiliation}
            />
            <Grid columns={20} gutter={6}>
              {combined.map((cell) => cell)}
            </Grid>
          </Box>
        </Container>
        {showInfoPanel ? (
          <PieceInfoPanel
            hoveredPiece={hoveredPiece}
            originPiece={originPiece}
            destinationPiece={destinationPiece}
            isEnglish={isEnglish}
            gameConfig={gameConfig}
          />
        ) : null}
      </Flex>
      <DeadPieces deadPieces={deadPieces} isEnglish={isEnglish} />
    </>
  );
}

GameBoard.propTypes = {
  host: PropTypes.bool,
  isTurn: PropTypes.bool,
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
  deadPieces: PropTypes.arrayOf(PropTypes.object),
  sendMove: PropTypes.func,
  forfeit: PropTypes.func,
  player: PropTypes.string,
  opponent: PropTypes.string,
  affiliation: PropTypes.number,
  isEnglish: PropTypes.bool,
  gameConfig: PropTypes.object,
  isSpectator: PropTypes.bool,
  gamePhase: PropTypes.number,
  lastMove: PropTypes.shape({
    source: PropTypes.arrayOf(PropTypes.number),
    target: PropTypes.arrayOf(PropTypes.number),
  }),
};
