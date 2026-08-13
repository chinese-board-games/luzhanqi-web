import { forwardRef, useEffect } from 'react';
import Position from './Position';
import { Box } from '@mantine/core';
import { useHover, useMergedRef } from '@mantine/hooks';
import PropTypes from 'prop-types';

const shadeMap = {
  origin: { color: 'blue.1', hover: 'blue.2' },
  destination: { color: 'orange.1', hover: 'orange.2' },
  attackable: { color: 'red.1', hover: 'red.2' },
  movable: { color: 'green.1', hover: 'green.2' },
  lastMove: { color: 'yellow.2', hover: 'yellow.3' },
};

// the cell's role in the current selection, in precedence order. Drives both
// the shading below and the data-state attribute the e2e suite reads to find
// legal destinations, so the two can't drift apart.
export const getCellState = (
  originSelected,
  destinationSelected,
  attackable,
  movable,
  isLastMove
) => {
  if (originSelected) return 'origin';
  if (destinationSelected) return 'destination';
  if (attackable) return 'attackable';
  if (movable) return 'movable';
  if (isLastMove) return 'lastMove';
  return null;
};

const getShadeColor = (hovered, state) => {
  if (!state) {
    return hovered ? 'gray.1' : 'transparent';
  }

  const { color, hover } = shadeMap[state];
  return hovered ? hover : color;
};

const SelectablePosition = forwardRef(function SelectablePosition(
  {
    row,
    col,
    piece,
    onClick,
    originSelected = false,
    destinationSelected = false,
    attackable = false,
    movable = false,
    isLastMove = false,
    disabled = false,
    onHoverPiece,
  },
  ref
) {
  const { hovered, ref: hoverRef } = useHover();
  const mergedRef = useMergedRef(hoverRef, ref);
  const state = getCellState(originSelected, destinationSelected, attackable, movable, isLastMove);
  const shadeColor = getShadeColor(hovered, state);

  // reports hover to the parent, which drives the desktop PieceInfoPanel;
  // only fires while there's a real piece here
  useEffect(() => {
    if (hovered && piece && piece.name) {
      onHoverPiece?.(piece);
    }
  }, [hovered]);

  return (
    <Box
      sx={{
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      ref={mergedRef}
      onClick={disabled ? undefined : onClick}
      data-testid={`cell-${row}-${col}`}
      data-state={state ?? 'none'}
      data-disabled={disabled}
    >
      <Position
        row={row}
        col={col}
        piece={piece}
        disabled={disabled}
        shadeColor={shadeColor}
        isHalfBoard={false}
        isLastMove={isLastMove}
      />
    </Box>
  );
});

SelectablePosition.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  piece: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  originSelected: PropTypes.bool.isRequired,
  destinationSelected: PropTypes.bool.isRequired,
  attackable: PropTypes.bool,
  movable: PropTypes.bool.isRequired,
  isLastMove: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  onHoverPiece: PropTypes.func,
};

export default SelectablePosition;
