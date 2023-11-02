/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import Piece from './Piece';

// eslint-disable-next-line react/prop-types
export default function DragablePiece({ name, affiliation, id, data, isEnglish }) {
  const { setNodeRef, attributes, listeners, transition, isDragging } = useDraggable({
    id,
    data,
  });
  const style = {
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    // transform: `scale(${isDragging ? '1.2' : '1'})`,
    // filter: isDragging ? `drop-shadow(0 0 0.75rem grey)` : ''
    filter: isDragging ? 'opacity(.8)' : '',
    zIndex: 100,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Piece name={name} affiliation={affiliation} isEnglish={isEnglish} />
    </div>
  );
}
