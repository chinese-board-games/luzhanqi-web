import { isRailroad, boardConnections } from '../../utils/core';
import BoardConnectionLines from '../BoardConnectionLines';
import PropTypes from 'prop-types';

export default function ConnectionLines({ containerRef }) {
  const connections = boardConnections.map(({ start, end }) => ({
    start,
    end,
    isRailroad: !!(isRailroad(start[0], start[1]) && isRailroad(end[0], end[1])),
  }));
  return <BoardConnectionLines connections={connections} containerRef={containerRef} />;
}

ConnectionLines.propTypes = {
  containerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};
