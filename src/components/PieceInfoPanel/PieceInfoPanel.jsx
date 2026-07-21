import React from 'react';
import { Box, Text, List, ThemeIcon, Stack, Divider } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getPieceInfo } from 'data/pieceInfo';
import { predictOutcome } from 'utils/predictOutcome';

// maps predictOutcome()'s result type to this outcome's board.json key and
// badge color
export const outcomeMessages = {
  'both-die': { color: 'red', key: 'bothDie' },
  'target-dies': { color: 'green', key: 'targetDies' },
  'source-dies': { color: 'red', key: 'sourceDies' },
  move: { color: 'blue', key: 'move' },
  unknown: { color: 'gray', key: 'unknown' },
};

function PieceCard({ piece }) {
  const { t } = useTranslation('pieces');
  const info = getPieceInfo(t)[piece.name];
  if (!info) {
    return null;
  }
  return (
    <Stack spacing={4}>
      <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ThemeIcon color="blue" variant="light" size="sm">
          {info.icon}
        </ThemeIcon>
        <Text fw={600} size="sm">
          {info.title}
        </Text>
      </Box>
      <Text size="xs" c="dimmed">
        {info.description}
      </Text>
      <List size="xs" spacing={4}>
        {info.rules.map((rule) => (
          <List.Item key={rule} icon={<IconInfoCircle size={12} />}>
            {rule}
          </List.Item>
        ))}
      </List>
    </Stack>
  );
}

PieceCard.propTypes = {
  piece: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
};

/**
 * Desktop-only sidebar replacing the old hover tooltip: shows info for
 * whichever piece was last hovered, or - once both an origin and a target
 * piece are selected for the current move - the predicted combat outcome.
 */
export default function PieceInfoPanel({
  hoveredPiece,
  originPiece,
  destinationPiece,
  gameConfig = {},
}) {
  const { t } = useTranslation('board');
  const outcome =
    originPiece && destinationPiece
      ? predictOutcome(originPiece, destinationPiece, gameConfig)
      : null;
  const showOutcome = !!(outcome && destinationPiece);

  return (
    <Box
      bg="rgb(224, 224, 224)"
      sx={{
        borderRadius: '1em',
        padding: '1em',
        width: '16em',
        alignSelf: 'flex-start',
      }}
    >
      <Text fw={700} mb="xs">
        {t('pieceInfo')}
      </Text>
      {showOutcome ? (
        <Stack spacing="sm">
          <PieceCard piece={originPiece} />
          <Divider label={t('attacks')} labelPosition="center" />
          <PieceCard piece={destinationPiece} />
          <Divider />
          <Text size="sm" fw={600} color={outcomeMessages[outcome.type]?.color}>
            {t(`outcomes.${outcomeMessages[outcome.type]?.key}`)}
          </Text>
        </Stack>
      ) : hoveredPiece ? (
        <PieceCard piece={hoveredPiece} />
      ) : (
        <Text size="xs" c="dimmed">
          {t('hoverHint')}
        </Text>
      )}
    </Box>
  );
}

PieceInfoPanel.propTypes = {
  hoveredPiece: PropTypes.object,
  originPiece: PropTypes.object,
  destinationPiece: PropTypes.object,
  gameConfig: PropTypes.object,
};
