import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import Piece from './Piece';
import PropTypes from 'prop-types';

export default function DraggablePiece({ name, affiliation, id, data, isEnglish }) {
  const { setNodeRef, attributes, listeners, transition, isDragging } = useDraggable({
    id,
    data,
  });
  const style = {
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    filter: isDragging ? 'opacity(.8)' : '',
    zIndex: 100,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Piece name={name} affiliation={affiliation} isEnglish={isEnglish} />
    </div>
  );
}

DraggablePiece.propTypes = {
  name: PropTypes.string.isRequired,
  affiliation: PropTypes.number.isRequired,
  id: PropTypes.string,
  data: PropTypes.object,
  isEnglish: PropTypes.bool.isRequired,
};
