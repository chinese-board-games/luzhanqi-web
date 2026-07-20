import { useLayoutEffect, useState } from 'react';
import useWindowSize from 'hooks/useWindowSize';
import PropTypes from 'prop-types';

// draws every board connection as an SVG line overlay sized to
// containerRef (a position:relative ancestor also wrapping the board
// Grid), measuring each pair of cells relative to that same container -
// same approach as LastMoveArrow, generalized to many lines instead of
// one. No line-drawing library needed: the board's connections are fully
// known statically (see utils/core.js), so this is just two
// getBoundingClientRect() calls and an SVG <line> per connection.
export default function BoardConnectionLines({ connections, containerRef }) {
  const [lines, setLines] = useState([]);
  const [width] = useWindowSize();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      setLines([]);
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const measured = connections
      .map(({ start, end, isRailroad }) => {
        const fromEl = document.getElementsByClassName(`${start[0]}-${start[1]}`)[0];
        const toEl = document.getElementsByClassName(`${end[0]}-${end[1]}`)[0];
        if (!fromEl || !toEl) {
          return null;
        }
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();
        return {
          key: `${start[0]}-${start[1]}-${end[0]}-${end[1]}`,
          x1: fromRect.left + fromRect.width / 2 - containerRect.left,
          y1: fromRect.top + fromRect.height / 2 - containerRect.top,
          x2: toRect.left + toRect.width / 2 - containerRect.left,
          y2: toRect.top + toRect.height / 2 - containerRect.top,
          isRailroad,
        };
      })
      .filter(Boolean);
    setLines(measured);
    // re-measure whenever the connection list changes or the layout might
    // have shifted (window resize, via the width dependency)
  }, [connections, containerRef, width]);

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {lines.map((line) => (
        <line
          key={line.key}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={line.isRailroad ? 'gray' : 'black'}
          strokeWidth={line.isRailroad ? 4 : 3}
          strokeDasharray={line.isRailroad ? '8 6' : undefined}
        />
      ))}
    </svg>
  );
}

BoardConnectionLines.propTypes = {
  connections: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.arrayOf(PropTypes.number).isRequired,
      end: PropTypes.arrayOf(PropTypes.number).isRequired,
      isRailroad: PropTypes.bool,
    })
  ).isRequired,
  containerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};
