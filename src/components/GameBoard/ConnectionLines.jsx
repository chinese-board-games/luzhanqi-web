import LineTo from 'react-lineto';
import { isRailroad, boardConnections } from '../../utils/core';
import useWindowSize from 'hooks/useWindowSize';

export default function ConnectionLines() {
  useWindowSize(); // rerender on window resize for lines to update
  return (
    <>
      {boardConnections.map(({ start, end }) => {
        const isRailroadConnection = !!(
          isRailroad(start[0], start[1]) && isRailroad(end[0], end[1])
        );
        return (
          <LineTo
            key={`${start[0]}-${start[1]}-${end[0]}-${end[1]}`}
            from={`${start[0]}-${start[1]}`}
            to={`${end[0]}-${end[1]}`}
            borderColor={isRailroadConnection ? 'gray' : 'black'}
            borderWidth={isRailroadConnection ? 4 : 3}
            borderStyle={isRailroadConnection ? 'dashed' : 'solid'}
            toAnchor="center"
            delay={0}
          />
        );
      })}
    </>
  );
}
