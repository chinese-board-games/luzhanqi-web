import React from 'react';
import { Tooltip, Text, Box, List, ThemeIcon } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getPieceInfo } from 'data/pieceInfo';

const GameTooltip = ({
  children,
  pieceName,
  placement = 'top',
  showTooltips = true, // <-- TODO: toggle isn't currently used
}) => {
  const { t } = useTranslation('pieces');
  const info = getPieceInfo(t)[pieceName];

  if (!showTooltips || !info) return children; // respect toggle

  const tooltipContent = (
    <Box>
      <Box style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <ThemeIcon color="blue" variant="light" size="sm">
          {info.icon}
        </ThemeIcon>
        <Text fw={600} size="sm">
          {info.title}
        </Text>
      </Box>
      <Text size="xs" c="dimmed" mb="xs">
        {info.description}
      </Text>
      <List size="xs" spacing="xs">
        {info.rules.map((rule, index) => (
          <List.Item key={index} icon={<IconInfoCircle size={12} />}>
            {rule}
          </List.Item>
        ))}
      </List>
    </Box>
  );

  return (
    <Tooltip label={tooltipContent} position={placement} withArrow multiline width={220}>
      {children}
    </Tooltip>
  );
};

GameTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  pieceName: PropTypes.string,
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  showTooltips: PropTypes.bool, // new prop
};

export default GameTooltip;
