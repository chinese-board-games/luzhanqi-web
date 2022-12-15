import React from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div>
      <h1>陸戰棋 Luzhanqi</h1>
      <Link to="/game">Create Match</Link>
      <Link to="/game">Join/Rejoin Match</Link>
      <Button>Settings</Button>
    </div>
  );
}

export default Menu;
