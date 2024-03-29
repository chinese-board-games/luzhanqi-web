import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GameContext } from 'contexts/GameContext';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Container, TextInput } from '@mantine/core';
import { useFirebaseAuth } from 'contexts/FirebaseContext';
import { useForm } from '@mantine/form';
import { Title } from '@mantine/core';

function Menu({ joinedRoom = false, urlRoomId = '' }) {
  const {
    socket,
    playerName: { playerName },
    roomId: { setRoomId },
    host: { setHost },
    errors: { errors, setErrors },
  } = useContext(GameContext);

  const user = useFirebaseAuth();

  /** Clear errors after 1 second each */
  useEffect(() => {
    errors.forEach((error) => {
      toast.error(error, {
        toastId: `${Date.now()}`,
      });
    });
    setErrors([]);
  }, [JSON.stringify(errors), toast.error]);

  useEffect(() => {
    if (urlRoomId) {
      setRoomId(urlRoomId);
    }
  });

  const viewStyle = {
    backgroundColor: '#d0edf5',
    display: 'flex',
    flexDirection: 'column',
    padding: '1em 1em',
  };
  const stackStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em 0.5em',
  };
  const cardStyle = {
    backgroundColor: '#adcdff',
    padding: '1em',
    width: '20em',
    borderRadius: '0.5em',
    boxShadow: '0.3em 0.3em 0.1em #69a2ff',
  };
  const cardContentStyle = {
    display: 'flex',
    gap: '0.4em 0.4em',
  };
  const linkStyle = { color: 'white' };

  /** Tell the server to create a new game */
  const createNewGame = (name) => {
    if (name) {
      socket.emit('hostCreateNewGame', { playerName: name, hostId: user?.uid || null });
      setHost(true);
      // GameContext will redirect to /game when socket starts the game
    } else {
      setErrors((prevErrors) => [...prevErrors, 'You must provide a player name.']);
    }
  };

  /** Attempt to join a room by game ID */
  const joinGame = (playerName, roomId) => {
    if (playerName && roomId) {
      console.info(`Attempting to join game ${roomId} as ${playerName} with clientId ${user?.uid}`);
      socket.emit('playerJoinRoom', {
        playerName,
        clientId: user?.uid || null,
        joinRoomId: roomId,
      });
      setRoomId(roomId);
    } else {
      setErrors((prevErrors) => [
        ...prevErrors,
        'You must provide both a game number and a player name.',
      ]);
    }
  };

  const handleCreateSubmit = ({ playerName }) => {
    createNewGame(playerName);
    setErrors((prevErrors) => [...prevErrors, 'Unable to connect to server.']);
  };

  const handleJoinSubmit = ({ playerName, roomId }) => {
    joinGame(playerName, roomId);
    setErrors((prevErrors) => [...prevErrors, 'Unable to connect to server.']);
  };

  const CreateForm = () => {
    const createForm = useForm({
      initialValues: { playerName },
    });

    return (
      <Container style={cardStyle}>
        <Title order={3}>Host a New Game</Title>
        <form onSubmit={createForm.onSubmit(handleCreateSubmit)}>
          <TextInput
            label="Player name:"
            placeholder="Ex. Ian"
            {...createForm.getInputProps('playerName')}
          />
          <br />
          <Button variant="info" type="submit">
            Create Match
          </Button>
        </form>
      </Container>
    );
  };

  const JoinForm = ({ urlRoomId }) => {
    const joinForm = useForm({
      initialValues: {
        // these keys must match the input keys for joinGame
        playerName,
        roomId: urlRoomId,
      },
    });
    return (
      <Container style={cardStyle}>
        <Title order={3}>Join a Game</Title>
        <form onSubmit={joinForm.onSubmit(handleJoinSubmit)}>
          <TextInput
            label="Player name:"
            placeholder="Ex. Ian"
            {...joinForm.getInputProps('playerName')}
          />
          <TextInput
            label="Join game:"
            placeholder="Ex. 6543eb06e81d62019d596562"
            {...joinForm.getInputProps('roomId')}
            disabled={!!urlRoomId}
          />
          <br />
          <Button variant="info" type="submit">
            Submit
          </Button>
        </form>
      </Container>
    );
  };

  JoinForm.propTypes = {
    urlRoomId: PropTypes.string,
  };

  return (
    <>
      <Container style={viewStyle}>
        <Container style={stackStyle}>
          {joinedRoom ? null : <CreateForm />}
          <JoinForm urlRoomId={urlRoomId} />
          <Container style={cardStyle}>
            <Title order={3}>For developers</Title>
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
      </Container>
      <ToastContainer />
    </>
  );
}

Menu.propTypes = {
  joinedRoom: PropTypes.bool,
  urlRoomId: PropTypes.string,
};

export default Menu;
