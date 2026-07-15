import React from 'react';
import { Box, Text, List, ThemeIcon, Stack, Divider } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import PropTypes from 'prop-types';
import { getPieceInfo } from 'data/pieceInfo';
import { predictOutcome } from 'utils/predictOutcome';

const outcomeMessages = {
  'both-die': {
    color: 'red',
    text: { en: 'Both pieces will be destroyed.', zh: '雙方棋子都會被摧毀。' },
  },
  'target-dies': {
    color: 'green',
    text: { en: 'The enemy piece will be destroyed.', zh: '敵方棋子將被摧毀。' },
  },
  'source-dies': {
    color: 'red',
    text: { en: 'Your piece will be destroyed.', zh: '您的棋子將被摧毀。' },
  },
  unknown: {
    color: 'gray',
    text: {
      en: "This piece's identity is hidden — the outcome can't be predicted.",
      zh: '這枚棋子的身份未知 — 無法預測結果。',
    },
  },
};

function PieceCard({ piece, isEnglish }) {
  const info = getPieceInfo(isEnglish)[piece.name];
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
  isEnglish: PropTypes.bool,
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
  isEnglish = false,
  gameConfig = {},
}) {
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
        {isEnglish ? 'Piece Info' : '棋子資訊'}
      </Text>
      {showOutcome ? (
        <Stack spacing="sm">
          <PieceCard piece={originPiece} isEnglish={isEnglish} />
          <Divider label={isEnglish ? 'attacks' : '攻擊'} labelPosition="center" />
          <PieceCard piece={destinationPiece} isEnglish={isEnglish} />
          <Divider />
          <Text size="sm" fw={600} color={outcomeMessages[outcome.type]?.color}>
            {isEnglish
              ? outcomeMessages[outcome.type]?.text.en
              : outcomeMessages[outcome.type]?.text.zh}
          </Text>
        </Stack>
      ) : hoveredPiece ? (
        <PieceCard piece={hoveredPiece} isEnglish={isEnglish} />
      ) : (
        <Text size="xs" c="dimmed">
          {isEnglish ? 'Hover over a piece to see details.' : '將滑鼠移到棋子上以查看詳情。'}
        </Text>
      )}
    </Box>
  );
}

PieceInfoPanel.propTypes = {
  hoveredPiece: PropTypes.object,
  originPiece: PropTypes.object,
  destinationPiece: PropTypes.object,
  isEnglish: PropTypes.bool,
  gameConfig: PropTypes.object,
};
