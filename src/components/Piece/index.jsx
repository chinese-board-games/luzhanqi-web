import { Center, Text } from '@mantine/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function Piece({ name, affiliation }) {
  const { t } = useTranslation('pieces');
  return (
    <Center
      bg="pastel-tan.0"
      sx={(theme) => ({
        borderRadius: '10%',
        boxShadow: theme.shadows.sm,
        writingMode: 'horizontal-tb',
        // pieces are clicked/dragged rapidly during play and setup - without
        // this, a fast double-click or a drag that starts on the label text
        // selects it like ordinary page text instead of acting on the piece
        userSelect: 'none',
        WebkitUserSelect: 'none',
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
      <Text sx={{ fontFamily: 'SentyWEN2017' }} color={affiliation === 0 ? 'indigo.7' : 'red.7'}>
        {t(`${name}.short`)}
      </Text>
    </Center>
  );
}

Piece.propTypes = {
  name: PropTypes.string.isRequired,
  affiliation: PropTypes.number.isRequired,
};
