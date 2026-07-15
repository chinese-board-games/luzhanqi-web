import React from 'react';
import * as Icons from '@tabler/icons-react';
import pieceData from './pieceData.json';

// map string names from JSON → actual icon components
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

/** Piece display info (title/description/rules/icon), keyed by piece name. */
const pieceInfo = Object.fromEntries(
  pieceData.map((piece) => [
    piece.id,
    {
      ...piece,
      icon: React.createElement(iconMap[piece.icon] || Icons.IconQuestionMark, { size: 16 }),
    },
  ])
);

/** Same piece info, localized: picks the English or Traditional Chinese
 * title/description/rules depending on isEnglish. */
export const getPieceInfo = (isEnglish) =>
  Object.fromEntries(
    Object.entries(pieceInfo).map(([id, piece]) => [
      id,
      {
        ...piece,
        title: isEnglish ? piece.title : piece.title_zh,
        description: isEnglish ? piece.description : piece.description_zh,
        rules: isEnglish ? piece.rules : piece.rules_zh,
      },
    ])
  );

export default pieceInfo;
