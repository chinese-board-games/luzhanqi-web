export const pieces = {
  bomb: { count: 2, order: -1 },
  brigadier_general: { count: 2, order: 6 },
  captain: { count: 3, order: 3 },
  colonel: { count: 2, order: 5 },
  engineer: { count: 3, order: 1 },
  field_marshall: { count: 1, order: 9 },
  flag: { count: 1, order: 0 },
  general: { count: 1, order: 8 },
  landmine: { count: 3, order: -1 },
  lieutenant: { count: 3, order: 2 },
  major_general: { count: 2, order: 7 },
  major: { count: 2, order: 4 },
};

/**
 * Initializes and returns a piece object
 * @param {String} name the name of the piece, should be a key in pieces object
 * @param {Number} affiliation 0 for host, increments by 1 for additional players
 * @returns {Object} new Piece object
 */
const Piece = (name, affiliation) => {
  if (!pieces[name]) {
    throw Error("Invalid piece name provided");
  }
  return {
    name,
    affiliation,
    order: pieces[name].order,
    kills: 0,
  };
};

export default Piece;
