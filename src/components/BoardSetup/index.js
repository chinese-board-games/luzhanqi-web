/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Box, Container, Flex, Stack, Grid, Center } from '@mantine/core';
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
import Position from './Position';
import { setupPieces } from '../../models/Piece';
import { mapBoard, copyBoard, getPieceLocationById, halfBoardConnections } from '../../utils';

console.log('halfboardconnections', halfBoardConnections);
const emptyBoard = [];
for (let i = 0; i < 6; i++) {
  emptyBoard.push([null, null, null, null, null]);
}

export default function BoardSetup() {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [unplacedPieces, setUnplacedPieces] = useState(
    [...setupPieces].sort((a, b) => a.order - b.order)
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

  return (
    <Container>
      <DndContext
        autoScroll={false}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}>
        {halfBoardConnections.map(({ start, end }) => (
          <LineTo
            from={`${start[0]}-${start[1]}`}
            to={`${end[0]}-${end[1]}`}
            borderColor="black"
            borderWidth={3}
            toAnchor="center"
          />
        ))}
        <Stack>
          <PieceSelector unplacedPieces={unplacedPieces} />
          <Box>Half Board</Box>
          <Grid bg="grape" columns={20}>
            {halfBoard.flatMap((row, r) =>
              row.map((piece, c) => (
                // eslint-disable-next-line react/no-array-index-key
                <Grid.Col span={4} key={`${r}-${c}`}>
                  <Position piece={piece} row={r} col={c} activeId={activeId} />
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
  );
}

function PieceSelector({ unplacedPieces }) {
  const { setNodeRef } = useDroppable({
    id: 'unplaced'
  });
  return (
    <>
      <Box>Piece Selection</Box>
      <Center bg="grey" miw="100%" py="1em" mih="3.5em">
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
