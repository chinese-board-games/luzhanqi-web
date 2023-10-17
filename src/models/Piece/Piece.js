/** An object containing basic game information for each piece type. */
export const pieces = {
  bomb: { count: 2, order: -1, display: '炸彈', english: 'BOMB', kills: 0 },
  brigadier_general: { count: 2, order: 6, display: '旅長', english: 'BG', kills: 0 },
  captain: { count: 3, order: 3, display: '連長', english: 'CPT', kills: 0 },
  colonel: { count: 2, order: 5, display: '團長', english: 'COL', kills: 0 },
  engineer: { count: 3, order: 1, display: '工兵', english: 'ENG', kills: 0 },
  field_marshall: { count: 1, order: 9, display: '司令', english: 'FM', kills: 0 },
  flag: { count: 1, order: 0, display: '軍旗', english: 'FLAG', kills: 0 },
  general: { count: 1, order: 8, display: '軍長', english: 'GEN', kills: 0 },
  landmine: { count: 3, order: -1, display: '地雷', english: 'MINE', kills: 0 },
  lieutenant: { count: 3, order: 2, display: '排長', english: 'LT', kills: 0 },
  major_general: { count: 2, order: 7, display: '師長', english: 'MG', kills: 0 },
  major: { count: 2, order: 4, display: '營長', english: 'MAJ', kills: 0 },
  enemy: { count: 0, order: -1, display: '敵軍', english: 'ENY', kills: 0 }
};

export const setupPieces = [];
Object.keys(pieces).forEach((name) => {
  const piece = pieces[name];
  for (let i = 0; i < piece.count; i++) {
    setupPieces.push({ ...piece, id: `${name}-${i}`, name });
  }
});

/**
 * The complete type of a game piece.
 *
 * @typedef {Object} Piece
 * @property {string} name
 * @property {number} affiliation
 * @property {number} order
 * @property {number} kills
 * @property {string} display
 * @property {string} id
 */

/**
 * Initializes and returns a new piece object.
 *
 * @function
 * @param {string} name The name of the piece, should be a key in pieces object.
 * @param {number} affiliation 0 for host, increments by 1 for additional players.
 * @returns {Piece} A new Piece object.
 */
const Piece = (name, affiliation) => {
  if (name === 'none') return null;

  const piece = pieces[name];
  if (!piece) {
    throw Error(`Invalid piece name provided: ${name}`);
  }
  return {
    ...piece,
    name,
    affiliation,
    kills: 0
  };
};

export default Piece;
