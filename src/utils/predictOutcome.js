/**
 * Predicts the outcome of an attack given the attacking (source) piece and
 * the piece currently on the target tile (or null for an empty tile).
 * Mirrors the combat rules in the backend's pieceMovement, using only
 * client-visible piece data - if the target's identity is hidden by fog of
 * war (the generic 'enemy' placeholder), the true outcome can't be known.
 *
 * @param {Object} source the attacking piece (always known - it's your own)
 * @param {Object|null} target the piece on the destination tile, or null
 * @param {{landminesSurvive?: boolean}} config the game's rule-variant config
 * @returns {{type: 'move'|'unknown'|'both-die'|'target-dies'|'source-dies'}|null}
 */
export function predictOutcome(source, target, config = {}) {
  if (!source) {
    return null;
  }
  if (!target) {
    return { type: 'move' };
  }
  if (target.name === 'enemy') {
    return { type: 'unknown' };
  }
  if (source.affiliation === target.affiliation) {
    return null;
  }

  if (source.name !== 'engineer' && target.name === 'landmine') {
    // under landminesSurvive the mine stays and only the attacker dies,
    // same outcome (for the attacker) as any other lost fight
    return config.landminesSurvive ? { type: 'source-dies' } : { type: 'both-die' };
  }

  if (source.name === 'bomb' || source.name === target.name || target.name === 'bomb') {
    return { type: 'both-die' };
  }

  if (source.order > target.order || (source.name === 'engineer' && target.name === 'landmine')) {
    return { type: 'target-dies' };
  }

  return { type: 'source-dies' };
}
