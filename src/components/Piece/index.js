import { Box } from '@mantine/core';
import React from 'react';
// eslint-disable-next-line import/no-named-default
import { default as PieceModel } from '../../models/Piece';

// eslint-disable-next-line react/prop-types
export default function Piece({ type, affiliation }) {
  const piece = PieceModel(type, affiliation);
  return (
    <Box bg="red" px="1em" py=".5em" fz="xl" sx={{ borderRadius: '10%' }}>
      {piece.display}
    </Box>
  );
}
