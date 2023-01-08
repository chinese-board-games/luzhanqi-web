/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import Piece from './Piece';

// eslint-disable-next-line react/prop-types
export default function SortablePiece({ name, affiliation, id }) {
  const { attributes, listeners, setNodeRef, transition } = useSortable({
    id
  });
  const style = {
    transition,
    cursor: 'grab'
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Piece name={name} affiliation={affiliation} />
    </div>
  );
}
