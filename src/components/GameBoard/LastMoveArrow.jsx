import { useLayoutEffect, useState } from 'react';
import useWindowSize from 'hooks/useWindowSize';
import PropTypes from 'prop-types';

// blue for the viewing player's own moves, red for the opponent's (or the AI's)
const FRIENDLY_COLOR = 'dodgerblue';
const ENEMY_COLOR = 'crimson';
// stop the line short of the destination cell's exact center so the
// arrowhead doesn't land on top of the piece's name there
const TARGET_PULLBACK_PX = 16;

// draws a line with an arrowhead between the last move's origin and
// destination cells, on top of the cell-tint highlight, so the move stays
// traceable even when it happens too fast to notice both cells changing
// color independently. Renders as an SVG overlay sized to containerRef (a
// position:relative ancestor also wrapping the board Grid), and measures
// both cells relative to that same container, so the line lines up
// correctly regardless of scroll position - no viewport/document
// coordinate math or portal needed.
export default function LastMoveArrow({ lastMove, containerRef, viewerAffiliation }) {
  const [line, setLine] = useState(null);
  const [width] = useWindowSize();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!lastMove || !container) {
      setLine(null);
      return;
    }
    const { source, target } = lastMove;
    const fromEl = document.getElementsByClassName(`${source[0]}-${source[1]}`)[0];
    const toEl = document.getElementsByClassName(`${target[0]}-${target[1]}`)[0];
    if (!fromEl || !toEl) {
      setLine(null);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
    const x2Center = toRect.left + toRect.width / 2 - containerRect.left;
    const y2Center = toRect.top + toRect.height / 2 - containerRect.top;
    const dx = x2Center - x1;
    const dy = y2Center - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ratio = dist > TARGET_PULLBACK_PX ? (dist - TARGET_PULLBACK_PX) / dist : 0;
    setLine({
      x1,
      y1,
      x2: x1 + dx * ratio,
      y2: y1 + dy * ratio,
    });
    // re-measure whenever the move changes or the layout might have
    // shifted (window resize, via the width dependency)
  }, [lastMove, containerRef, width]);

  if (!line) {
    return null;
  }

  const color = lastMove.affiliation === viewerAffiliation ? FRIENDLY_COLOR : ENEMY_COLOR;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 200,
        overflow: 'visible',
      }}
    >
      <defs>
        <marker
          id="last-move-arrowhead"
          markerWidth="4"
          markerHeight="4"
          refX="2.5"
          refY="2"
          orient="auto"
        >
          <path d="M0,0 L4,2 L0,4 Z" fill={color} />
        </marker>
      </defs>
      <line
        x1={line.x1}
        y1={line.y1}
        x2={line.x2}
        y2={line.y2}
        stroke={color}
        strokeWidth={2.5}
        markerEnd="url(#last-move-arrowhead)"
      />
    </svg>
  );
}

LastMoveArrow.propTypes = {
  lastMove: PropTypes.shape({
    source: PropTypes.arrayOf(PropTypes.number),
    target: PropTypes.arrayOf(PropTypes.number),
    affiliation: PropTypes.number,
  }),
  containerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  viewerAffiliation: PropTypes.number,
};
