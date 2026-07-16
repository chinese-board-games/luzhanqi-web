import { Box, Text, Group, Button, Stack, Divider, ThemeIcon } from '@mantine/core';
import PropTypes from 'prop-types';
import { getPieceInfo } from 'data/pieceInfo';
import { predictOutcome } from 'utils/predictOutcome';
import { outcomeMessages } from '../PieceInfoPanel/PieceInfoPanel';

function MiniPieceInfo({ piece, isEnglish }) {
  const info = getPieceInfo(isEnglish)[piece.name];
  if (!info) {
    return null;
  }
  return (
    <Group spacing={4} noWrap>
      <ThemeIcon color="blue" variant="light" size="sm">
        {info.icon}
      </ThemeIcon>
      <Text size="sm" fw={600}>
        {info.title}
      </Text>
    </Group>
  );
}

MiniPieceInfo.propTypes = {
  piece: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
  isEnglish: PropTypes.bool,
};

export default function MoveConfirmCard({
  originPiece,
  destinationPiece,
  gameConfig = {},
  isEnglish = false,
  onConfirm,
  onCancel,
}) {
  const outcome = predictOutcome(originPiece, destinationPiece, gameConfig);
  const message = outcome && outcomeMessages[outcome.type];

  return (
    <Box sx={{ width: '14em' }}>
      <Stack spacing="xs">
        {destinationPiece ? (
          <Group position="apart" noWrap>
            <MiniPieceInfo piece={originPiece} isEnglish={isEnglish} />
            <Text size="xs" c="dimmed">
              {isEnglish ? 'vs' : '對'}
            </Text>
            <MiniPieceInfo piece={destinationPiece} isEnglish={isEnglish} />
          </Group>
        ) : null}
        {message ? (
          <Text size="sm" fw={600} color={message.color}>
            {isEnglish ? message.text.en : message.text.zh}
          </Text>
        ) : null}
        <Divider />
        <Group position="apart" grow>
          <Button size="md" onClick={onConfirm}>
            {isEnglish ? 'Send' : '送出'}
          </Button>
          <Button size="md" variant="outline" color="red" onClick={onCancel}>
            {isEnglish ? 'Cancel' : '取消'}
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}

MoveConfirmCard.propTypes = {
  originPiece: PropTypes.object,
  destinationPiece: PropTypes.object,
  gameConfig: PropTypes.object,
  isEnglish: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
