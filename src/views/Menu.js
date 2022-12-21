import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Link to="/game">Create Match</Link>
      <Link to="/game">Join/Rejoin Match</Link>
    </div>
  );
}

export default Menu;
