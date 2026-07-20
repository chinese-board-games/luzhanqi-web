import React, { useState, useRef } from 'react';
import {
  Container,
  Flex,
  Stack,
  Grid,
  Center,
  Title,
  Group,
  Button,
  Box,
  Tooltip,
  Menu,
} from '@mantine/core';
import {
  DragOverlay,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DndContext,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import SortablePiece from 'components/SortablePiece';
import DraggablePiece from 'components/DraggablePiece';
import GameTooltip from 'components/GameTooltip';
import BoardConnectionLines from '../BoardConnectionLines';
import Position from '../Position';
import { setupPieces, pieces } from '../../models/Piece';
import { exampleBoards } from '../../data/exampleBoards';
import {
  mapBoard,
  copyBoard,
  getPieceLocationById,
  halfBoardConnections,
  isHalfBoardRailroad,
  isValidHalfBoardPlacement,
} from '../../utils';
import PropTypes from 'prop-types';

// returns a fresh 6x5 board every call - each row is a brand new array, so
// callers can safely mutate individual cells without corrupting a shared
// reference (a previous version returned the same row arrays every time,
// so filling in an example board via direct cell assignment permanently
// polluted every future "empty" board for the rest of the browser session)
const makeEmptyBoard = () => Array.from({ length: 6 }, () => [null, null, null, null, null]);

export default function HalfBoard({ sendStartingBoard, playerList, playerName, isEnglish }) {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const gridContainerRef = useRef(null);

  // TODO: piece affiliation will be -1 if the players are not in game (playerList is [])
  const affiliatedPieces = setupPieces.map((piece) => ({
    ...piece,
    affiliation: playerList.indexOf(playerName),
  }));

  const [unplacedPieces, setUnplacedPieces] = useState(
    [...affiliatedPieces].sort((a, b) => a.order - b.order)
  );
  const [halfBoard, setHalfboard] = useState(makeEmptyBoard());
  const [activeId, setActiveId] = useState(null);
  // TODO: refactor this to be more effecient
  const activePiece =
    activeId &&
    (setupPieces.find((piece) => piece.id === activeId) ||
      halfBoard.flatMap((piece) => piece).find((piece) => piece.id === activeId));

  const boardCompleted = unplacedPieces.length === 0;

  const setExample = (exampleBoardLayout) => {
    const exampleBoard = makeEmptyBoard();
    const placedPieces = new Map();

    exampleBoardLayout.forEach((row, y) => {
      row.forEach((pieceName, x) => {
        if (pieceName === 'none') {
          return;
        }
        const piece = pieces[pieceName];
        const piece_id = `${pieceName}-${placedPieces.get(pieceName) || 0}`;
        exampleBoard[y][x] = {
          name: pieceName,
          id: piece_id,
          affiliation: playerList.indexOf(playerName),
          ...piece,
        };
        placedPieces.set(pieceName, (placedPieces.get(pieceName) || 0) + 1);
      });
    });
    setUnplacedPieces([]);
    setHalfboard(exampleBoard);
  };

  const getActivePiece = (pieceId) =>
    unplacedPieces.find((p) => p.id === pieceId) ||
    halfBoard.flatMap((p) => p).find((p) => p && p.id === pieceId);

  const handleDragStart = (event) => {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  };

  const handleDragOver = () => {};

  const handleDragEnd = (event) => {
    const { active, over } = event;
    // handle dragging to no where or no selection
    if (!over || !over.id || !active || !active.id) {
      setActiveId(null);
      return;
    }

    // validate placement location
    if (over?.data?.current?.col != null && over?.data?.current?.row != null) {
      const { row, col } = over.data.current;
      const activePiece = getActivePiece(active.id);
      if (activePiece && !isValidHalfBoardPlacement(activePiece, row, col)) {
        setActiveId(null);
        return;
      }
    }

    if (unplacedPieces.some((piece) => piece.id === active.id)) {
      // dragging from unplaced to unplaced
      if (unplacedPieces.some((piece) => piece.id === over.id) || over.id === 'unplaced') {
        if (active.id !== over.id) {
          const oldIndex = unplacedPieces.findIndex(({ id }) => id === active.id);
          const newIndex = unplacedPieces.findIndex(({ id }) => id === over.id);
          setUnplacedPieces(arrayMove(unplacedPieces, oldIndex, newIndex));
        }
      } else {
        // board position is empty
        const { row, col } = over.data.current;
        if (halfBoard[row][col] == null) {
          const newBoard = mapBoard(halfBoard, (piece, r, c) => {
            if (r === row && c === col) {
              return unplacedPieces.find((p) => p.id === active.id);
            }
            return piece;
          });
          setHalfboard(newBoard);
          setUnplacedPieces(unplacedPieces.filter((piece) => piece.id !== active.id));
          // board position is occupied
        } else {
          const occupyingPiece = halfBoard[row][col];
          const newBoard = mapBoard(halfBoard, (piece, r, c) => {
            if (r === row && c === col) {
              return unplacedPieces.find((p) => p.id === active.id);
            }
            return piece;
          });
          setHalfboard(newBoard);
          setUnplacedPieces([
            ...unplacedPieces.filter((piece) => piece.id !== active.id),
            occupyingPiece,
          ]);
        }
      }
      // dragging from board
    } else {
      let { row: activeRow, col: activeCol } = active.data.current;
      if (activeRow == null || activeCol == null) {
        [activeRow, activeCol] = getPieceLocationById(halfBoard, active.id);
      }
      // dragging from board to unplaced
      if (over.id === 'unplaced' || unplacedPieces.some((piece) => piece.id === over.id)) {
        setUnplacedPieces([...unplacedPieces, halfBoard[activeRow][activeCol]]);
        const newBoard = copyBoard(halfBoard);
        newBoard[activeRow][activeCol] = null;
        setHalfboard(newBoard);
      } else {
        // dragging from board to board
        const { row: overRow, col: overCol } = over.data.current;
        if (activeRow == null || activeCol == null || overRow == null || overCol == null) {
          throw Error('Error, active or over row/col indexes returned null or undefined.');
        }
        const newBoard = copyBoard(halfBoard);
        newBoard[activeRow][activeCol] = halfBoard[overRow][overCol];
        newBoard[overRow][overCol] = halfBoard[activeRow][activeCol];
        setHalfboard(newBoard);
      }
    }
    setActiveId(null);
  };

  return (
    <Container
      bg="#e0e0e0"
      maw="46em"
      sx={{
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
      <DndContext
        autoScroll={false}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Stack>
          <Center>
            <Title>{isEnglish ? 'Board Setup' : '棋盤佈局'}</Title>
          </Center>
          <Center>
            <Group>
              <Menu shadow="md" width={160}>
                <Menu.Target>
                  <Button type="button" variant="secondary">
                    {isEnglish ? 'Use Example' : '使用範例佈局'} ▾
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {exampleBoards.map((example) => (
                    <Menu.Item key={example.name} onClick={() => setExample(example.board)}>
                      {isEnglish ? example.name : example.name_zh}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
              <Tooltip
                disabled={boardCompleted}
                label={isEnglish ? 'You still have unplaced pieces!' : '您還有棋子尚未放置！'}
              >
                <span>
                  <Button
                    disabled={!boardCompleted}
                    type="button"
                    variant="info"
                    onClick={() => sendStartingBoard(halfBoard)}
                  >
                    {isEnglish ? 'Send Board Placement' : '送出棋盤佈局'}
                  </Button>
                </span>
              </Tooltip>
              <Button
                type="button"
                color="red.6"
                onClick={() => {
                  setHalfboard(makeEmptyBoard());
                  setUnplacedPieces([...affiliatedPieces].sort((a, b) => a.order - b.order));
                }}
              >
                {isEnglish ? 'Reset Board' : '重設棋盤'}
              </Button>
            </Group>
          </Center>
          <Box sx={{ position: 'sticky', top: 0, zIndex: 110 }}>
            <PieceSelector unplacedPieces={unplacedPieces} isEnglish={isEnglish} />
          </Box>
          <Box ref={gridContainerRef} sx={{ position: 'relative' }}>
            <HalfBoardConnectionLines containerRef={gridContainerRef} />
            <Grid columns={20} gutter={6}>
              {halfBoard.flatMap((row, r) =>
                row.map((piece, c) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Grid.Col span={4} key={`${r}-${c}`}>
                    <Position
                      piece={piece}
                      row={r}
                      col={c}
                      activeId={activeId}
                      isHalfBoard={true}
                      isEnglish={isEnglish}
                    />
                  </Grid.Col>
                ))
              )}
            </Grid>
          </Box>
        </Stack>
        <DragOverlay>
          {activeId ? (
            <DraggablePiece
              name={activePiece.name}
              affiliation={0}
              data={activePiece.data}
              isEnglish={isEnglish}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Container>
  );
}

HalfBoard.propTypes = {
  sendStartingBoard: PropTypes.func.isRequired,
  playerList: PropTypes.array.isRequired,
  playerName: PropTypes.string.isRequired,
  isEnglish: PropTypes.bool.isRequired,
};

function HalfBoardConnectionLines({ containerRef }) {
  const connections = halfBoardConnections.map(({ start, end }) => ({
    start,
    end,
    isRailroad: !!(isHalfBoardRailroad(start[0], start[1]) && isHalfBoardRailroad(end[0], end[1])),
  }));
  return <BoardConnectionLines connections={connections} containerRef={containerRef} />;
}

HalfBoardConnectionLines.propTypes = {
  containerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

function PieceSelector({ unplacedPieces, isEnglish }) {
  const { setNodeRef } = useDroppable({
    id: 'unplaced',
  });
  return (
    <Center
      bg="linear-gradient(180deg, rgba(224,224,224,1) 0%, rgba(224,224,224,.5) 100%)"
      miw="100%"
      py="1em"
      mih="14em"
      sx={{ borderRadius: '1em' }}
    >
      <div ref={setNodeRef}>
        <SortableContext items={unplacedPieces}>
          <Flex justify="center" align="center" gap="1em" wrap="wrap">
            {unplacedPieces.map((piece) => (
              <GameTooltip
                key={piece.id}
                pieceName={piece.name}
                gamePhase={1}
                isEnglish={isEnglish}
                placement="top"
              >
                <SortablePiece
                  name={piece.name}
                  affiliation={0}
                  id={piece.id}
                  isEnglish={isEnglish}
                />
              </GameTooltip>
            ))}
          </Flex>
        </SortableContext>
      </div>
    </Center>
  );
}

PieceSelector.propTypes = {
  unplacedPieces: PropTypes.array.isRequired,
  isEnglish: PropTypes.bool.isRequired,
};
