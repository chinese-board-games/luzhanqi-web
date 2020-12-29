const pieces = {
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

export default (name, affiliation) => {
  if (!pieces[name]) {
    throw Error("Invalid piece name provided");
  }
  return {
    name,
    affiliation,
    ...pieces[name],
    kills: 0,
    alive: true,
  };
};
