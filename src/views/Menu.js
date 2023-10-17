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
          <Button>
            <Link to="/game" style={linkStyle}>
              Create Match
            </Link>
          </Button>
        </Container>
        <Container style={cardStyle}>
          <h2>Join an Existing Game</h2>
          <Button>
            <Link to="/game" style={linkStyle}>
              Join Match
            </Link>
          </Button>
        </Container>
        <Container style={cardStyle}>
          <h2>For Developers</h2>
          <Container style={cardContentStyle}>
            <Button>
              <Link to="/setup-test" style={linkStyle}>
                Test Setup
              </Link>
            </Button>
            <Button>
              <Link to="/gameboard-test" style={linkStyle}>
                Test New Board
              </Link>
            </Button>
          </Container>
        </Container>
      </Container>
    </div>
  );
}

export default Menu;
