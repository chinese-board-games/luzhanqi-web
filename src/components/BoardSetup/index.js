import React, { useState } from 'react';
import { Box, Container, Flex, Stack } from '@mantine/core';
import {
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DndContext
} from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import SortablePiece from 'components/SortablePiece';
import { setupPieces } from '../../models/Piece';

export default function BoardSetup() {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [unplacedPieces, setUnplacedPieces] = useState([...setupPieces]);
  const [placedPieces, setPlacedPieces] = useState([]);
  return (
    <Container>
      <Stack>
        <Box>Half Board</Box>
        <DndContext
          autoScroll={false}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (active.id !== over.id) {
              const oldIndex = unplacedPieces.findIndex(({ id }) => id === active.id);
              const newIndex = unplacedPieces.findIndex(({ id }) => id === over.id);
              setUnplacedPieces(arrayMove(unplacedPieces, oldIndex, newIndex));
            }
          }}>
          <SortableContext items={unplacedPieces} strategy={horizontalListSortingStrategy}>
            <Flex justify="center" align="center" gap="1em" wrap="wrap">
              {unplacedPieces.map((piece) => (
                <SortablePiece type={piece.name} affiliation={0} id={piece.id} key={piece.id} />
              ))}
            </Flex>
          </SortableContext>
        </DndContext>
        <Box>Piece Selection</Box>
      </Stack>
    </Container>
  );
}
