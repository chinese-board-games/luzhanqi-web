import React from 'react';
import DraggablePiece from 'components/DraggablePiece';
import { Center, Stack } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core';
import { isHalfBoardCamp, isHalfBoardHQ, isCamp, isHQ } from '../utils/core';
import Piece from './Piece';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const disabledFilter = 'grayscale(50%)';

export default function Position({
  row,
  col,
  piece,
  activeId,
  shadeColor,
  isHalfBoard = false,
  isEnglish,
  disabled = false,
}) {
  const placedPiece =
    piece && piece.name && isHalfBoard
      ? activeId !== piece.id && (
          <DraggablePiece
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
              style={{ filter: 'drop-shadow(0 0 0.75rem grey)' }}
              key={piece.id}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <Piece name={piece.name} affiliation={piece.affiliation} isEnglish={isEnglish} />
            </motion.div>
          </AnimatePresence>
        );
  const getPositionContent = () => {
    if (isHalfBoard ? isHalfBoardCamp(row, col) : isCamp(row, col)) {
      // camp position
      return (
        <Center
          bg="pastel-tan.1"
          sx={(theme) => ({
            borderRadius: '100%',
            border: '.1em solid black',
            writingMode: isEnglish ? 'horizontal-tb' : 'vertical-rl',
            zIndex: 100,
            filter: disabled && disabledFilter,
            whiteSpace: 'nowrap',
            fontFamily: 'SentyWEN2017',
            width: theme.other.campSizing.md.width,
            height: theme.other.campSizing.md.height,
            fontSize: theme.other.campSizing.md.fontSize,
            '@media (max-width: 450px)': {
              width: theme.other.campSizing.sm.width,
              height: theme.other.campSizing.sm.height,
              fontSize: theme.other.campSizing.sm.fontSize,
            },
          })}
        >
          {placedPiece || (isEnglish ? 'SAFE' : '行營')}
        </Center>
      );
    }

    if (isHalfBoard ? isHalfBoardHQ(row, col) : isHQ(row, col)) {
      // HQ position
      return (
        <Center
          px={placedPiece ? '.7em' : '1.5em'}
          py={placedPiece ? '.2em' : '0'}
          sx={(theme) => ({
            border: '.1em solid black',
            zIndex: 100,
            borderRadius: '3em 3em 1em 1em',
            filter: disabled && disabledFilter,
            fontFamily: 'SentyWEN2017',
            whiteSpace: 'nowrap',
            width: theme.other.hqSizing.md.width,
            height: theme.other.hqSizing.md.height,
            fontSize: theme.other.hqSizing.md.fontSize,
            '@media (max-width: 450px)': {
              width: theme.other.hqSizing.sm.width,
              height: theme.other.hqSizing.sm.height,
              fontSize: theme.other.hqSizing.sm.fontSize,
            },
            '@media (max-width: 375px)': {
              width: theme.other.hqSizing.xs.width,
              height: theme.other.hqSizing.xs.height,
              fontSize: theme.other.hqSizing.xs.fontSize,
            },
          })}
          bg="pastel-tan.1"
        >
          <Stack spacing="0em" align="stretch" justify="center">
            {placedPiece || (
              <>
                {isEnglish ? (
                  <Center sx={{ lineHeight: '1.1' }}>BASE</Center>
                ) : (
                  <>
                    <Center sx={{ lineHeight: '1.1' }}>大</Center>
                    <Center sx={{ lineHeight: '1.1' }}>本營</Center>
                  </>
                )}
              </>
            )}
          </Stack>
        </Center>
      );
    }
    // RR position
    return (
      <Center
        w="4.5em"
        h="2.5em"
        sx={(theme) => ({
          border: '.1em solid black',
          zIndex: 100,
          filter: disabled && disabledFilter,
          fontFamily: 'SentyWEN2017',
          whiteSpace: 'nowrap',
          width: theme.other.positionSizing.md.width,
          height: theme.other.positionSizing.md.height,
          fontSize: theme.other.positionSizing.md.fontSize,
          '@media (max-width: 450px)': {
            minWidth: theme.other.positionSizing.sm.width,
            minHeight: theme.other.positionSizing.sm.height,
            fontSize: theme.other.positionSizing.sm.fontSize,
          },
          '@media (max-width: 375px)': {
            minWidth: theme.other.positionSizing.xs.width,
            minHeight: theme.other.positionSizing.xs.height,
            fontSize: theme.other.positionSizing.xs.fontSize,
          },
        })}
        bg="pastel-tan.1"
      >
        {placedPiece || (isEnglish ? 'LAND' : '後勤')}
      </Center>
    );
  };

  const { setNodeRef } = useDroppable({
    id: `halfBoard-${row}-${col}`,
    data: {
      row,
      col,
    },
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

Position.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  piece: PropTypes.object,
  activeId: PropTypes.string,
  shadeColor: PropTypes.string,
  isHalfBoard: PropTypes.bool.isRequired,
  isEnglish: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};
