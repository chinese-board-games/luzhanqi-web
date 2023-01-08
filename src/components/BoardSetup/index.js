/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Box, Container, Flex, Stack, Grid } from '@mantine/core';
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
import Position from './Position';
import { setupPieces } from '../../models/Piece';
import { mapBoard, copyBoard, getPieceLocationById } from '../../utils';

const emptyBoard = [];
for (let i = 0; i < 6; i++) {
  emptyBoard.push([null, null, null, null, null]);
}

export default function BoardSetup() {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [unplacedPieces, setUnplacedPieces] = useState([...setupPieces].slice(1, 3));
  const [halfboard, setHalfboard] = useState([...emptyBoard]);
  const [activeId, setActiveId] = useState(null);
  // TODO: refactor this to be more effecient
  const activePiece =
    activeId &&
    (setupPieces.find((piece) => piece.id === activeId) ||
      halfboard.flatMap((piece) => piece).find((piece) => piece.id === activeId));

  console.log('activePiece', activePiece);
  console.log('halfboard', halfboard);
  console.log('unplacedPieces', unplacedPieces);

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
      return;
    }
    // dragging from unplaced
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
        if (halfboard[row][col] == null) {
          console.log('unplace to board (unoccupied)');
          const newBoard = mapBoard(halfboard, (piece, r, c) => {
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
          const occupyingPiece = halfboard[row][col];
          const newBoard = mapBoard(halfboard, (piece, r, c) => {
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
        [activeRow, activeCol] = getPieceLocationById(halfboard, active.id);
      }
      console.log('dragging from board');
      // dragging from board to unplaced
      if (over.id === 'unplaced' || unplacedPieces.some((piece) => piece.id === over.id)) {
        console.log('dragging from board to unplaced');
        setUnplacedPieces([...unplacedPieces, halfboard[activeRow][activeCol]]);
        const newBoard = copyBoard(halfboard);
        newBoard[activeRow][activeCol] = null;
        setHalfboard(newBoard);
      } else {
        console.log('dragging from board to board');
        // dragging from board to board
        const { row: overRow, col: overCol } = over.data.current;
        if (activeRow == null || activeCol == null || overRow == null || overCol == null) {
          throw Error('Error, active or over row/col indexes returned null or undefined.');
        }

        console.log('halfboard', halfboard);
        const newboard = copyBoard(halfboard);
        console.log('newboard', newboard);
        console.log('halfboard[overRow][overCol]', halfboard[overRow][overCol]);
        console.log('overRow overCol', overRow, overCol);
        console.log('activeRow, activeCol', activeRow, activeCol);
        newboard[activeRow][activeCol] = halfboard[overRow][overCol];
        newboard[overRow][overCol] = halfboard[activeRow][activeCol];
        setHalfboard(newboard);
      }
    }
    setActiveId(null);
  };

  return (
    <Container>
      <DndContext
        autoScroll={false}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}>
        <Stack>
          <PieceSelector unplacedPieces={unplacedPieces} />
          <Box>Half Board</Box>
          <Grid bg="grape" columns={20}>
            {halfboard.flatMap((row, r) =>
              row.map((piece, c) => (
                <Grid.Col span={4}>
                  <Position piece={piece} row={r} col={c} activeId={activeId} />
                </Grid.Col>
              ))
            )}
          </Grid>
          <ResetZone />
        </Stack>
        <DragOverlay>
          {activeId ? (
            <DragablePiece name={activePiece.name} affiliation={0} data={activePiece.data} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Container>
  );
}

function PieceSelector({ unplacedPieces }) {
  const { setNodeRef } = useDroppable({
    id: 'unplaced'
  });
  return (
    <>
      <Box>Piece Selection</Box>
      <Box>
        <div
          ref={setNodeRef}
          style={{ backgroundColor: 'grey', minWidth: '100%', minHeight: '10em' }}>
          <SortableContext items={unplacedPieces}>
            <Flex justify="center" align="center" gap="1em" wrap="wrap">
              {unplacedPieces.map((piece) => (
                <SortablePiece name={piece.name} affiliation={0} id={piece.id} key={piece.id} />
              ))}
            </Flex>
          </SortableContext>
        </div>
      </Box>
    </>
  );
}

function ResetZone() {
  const { setNodeRef } = useDroppable({
    id: 'reset'
  });

  return (
    <Box ref={setNodeRef} style={{ backgroundColor: 'red', minWidth: '100%', minHeight: '5em' }}>
      Reset
    </Box>
  );
}
