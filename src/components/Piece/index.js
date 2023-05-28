import { Center } from '@mantine/core';
import React from 'react';
import { default as PieceModel } from '../../models/Piece';

// eslint-disable-next-line react/prop-types
export default function Piece({ name, affiliation }) {
  const piece = PieceModel(name, affiliation);
  return (
    <Center
      bg="pastel-tan.0"
      w="4.5em"
      h="2.3em"
      fz="xl"
      sx={(theme) => ({ borderRadius: '10%', boxShadow: theme.shadows.sm })}>
      {piece.display}
    </Center>
  );
}
