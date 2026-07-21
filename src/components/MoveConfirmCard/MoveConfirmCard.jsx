import { Box, Text, Group, Button, Stack, Divider, ThemeIcon } from '@mantine/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getPieceInfo } from 'data/pieceInfo';
import { predictOutcome } from 'utils/predictOutcome';
import { outcomeMessages } from '../PieceInfoPanel/PieceInfoPanel';

function MiniPieceInfo({ piece }) {
  const { t } = useTranslation('pieces');
  const info = getPieceInfo(t)[piece.name];
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
};

export default function MoveConfirmCard({
  originPiece,
  destinationPiece,
  gameConfig = {},
  onConfirm,
  onCancel,
}) {
  const { t } = useTranslation('board');
  const outcome = predictOutcome(originPiece, destinationPiece, gameConfig);
  const message = outcome && outcomeMessages[outcome.type];

  return (
    <Box sx={{ width: '14em' }}>
      <Stack spacing="xs">
        {destinationPiece ? (
          <Group position="apart" noWrap>
            <MiniPieceInfo piece={originPiece} />
            <Text size="xs" c="dimmed">
              {t('vs')}
            </Text>
            <MiniPieceInfo piece={destinationPiece} />
          </Group>
        ) : null}
        {message ? (
          <Text size="sm" fw={600} color={message.color}>
            {t(`outcomes.${message.key}`)}
          </Text>
        ) : null}
        <Divider />
        <Group position="apart" grow>
          <Button size="md" onClick={onConfirm}>
            {t('send')}
          </Button>
          <Button size="md" variant="outline" color="red" onClick={onCancel}>
            {t('cancel')}
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
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
