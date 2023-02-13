import { Center } from '@mantine/core';
import React from 'react';
import { default as PieceModel } from '../../models/Piece';

// eslint-disable-next-line react/prop-types
export default function Piece({ name, affiliation }) {
  const piece = PieceModel(name, affiliation);
  return (
    <Center bg="red" w="4em" h="2em" fz="xl" sx={{ borderRadius: '10%' }}>
      {piece.display}
    </Center>
  );
}
