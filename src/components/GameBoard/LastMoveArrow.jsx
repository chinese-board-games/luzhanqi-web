import LineTo from 'react-lineto';
import useWindowSize from 'hooks/useWindowSize';
import PropTypes from 'prop-types';

// draws a line between the last move's origin and destination cells, on
// top of the cell-tint highlight, so the move stays traceable even when it
// happens too fast to notice both cells changing color independently
export default function LastMoveArrow({ lastMove }) {
  useWindowSize(); // rerender on window resize for the line to update

  if (!lastMove) {
    return null;
  }

  const { source, target } = lastMove;
  return (
    <LineTo
      from={`${source[0]}-${source[1]}`}
      to={`${target[0]}-${target[1]}`}
      borderColor="darkorchid"
      borderWidth={5}
      borderStyle="solid"
      toAnchor="center"
      fromAnchor="center"
      zIndex={200}
      delay={0}
    />
  );
}

LastMoveArrow.propTypes = {
  lastMove: PropTypes.shape({
    source: PropTypes.arrayOf(PropTypes.number),
    target: PropTypes.arrayOf(PropTypes.number),
  }),
};
