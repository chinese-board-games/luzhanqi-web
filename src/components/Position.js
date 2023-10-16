/* eslint-disable react/prop-types */
import React from 'react';
import DragablePiece from 'components/DragablePiece';
import { Center, Stack } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core';
import { isHalfBoardCamp, isHalfBoardHQ, isCamp, isHQ } from '../utils/core';
import Piece from './Piece';
import { motion, AnimatePresence } from 'framer-motion';

const disabledFilter = 'grayscale(50%) opacity(90%)';

export default function Position({
  row,
  col,
  piece,
  activeId,
  shadeColor,
  isHalfBoard = false,
  isEnglish,
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
            isEnglish={isEnglish}
          />
        )
      : piece && (
          <AnimatePresence>
            <motion.div
              key={piece.id}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
              <Piece name={piece.name} affiliation={piece.affiliation} isEnglish={isEnglish} />
            </motion.div>
          </AnimatePresence>
        );
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
            filter: disabled && disabledFilter,
            fontFamily: 'SentyWEN2017'
          }}
          bg="pastel-tan.1"
          w="4em"
          h="4em">
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
            filter: disabled && disabledFilter,
            fontFamily: 'SentyWEN2017'
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
          filter: disabled && disabledFilter,
          fontFamily: 'SentyWEN2017'
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
