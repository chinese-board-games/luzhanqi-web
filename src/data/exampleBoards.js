/**
 * Curated, rule-legal half-board layouts a player can apply with one click
 * during setup. Row 0 is the frontline (nearest the mountains), row 5 is the
 * HQ row - the same orientation HalfBoard.jsx edits in. 'none' marks the five
 * camp cells, which must stay empty.
 */
export const exampleBoards = [
  {
    name: 'Example 1',
    name_zh: '範例一',
    board: [
      ['major_general', 'lieutenant', 'colonel', 'engineer', 'major_general'],
      ['engineer', 'none', 'field_marshall', 'none', 'engineer'],
      ['colonel', 'lieutenant', 'none', 'bomb', 'major'],
      ['brigadier_general', 'none', 'brigadier_general', 'none', 'lieutenant'],
      ['bomb', 'landmine', 'general', 'captain', 'captain'],
      ['landmine', 'flag', 'major', 'landmine', 'captain'],
    ],
  },
  {
    // fortress: strong pieces and landmines massed around a col-3 flag
    name: 'Example 2',
    name_zh: '範例二',
    board: [
      ['lieutenant', 'captain', 'colonel', 'captain', 'lieutenant'],
      ['engineer', 'none', 'major_general', 'none', 'engineer'],
      ['brigadier_general', 'major', 'none', 'captain', 'brigadier_general'],
      ['colonel', 'none', 'general', 'none', 'engineer'],
      ['bomb', 'landmine', 'major_general', 'lieutenant', 'bomb'],
      ['landmine', 'major', 'field_marshall', 'flag', 'landmine'],
    ],
  },
  {
    // flanks: defense spread across both sides with a col-1 flag
    name: 'Example 3',
    name_zh: '範例三',
    board: [
      ['captain', 'lieutenant', 'colonel', 'lieutenant', 'captain'],
      ['engineer', 'none', 'general', 'none', 'engineer'],
      ['major', 'brigadier_general', 'none', 'brigadier_general', 'major'],
      ['engineer', 'none', 'major_general', 'none', 'colonel'],
      ['landmine', 'captain', 'major_general', 'field_marshall', 'bomb'],
      ['bomb', 'flag', 'landmine', 'lieutenant', 'landmine'],
    ],
  },
];
