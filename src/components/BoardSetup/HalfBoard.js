/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Container, Flex, Stack, Grid, Center, Title, Group, Button } from '@mantine/core';
import {
  DragOverlay,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DndContext,
  useDroppable
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import SortablePiece from 'components/SortablePiece';
import DragablePiece from 'components/DragablePiece';
import LineTo from 'react-lineto';
import { useResizeDetector } from 'react-resize-detector';

import Position from '../Position';
import { setupPieces, pieces } from '../../models/Piece';
import {
  mapBoard,
  copyBoard,
  getPieceLocationById,
  halfBoardConnections,
  isHalfBoardRailroad,
  isValidHalfBoardPlacement
} from '../../utils/core';

const emptyBoard = [];
for (let i = 0; i < 6; i++) {
  emptyBoard.push([null, null, null, null, null]);
}

export default function HalfBoard({ sendStartingBoard, playerList, playerName }) {
  console.log(playerList);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // TODO: piece affiliation will be -1 if the players are not in game (playerList is [])
  const affiliatedPieces = setupPieces.map((piece) => ({
    ...piece,
    affiliation: playerList.indexOf(playerName)
  }));

  const [unplacedPieces, setUnplacedPieces] = useState(
    [...affiliatedPieces].sort((a, b) => a.order - b.order)
  );
  const [halfBoard, setHalfboard] = useState([...emptyBoard]);
  const [activeId, setActiveId] = useState(null);
  // TODO: refactor this to be more effecient
  const activePiece =
    activeId &&
    (setupPieces.find((piece) => piece.id === activeId) ||
      halfBoard.flatMap((piece) => piece).find((piece) => piece.id === activeId));

  console.log('activePiece', activePiece);
  console.log('halfBoard', halfBoard);
  console.log('unplacedPieces', unplacedPieces);

  const setExampleOne = () => {
    const example1 = [
      ['major_general', 'lieutenant', 'colonel', 'engineer', 'major_general'],
      ['engineer', 'none', 'field_marshall', 'none', 'engineer'],
      ['colonel', 'lieutenant', 'none', 'bomb', 'major'],
      ['brigadier_general', 'none', 'brigadier_general', 'none', 'lieutenant'],
      ['bomb', 'landmine', 'general', 'captain', 'captain'],
      ['landmine', 'flag', 'major', 'landmine', 'captain']
    ];

    const exampleBoard = [...emptyBoard];
    const placedPieces = new Map();

    example1.forEach((row, y) => {
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
          ...piece
        };
        placedPieces.set(pieceName, (placedPieces.get(pieceName) || 0) + 1);
      });
    });
    console.log('exampleBoard', exampleBoard);
    setUnplacedPieces([]);
    setHalfboard(exampleBoard);
  };

  const getActivePiece = (pieceId) =>
    unplacedPieces.find((p) => p.id === pieceId) ||
    halfBoard.flatMap((p) => p).find((p) => p && p.id === pieceId);

  const handleDragStart = (event) => {
    console.log('start event', event);
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  };

  const handleDragOver = (event) => {
    console.log('over event', event);
  };

  const handleDragEnd = (event) => {
    console.log('end event', event);
    const { active, over } = event;
    // handle dragging to no where or no selection
    if (!over || !over.id || !active || !active.id) {
      setActiveId(null);
      return;
    }

    // validate placement location
    if (over?.data?.current?.col != null && over?.data?.current?.row != null) {
      console.log('current over data fired');
      const { row, col } = over.data.current;
      const activePiece = getActivePiece(active.id);
      if (activePiece && !isValidHalfBoardPlacement(activePiece, row, col)) {
        setActiveId(null);
        return;
      }
    }

    // dragging from unplaced
    console.warn('unplacedPieces', unplacedPieces);
    if (unplacedPieces.some((piece) => piece.id === active.id)) {
      console.log('dragging from unplaced');
      // dragging from unplaced to unplaced
      if (unplacedPieces.some((piece) => piece.id === over.id) || over.id === 'unplaced') {
        console.log('dragging form unplaced to unplaced');
        if (active.id !== over.id) {
          const oldIndex = unplacedPieces.findIndex(({ id }) => id === active.id);
          const newIndex = unplacedPieces.findIndex(({ id }) => id === over.id);
          setUnplacedPieces(arrayMove(unplacedPieces, oldIndex, newIndex));
        }
      } else {
        // dragging from unplaced to board
        console.log('dragging from unplaced to board');
        // board position is empty
        const { row, col } = over.data.current;
        console.log('destructured r c', row, col);
        if (halfBoard[row][col] == null) {
          console.log('unplace to board (unoccupied)');
          const newBoard = mapBoard(halfBoard, (piece, r, c) => {
            if (r === row && c === col) {
              return unplacedPieces.find((p) => p.id === active.id);
            }
            return piece;
          });
          console.log('new board', newBoard);
          setHalfboard(newBoard);
          setUnplacedPieces(unplacedPieces.filter((piece) => piece.id !== active.id));
          // board position is occupied
        } else {
          console.log('unplaced to board (occupied)');
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
            occupyingPiece
          ]);
        }
      }
      // dragging from board
    } else {
      let { row: activeRow, col: activeCol } = active.data.current;
      if (activeRow == null || activeCol == null) {
        [activeRow, activeCol] = getPieceLocationById(halfBoard, active.id);
      }
      console.log('dragging from board');
      // dragging from board to unplaced
      if (over.id === 'unplaced' || unplacedPieces.some((piece) => piece.id === over.id)) {
        console.log('dragging from board to unplaced');
        setUnplacedPieces([...unplacedPieces, halfBoard[activeRow][activeCol]]);
        const newBoard = copyBoard(halfBoard);
        newBoard[activeRow][activeCol] = null;
        setHalfboard(newBoard);
      } else {
        console.log('dragging from board to board');
        // dragging from board to board
        const { row: overRow, col: overCol } = over.data.current;
        if (activeRow == null || activeCol == null || overRow == null || overCol == null) {
          throw Error('Error, active or over row/col indexes returned null or undefined.');
        }

        console.log('halfBoard', halfBoard);
        const newBoard = copyBoard(halfBoard);
        console.log('newBoard', newBoard);
        console.log('halfBoard[overRow][overCol]', halfBoard[overRow][overCol]);
        console.log('overRow overCol', overRow, overCol);
        console.log('activeRow, activeCol', activeRow, activeCol);
        newBoard[activeRow][activeCol] = halfBoard[overRow][overCol];
        newBoard[overRow][overCol] = halfBoard[activeRow][activeCol];
        setHalfboard(newBoard);
      }
    }
    setActiveId(null);
  };

  const { ref } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 10
  });

  return (
    <div ref={ref} style={{ background: '#e0e0e0' }}>
      <Container>
        <HalfBoardConnectionLines />
        <DndContext
          autoScroll={false}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}>
          <Stack>
            <Center>
              <Title>Board Setup</Title>
            </Center>
            <Center>
              <Group>
                <Button type="button" variant="secondary" onClick={setExampleOne}>
                  Set Example 1
                </Button>
                <Button type="button" variant="info" onClick={() => sendStartingBoard(halfBoard)}>
                  Send Board Placement
                </Button>
              </Group>
            </Center>
            <PieceSelector unplacedPieces={unplacedPieces} />
            <Grid columns={20}>
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
                    />
                  </Grid.Col>
                ))
              )}
            </Grid>
          </Stack>
          <DragOverlay>
            {activeId ? (
              <DragablePiece name={activePiece.name} affiliation={0} data={activePiece.data} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </Container>
    </div>
  );
}

function HalfBoardConnectionLines() {
  return (
    <>
      {halfBoardConnections.map(({ start, end }) => {
        const isRailroadConnection = !!(
          isHalfBoardRailroad(start[0], start[1]) && isHalfBoardRailroad(end[0], end[1])
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

function PieceSelector({ unplacedPieces }) {
  const { setNodeRef } = useDroppable({
    id: 'unplaced'
  });
  return (
    <>
      <Center
        bg="#e0e0e0"
        miw="100%"
        py="1em"
        h="14em"
        sx={{
          borderRadius: '2em',
          boxShadow: '15px 15px 30px #cecece, -15px -15px 30px #f2f2f2;'
        }}>
        <div ref={setNodeRef}>
          <SortableContext items={unplacedPieces}>
            <Flex justify="center" align="center" gap="1em" wrap="wrap">
              {unplacedPieces.map((piece) => (
                <SortablePiece name={piece.name} affiliation={0} id={piece.id} key={piece.id} />
              ))}
            </Flex>
          </SortableContext>
        </div>
      </Center>
    </>
  );
}
