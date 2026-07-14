import React from 'react';
import { Box, Text, List, ThemeIcon, Stack, Divider } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import PropTypes from 'prop-types';
import pieceInfo from 'data/pieceInfo';
import { predictOutcome } from 'utils/predictOutcome';

const outcomeMessages = {
  'both-die': { color: 'red', text: 'Both pieces will be destroyed.' },
  'target-dies': { color: 'green', text: 'The enemy piece will be destroyed.' },
  'source-dies': { color: 'red', text: 'Your piece will be destroyed.' },
  unknown: {
    color: 'gray',
    text: "This piece's identity is hidden — the outcome can't be predicted.",
  },
};

function PieceCard({ piece }) {
  const info = pieceInfo[piece.name];
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
export default function PieceInfoPanel({ hoveredPiece, originPiece, destinationPiece }) {
  const outcome =
    originPiece && destinationPiece ? predictOutcome(originPiece, destinationPiece) : null;
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
        Piece Info
      </Text>
      {showOutcome ? (
        <Stack spacing="sm">
          <PieceCard piece={originPiece} />
          <Divider label="attacks" labelPosition="center" />
          <PieceCard piece={destinationPiece} />
          <Divider />
          <Text size="sm" fw={600} color={outcomeMessages[outcome.type]?.color}>
            {outcomeMessages[outcome.type]?.text}
          </Text>
        </Stack>
      ) : hoveredPiece ? (
        <PieceCard piece={hoveredPiece} />
      ) : (
        <Text size="xs" c="dimmed">
          Hover over a piece to see details.
        </Text>
      )}
    </Box>
  );
}

PieceInfoPanel.propTypes = {
  hoveredPiece: PropTypes.object,
  originPiece: PropTypes.object,
  destinationPiece: PropTypes.object,
};
