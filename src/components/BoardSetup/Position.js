/* eslint-disable react/prop-types */
import React from 'react';
import DragablePiece from 'components/DragablePiece';
import { Center, Stack } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core';
import { isHalfBoardCamp, isHalfBoardHQ } from '../../utils';

export default function Position({ row, col, piece, activeId }) {
  const getPieceContent = () => {
    if (piece && piece.name && activeId !== piece.id) {
      return (
        <DragablePiece
          name={piece.name}
          affiliation={0}
          id={piece.id}
          key={piece.id}
          data={{ row, col }}
        />
      );
    }
    if (isHalfBoardCamp(row, col)) {
      return (
        <Center
          sx={{
            borderRadius: '100%',
            border: '.1em solid black',
            writingMode: 'vertical-rl',
            fontSize: '16pt',
            zIndex: 100
          }}
          bg="pastel-tan.1"
          w="3.5em"
          h="3.5em">
          行營
        </Center>
      );
    }

    if (isHalfBoardHQ(row, col)) {
      return (
        <Center
          px="1.5em"
          py="0em"
          sx={{
            border: '.1em solid black',
            fontSize: '16pt',
            zIndex: 100,
            borderRadius: '3em 3em 1em 1em'
          }}
          bg="pastel-tan.1">
          <Stack spacing="0em" align="stretch" justify="center">
            <Center sx={{ lineHeight: '1.1' }}>大</Center>
            <Center sx={{ lineHeight: '1.1' }}>本營</Center>
          </Stack>
        </Center>
      );
    }
    return (
      <Center
        px=".8em"
        py=".1em"
        sx={{ border: '.1em solid black', fontSize: '16pt', zIndex: 100 }}
        bg="pastel-tan.1">
        後勤
      </Center>
    );
  };

  const { setNodeRef } = useDroppable({
    id: `halfBoard-${row}-${col}`,
    data: {
      row,
      col
    }
  });
  return (
    <div ref={setNodeRef} className={`${row}-${col}`}>
      {/* TODO: only show overlay when something is being dragged */}
      <Center mih="5em" bg={isHalfBoardCamp(row, col) ? 'transparent' : 'transparent'}>
        {getPieceContent()}
      </Center>
    </div>
  );
}
