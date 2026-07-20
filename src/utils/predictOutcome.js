/**
 * Predicts the outcome of an attack given the attacking (source) piece and
 * the piece currently on the target tile (or null for an empty tile).
 * Mirrors the combat rules in the backend's pieceMovement, using only
 * client-visible piece data - if the target's identity is hidden by fog of
 * war (the generic 'enemy' placeholder), the true outcome can't be known.
 *
 * @param {Object} source the attacking piece (always known - it's your own)
 * @param {Object|null} target the piece on the destination tile, or null
 * @param {{landminesSurvive?: boolean, captureTheFlag?: boolean}} config the game's rule-variant config
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
    // same outcome (for the attacker) as any other lost fight - except a
    // bomb, which always trades with whatever it hits, mine included
    return config.landminesSurvive && source.name !== 'bomb'
      ? { type: 'source-dies' }
      : { type: 'both-die' };
  }

  if (config.captureTheFlag && target.name === 'flag' && source.name === 'bomb') {
    // under captureTheFlag the flag is an objective to be carried home, not
    // something a bomb can simply blow up - only the bomb dies, the flag
    // stands unchanged (same shape as any other lost attack)
    return { type: 'source-dies' };
  }

  if (source.name === 'bomb' || source.name === target.name || target.name === 'bomb') {
    return { type: 'both-die' };
  }

  if (source.order > target.order || (source.name === 'engineer' && target.name === 'landmine')) {
    return { type: 'target-dies' };
  }

  return { type: 'source-dies' };
}

/**
 * Optimistically applies a move to the board immediately on send, so the
 * player doesn't wait for the server round-trip to see it take effect.
 * Reuses predictOutcome's classification rather than re-deriving the rules
 * - only paints the result onto the board. The source tile is always
 * cleared (true in every outcome, backend-side, regardless of who wins);
 * the target tile is only filled in when the outcome is deterministic - an
 * attack on a fogged 'enemy' piece is genuinely unknowable client-side, so
 * the target is left alone until the server's playerMadeMove response
 * confirms or corrects it.
 *
 * @param {Array<Array<Object|null>>} board
 * @param {[number, number]} source
 * @param {[number, number]} target
 * @param {Object} gameConfig
 * @returns {Array<Array<Object|null>>} a new board array
 */
export function applyMoveOptimistically(board, source, target, gameConfig = {}) {
  const [sr, sc] = source;
  const [tr, tc] = target;
  const sourcePiece = board[sr][sc];
  const targetPiece = board[tr][tc];
  const outcome = predictOutcome(sourcePiece, targetPiece, gameConfig);
  if (!outcome) {
    return board;
  }

  const newBoard = board.map((row) => [...row]);
  newBoard[sr][sc] = null;

  switch (outcome.type) {
    case 'move':
    case 'target-dies':
      newBoard[tr][tc] = sourcePiece;
      break;
    case 'both-die':
      newBoard[tr][tc] = null;
      break;
    case 'source-dies':
    case 'unknown':
    default:
      // target tile is left as-is: source-dies means the defender stands
      // unchanged, and unknown means the true outcome can't be guessed
      break;
  }

  return newBoard;
}
