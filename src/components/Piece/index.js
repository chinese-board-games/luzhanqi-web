import { Center, Text } from '@mantine/core';
import React from 'react';
import { default as PieceModel } from '../../models/Piece';

// eslint-disable-next-line react/prop-types
export default function Piece({ name, affiliation }) {
  const piece = PieceModel(name, affiliation);
  return (
    <Center
      bg="pastel-tan.0"
      w="4em"
      h="2em"
      fz="xl"
      sx={(theme) => ({
        borderRadius: '10%',
        boxShadow: theme.shadows.sm,
        writingMode: 'horizontal-tb'
      })}>
      <Text sx={{ fontFamily: 'SentyWEN2017' }} color={affiliation === 0 ? 'indigo.7' : 'red.7'}>
        {piece.display}
      </Text>
    </Center>
  );
}
