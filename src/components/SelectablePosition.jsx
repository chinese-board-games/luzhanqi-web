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

const getShadeColor = (
  hovered,
  originSelected,
  destinationSelected,
  attackable,
  movable,
  isLastMove
) => {
  let state = null;

  if (originSelected) {
    state = 'origin';
  } else if (destinationSelected) {
    state = 'destination';
  } else if (attackable) {
    state = 'attackable';
  } else if (movable) {
    state = 'movable';
  } else if (isLastMove) {
    state = 'lastMove';
  }

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
    isEnglish,
    disabled = false,
    onHoverPiece,
  },
  ref
) {
  const { hovered, ref: hoverRef } = useHover();
  const mergedRef = useMergedRef(hoverRef, ref);
  const shadeColor = getShadeColor(
    hovered,
    originSelected,
    destinationSelected,
    attackable,
    movable,
    isLastMove
  );

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
    >
      <Position
        row={row}
        col={col}
        piece={piece}
        disabled={disabled}
        shadeColor={shadeColor}
        isHalfBoard={false}
        isEnglish={isEnglish}
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
  isEnglish: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onHoverPiece: PropTypes.func,
};

export default SelectablePosition;
