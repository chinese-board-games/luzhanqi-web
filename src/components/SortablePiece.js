/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Piece from './Piece';

// eslint-disable-next-line react/prop-types
export default function SortablePiece({ name, affiliation, id, isEnglish }) {
  const { attributes, listeners, setNodeRef, transition, transform } = useSortable({
    id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Piece name={name} affiliation={affiliation} isEnglish={isEnglish} />
    </div>
  );
}
