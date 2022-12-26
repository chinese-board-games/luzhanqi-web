/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Piece from './Piece';

// eslint-disable-next-line react/prop-types
export default function SortablePiece({ type, affiliation, id }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Piece type={type} affiliation={affiliation} />
    </div>
  );
}
