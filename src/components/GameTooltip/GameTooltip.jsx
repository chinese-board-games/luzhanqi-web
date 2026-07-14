import React from 'react';
import { Tooltip, Text, Box, List, ThemeIcon } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import PropTypes from 'prop-types';
import pieceData from '../../data/pieceData.json';

// map string names from JSON → actual icon components
import * as Icons from '@tabler/icons-react';

const iconMap = {
  IconFlag: Icons.IconFlag,
  IconBomb: Icons.IconBomb,
  IconShieldHalfFilled: Icons.IconShieldHalfFilled,
  IconTool: Icons.IconTool,
  IconUserCircle: Icons.IconUserCircle,
  IconUser: Icons.IconUser,
  IconUserShield: Icons.IconUserShield,
  IconChevronUp: Icons.IconChevronUp,
  IconBadge: Icons.IconBadge,
  IconStar: Icons.IconStar,
  IconMedal: Icons.IconMedal,
  IconShieldStar: Icons.IconShieldStar,
  IconCrown: Icons.IconCrown,
};

const pieceInfo = Object.fromEntries(
  pieceData.map((piece) => [
    piece.id,
    {
      ...piece,
      icon: React.createElement(iconMap[piece.icon] || Icons.IconQuestionMark, { size: 16 }),
    },
  ])
);

const GameTooltip = ({
  children,
  pieceName,
  placement = 'top',
  showTooltips = true, // <-- TODO: toggle isn't currently used
}) => {
  const info = pieceInfo[pieceName];

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
