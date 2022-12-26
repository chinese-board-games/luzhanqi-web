/** An object containing basic game information for each piece type. */
export const pieces = {
  bomb: { count: 2, order: -1, display: '炸彈' },
  brigadier_general: { count: 2, order: 6, display: '旅長' },
  captain: { count: 3, order: 3, display: '連長' },
  colonel: { count: 2, order: 5, display: '團長' },
  engineer: { count: 3, order: 1, display: '工兵' },
  field_marshall: { count: 1, order: 9, display: '司令' },
  flag: { count: 1, order: 0, display: '軍旗' },
  general: { count: 1, order: 8, display: '軍長' },
  landmine: { count: 3, order: -1, display: '地雷' },
  lieutenant: { count: 3, order: 2, display: '排長' },
  major_general: { count: 2, order: 7, display: '師長' },
  major: { count: 2, order: 4, display: '營長' }
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
