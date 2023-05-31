/* eslint-disable react/prop-types */
import Position from './Position';
import { Box } from '@mantine/core';
import { useHover } from '@mantine/hooks';

export default function SelectablePosition({
  row,
  col,
  piece,
  selected = false,
  selectionColor = 'blue.1',
  selectionHoverColor = 'blue.2',
  disabled = false,
  onClick
}) {
  const { hovered, ref } = useHover();

  return (
    <Box sx={{ cursor: disabled ? 'not-allowed' : 'pointer' }} ref={ref} onClick={onClick}>
      <Position
        row={row}
        col={col}
        piece={piece}
        disabled={disabled}
        shadeColor={
          selected ? (hovered ? selectionHoverColor : selectionColor) : hovered && 'gray.1'
        }
      />
    </Box>
  );
}
