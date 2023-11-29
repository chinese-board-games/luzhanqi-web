import { Center, Text } from '@mantine/core';
import React from 'react';
import { default as PieceModel } from '../../models/Piece';
import PropTypes from 'prop-types';

export default function Piece({ name, affiliation, isEnglish }) {
  const piece = PieceModel(name, affiliation);
  return (
    <Center
      bg="pastel-tan.0"
      sx={(theme) => ({
        borderRadius: '10%',
        boxShadow: theme.shadows.sm,
        writingMode: 'horizontal-tb',
        width: theme.other.pieceSizing.md.width,
        height: theme.other.pieceSizing.md.height,
        fontSize: theme.other.pieceSizing.md.fontSize,
        '@media (max-width: 450px)': {
          width: theme.other.pieceSizing.sm.width,
          height: theme.other.pieceSizing.sm.height,
          fontSize: theme.other.pieceSizing.sm.fontSize,
        },
        '@media (max-width: 375px)': {
          width: theme.other.pieceSizing.xs.width,
          height: theme.other.pieceSizing.xs.height,
          fontSize: theme.other.pieceSizing.xs.fontSize,
        },
      })}
    >
      <Text sx={{ fontFamily: 'SentyWEN2017' }} color={affiliation === 0 ? '#047495' : '#900000'}>
        {isEnglish ? piece.english : piece.display}
      </Text>
    </Center>
  );
}

Piece.propTypes = {
  name: PropTypes.string.isRequired,
  affiliation: PropTypes.number.isRequired,
  isEnglish: PropTypes.bool.isRequired,
};
