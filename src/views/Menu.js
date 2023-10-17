import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from '@mantine/core';

function Menu() {
  const viewStyle = {
    height: '100vh',
    backgroundColor: '#d0edf5',
    display: 'flex',
    flexDirection: 'column',
    padding: '1em 1em'
  };
  const stackStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em 0.5em'
  };
  const cardStyle = {
    backgroundColor: '#adcdff',
    padding: '1em',
    width: '20em',
    borderRadius: '0.5em',
    boxShadow: '0.3em 0.3em 0.1em #69a2ff'
  };
  const cardContentStyle = {
    display: 'flex',
    gap: '0.4em 0.4em'
  };
  const linkStyle = { color: 'white' };

  return (
    <div style={viewStyle}>
      <Container style={stackStyle}>
        <Container style={cardStyle}>
          <h2>Host a New Game</h2>
          <Link to="/game" style={linkStyle}>
            <Button>Create Match</Button>
          </Link>
        </Container>
        <Container style={cardStyle}>
          <h2>Join an Existing Game</h2>
          <Link to="/game" style={linkStyle}>
            <Button>Join Match</Button>
          </Link>
        </Container>
        <Container style={cardStyle}>
          <h2>For Developers</h2>
          <Container style={cardContentStyle}>
            <Link to="/setup-test" style={linkStyle}>
              <Button>Test Setup</Button>
            </Link>
            <Link to="/gameboard-test" style={linkStyle}>
              <Button>Test New Board</Button>
            </Link>
          </Container>
        </Container>
      </Container>
    </div>
  );
}

export default Menu;
