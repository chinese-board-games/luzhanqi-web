/* eslint-disable react/prop-types */
import React from 'react';
import DragablePiece from 'components/DragablePiece';
import { Box } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core';
import { isCamp } from '../../utils';

export default function Position({ row, col, piece, activeId }) {
  const { setNodeRef } = useDroppable({
    id: `halfboard-${row}-${col}`,
    data: {
      row,
      col
    },
    disabled: isCamp(row, col)
  });
  const content =
    piece && piece.name && activeId !== piece.id ? (
      <DragablePiece
        name={piece.name}
        affiliation={0}
        id={piece.id}
        key={piece.id}
        data={{ row, col }}
      />
    ) : (
      <Box>Empty</Box>
    );
  return (
    <div
      ref={setNodeRef}
      style={{
        width: '10em',
        height: '5em',
        border: '.2em solid black'
      }}>
      <Box bg={isCamp(row, col) ? 'orange' : 'green'}>{content}</Box>
    </div>
  );
}
