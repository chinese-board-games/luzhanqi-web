/** An object containing basic game information for each piece type. Display
 * labels are localized separately via the "pieces" i18next namespace. */
export const pieces = {
  bomb: { count: 2, order: -1, kills: 0 },
  brigadier_general: { count: 2, order: 6, kills: 0 },
  captain: { count: 3, order: 3, kills: 0 },
  colonel: { count: 2, order: 5, kills: 0 },
  engineer: { count: 3, order: 1, kills: 0 },
  field_marshall: { count: 1, order: 9, kills: 0 },
  flag: { count: 1, order: 0, kills: 0 },
  general: { count: 1, order: 8, kills: 0 },
  landmine: { count: 3, order: -1, kills: 0 },
  lieutenant: { count: 3, order: 2, kills: 0 },
  major_general: { count: 2, order: 7, kills: 0 },
  major: { count: 2, order: 4, kills: 0 },
  enemy: { count: 0, order: -1, kills: 0 },
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
    kills: 0,
  };
};

export default Piece;
