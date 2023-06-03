/* eslint-disable react/prop-types */
import React from 'react';
import DragablePiece from 'components/DragablePiece';
import { Center, Stack } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core';
import { isHalfBoardCamp, isHalfBoardHQ, isCamp, isHQ } from '../utils';
import Piece from './Piece';

export default function Position({
  row,
  col,
  piece,
  activeId,
  shadeColor,
  isHalfBoard = false,
  disabled = false
}) {
  const placedPiece =
    piece && piece.name && isHalfBoard
      ? activeId !== piece.id && (
          <DragablePiece
            name={piece.name}
            affiliation={0}
            id={piece.id}
            key={piece.id}
            data={{ row, col }}
          />
        )
      : piece && <Piece name={piece.name} affiliation={piece.affiliation} />;
  const getPositionContent = () => {
    if (isHalfBoard ? isHalfBoardCamp(row, col) : isCamp(row, col)) {
      return (
        <Center
          sx={{
            borderRadius: '100%',
            border: '.1em solid black',
            writingMode: 'vertical-rl',
            fontSize: '16pt',
            zIndex: 100,
            filter: disabled && 'grayscale(100%) opacity(90%)'
          }}
          bg="pastel-tan.1"
          w="3.5em"
          h="3.5em">
          {placedPiece || '行營'}
        </Center>
      );
    }

    if (isHalfBoard ? isHalfBoardHQ(row, col) : isHQ(row, col)) {
      return (
        <Center
          px={placedPiece ? '.7em' : '1.5em'}
          py={placedPiece ? '.2em' : '0'}
          sx={{
            border: '.1em solid black',
            fontSize: '16pt',
            zIndex: 100,
            borderRadius: '3em 3em 1em 1em',
            filter: disabled && 'grayscale(100%) opacity(90%)'
          }}
          bg="pastel-tan.1">
          <Stack spacing="0em" align="stretch" justify="center">
            {placedPiece || (
              <>
                <Center sx={{ lineHeight: '1.1' }}>大</Center>
                <Center sx={{ lineHeight: '1.1' }}>本營</Center>
              </>
            )}
          </Stack>
        </Center>
      );
    }
    return (
      <Center
        px={placedPiece ? '0' : '.8em'}
        py={placedPiece ? '0' : '.1em'}
        sx={{
          border: '.1em solid black',
          fontSize: '16pt',
          zIndex: 100,
          filter: disabled && 'grayscale(100%) opacity(90%)'
        }}
        bg="pastel-tan.1">
        {placedPiece || '後勤'}
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
      <Center mih="5em" bg={(!disabled && shadeColor) || 'transparent'}>
        {getPositionContent()}
      </Center>
    </div>
  );
}
