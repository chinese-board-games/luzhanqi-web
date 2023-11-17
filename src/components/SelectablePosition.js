import Position from './Position';
import { Box } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import PropTypes from 'prop-types';

const shadeMap = {
  origin: { color: 'blue.1', hover: 'blue.2' },
  destination: { color: 'orange.1', hover: 'orange.2' },
  attackable: { color: 'red.1', hover: 'red.2' },
  movable: { color: 'green.1', hover: 'green.2' },
};

const getShadeColor = (hovered, originSelected, destinationSelected, attackable, movable) => {
  let state = null;

  if (originSelected) {
    state = 'origin';
  } else if (destinationSelected) {
    state = 'destination';
  } else if (attackable) {
    state = 'attackable';
  } else if (movable) {
    state = 'movable';
  }

  if (!state) {
    return hovered ? 'gray.1' : 'transparent';
  }

  const { color, hover } = shadeMap[state];
  return hovered ? hover : color;
};

export default function SelectablePosition({
  row,
  col,
  piece,
  onClick,
  originSelected = false,
  destinationSelected = false,
  attackable = false,
  movable = false,
  isEnglish,
  disabled = false,
}) {
  const { hovered, ref } = useHover();
  const shadeColor = getShadeColor(
    hovered,
    originSelected,
    destinationSelected,
    attackable,
    movable
  );

  return (
    <Box
      sx={{
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      ref={ref}
      onClick={disabled ? undefined : onClick}>
      <Position
        row={row}
        col={col}
        piece={piece}
        disabled={disabled}
        shadeColor={shadeColor}
        isHalfBoard={false}
        isEnglish={isEnglish}
      />
    </Box>
  );
}

SelectablePosition.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  piece: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  originSelected: PropTypes.bool.isRequired,
  destinationSelected: PropTypes.bool.isRequired,
  attackable: PropTypes.bool,
  movable: PropTypes.bool.isRequired,
  isEnglish: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
};
