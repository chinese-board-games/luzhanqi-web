import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GameContext } from 'contexts/GameContext';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Checkbox, Container, TextInput, Tabs, Slider, Text } from '@mantine/core';
import { useFirebaseAuth } from 'contexts/FirebaseContext';
import { useForm } from '@mantine/form';
import { Title } from '@mantine/core';
import HelpButton from '../components/HelpButton';
import { archiveGame } from 'api/User';

function Menu({ joinedRoom = false, urlRoomId = '' }) {
  const {
    socket,
    playerName: { playerName, setPlayerName },
    spectatorName: { spectatorName },
    roomId: { setRoomId },
    host: { setHost },
    errors: { errors, setErrors },
    isEnglish: { isEnglish },
    activeGames: { activeGames, setActiveGames },
    checkActiveGames,
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

  // only on the real landing page (not the in-game "join" fallback form),
  // ask whether this logged-in account has other games worth rejoining -
  // notably covers logging in from a device with no local session for them
  useEffect(() => {
    if (!joinedRoom && user?.uid) {
      checkActiveGames(user.uid);
    }
  }, [joinedRoom, user?.uid]);

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
  const createNewGame = (name, vsAi, aiSettings) => {
    if (name) {
      setPlayerName(name);
      socket.emit('hostCreateNewGame', {
        playerName: name,
        hostId: user?.uid || null,
        gameConfig: vsAi ? { opponentType: 'ai', aiSettings } : undefined,
      });
      setHost(true);
      // GameContext will redirect to /game when socket starts the game
    } else {
      setErrors((prevErrors) => [...prevErrors, 'You must provide a player name.']);
    }
  };

  /** Attempt to join a room by game ID */
  const playerJoinGame = (name, roomId) => {
    if (name && roomId) {
      console.info(`Attempting to JOIN game ${roomId} as ${name} with clientId ${user?.uid}`);
      setPlayerName(name);
      socket.emit('playerJoinRoom', {
        playerName: name,
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

  /** Attempt to spectate a room by game ID */
  const spectateGame = (spectatorName, roomId) => {
    if (playerName && roomId) {
      console.info(
        `Attempting to SPECTATE game ${roomId} as ${spectatorName} with clientId ${user?.uid}`
      );
      socket.emit('spectateRoom', {
        spectatorName,
        clientId: user?.uid || null,
        joinRoomId: roomId,
      });
      setRoomId(roomId);
    } else {
      setErrors((prevErrors) => [
        ...prevErrors,
        'You must provide both a game number and a spectator name.',
      ]);
    }
  };

  /** Dismiss the rejoin prompt for a game without forcing the user to
   * rejoin (and maybe forfeit) just to get rid of the notification. */
  const handleArchive = async (gameId) => {
    if (!user?.uid) return;
    await archiveGame(user.uid, gameId);
    setActiveGames((prev) => prev.filter((g) => g.gameId !== gameId));
  };

  const handleCreateSubmit = ({
    playerName,
    vsAi,
    randomness,
    positionalDrive,
    caution,
    aggression,
  }) => {
    createNewGame(playerName, vsAi, { randomness, positionalDrive, caution, aggression });
  };

  const handleJoinSubmit = ({ playerName, roomId }) => {
    playerJoinGame(playerName, roomId);
  };

  const handleSpectateSubmit = ({ spectatorName, roomId }) => {
    spectateGame(spectatorName, roomId);
  };

  const CreateForm = () => {
    const createForm = useForm({
      initialValues: {
        playerName,
        vsAi: false,
        // defaults must match DEFAULT_AI_WEIGHTS in the backend's aiConstants.ts
        randomness: 1.5,
        positionalDrive: 0.15,
        caution: 0.5,
        aggression: 1,
      },
    });
    const vsAi = createForm.values.vsAi;

    return (
      <Container style={cardStyle}>
        <Title order={3}>Host a New Game</Title>
        <form onSubmit={createForm.onSubmit(handleCreateSubmit)}>
          <Tabs defaultValue="basic" keepMounted={false}>
            <Tabs.List>
              <Tabs.Tab value="basic">Basic</Tabs.Tab>
              {vsAi ? <Tabs.Tab value="advanced">Advanced</Tabs.Tab> : null}
            </Tabs.List>

            <Tabs.Panel value="basic" pt="sm">
              <TextInput
                label="Player name:"
                placeholder="Ex. Ian"
                {...createForm.getInputProps('playerName')}
              />
              <Checkbox
                mt="md"
                label="Play against the computer"
                {...createForm.getInputProps('vsAi', { type: 'checkbox' })}
              />
            </Tabs.Panel>

            {vsAi ? (
              <Tabs.Panel value="advanced" pt="sm">
                <Text size="xs" c="dimmed" mb="sm">
                  Tune how the computer opponent plays.
                </Text>
                <Text size="sm">Randomness</Text>
                <Text size="xs" c="dimmed">
                  How unpredictable its moves are.
                </Text>
                <Slider
                  min={0}
                  max={3}
                  step={0.1}
                  label={(v) => v.toFixed(1)}
                  value={createForm.values.randomness}
                  onChange={(v) => createForm.setFieldValue('randomness', v)}
                />
                <Text size="sm" mt="md">
                  Positional drive
                </Text>
                <Text size="xs" c="dimmed">
                  How much it favors advancing toward your side over holding position.
                </Text>
                <Slider
                  min={0}
                  max={0.5}
                  step={0.01}
                  label={(v) => v.toFixed(2)}
                  value={createForm.values.positionalDrive}
                  onChange={(v) => createForm.setFieldValue('positionalDrive', v)}
                />
                <Text size="sm" mt="md">
                  Caution
                </Text>
                <Text size="xs" c="dimmed">
                  How strongly it avoids exposing valuable pieces to risk.
                </Text>
                <Slider
                  min={0}
                  max={2}
                  step={0.1}
                  label={(v) => v.toFixed(1)}
                  value={createForm.values.caution}
                  onChange={(v) => createForm.setFieldValue('caution', v)}
                />
                <Text size="sm" mt="md">
                  Aggression
                </Text>
                <Text size="xs" c="dimmed">
                  How much extra value it places on capturing pieces.
                </Text>
                <Slider
                  min={0}
                  max={3}
                  step={0.1}
                  label={(v) => v.toFixed(1)}
                  value={createForm.values.aggression}
                  onChange={(v) => createForm.setFieldValue('aggression', v)}
                />
              </Tabs.Panel>
            ) : null}
          </Tabs>
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
        // these keys must match the input keys for handlejoinSubmit
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

  const SpectateForm = ({ urlRoomId }) => {
    const spectateForm = useForm({
      initialValues: {
        // these keys must match the input keys for handleSpectateSubmit
        spectatorName,
        roomId: urlRoomId,
      },
    });
    return (
      <Container style={cardStyle}>
        <Title order={3}>Spectate a Game</Title>
        <form onSubmit={spectateForm.onSubmit(handleSpectateSubmit)}>
          <TextInput
            label="Spectator name:"
            placeholder="Ex. Ian"
            {...spectateForm.getInputProps('spectatorName')}
          />
          <TextInput
            label="Spectate game:"
            placeholder="Ex. 6543eb06e81d62019d596562"
            {...spectateForm.getInputProps('roomId')}
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

  return (
    <>
      <Container style={viewStyle}>
        <Container style={stackStyle}>
          {!joinedRoom && activeGames.length > 0 ? (
            <Container style={cardStyle}>
              <Title order={3}>Rejoin a Game</Title>
              {activeGames.slice(0, 1).map((game) => (
                <Container key={game.gameId} style={cardContentStyle}>
                  <Text size="sm" style={{ flex: 1 }}>
                    {game.isAiGame ? 'vs. Computer' : `vs. ${game.opponentName}`}
                  </Text>
                  <Link to={`/game/${game.gameId}`} style={linkStyle}>
                    <Button size="xs">Rejoin</Button>
                  </Link>
                  <Button size="xs" variant="outline" onClick={() => handleArchive(game.gameId)}>
                    Archive
                  </Button>
                </Container>
              ))}
            </Container>
          ) : null}
          {joinedRoom ? null : <CreateForm />}
          <JoinForm urlRoomId={urlRoomId} />
          <SpectateForm urlRoomId={urlRoomId} />
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
      <HelpButton gamePhase={0} isEnglish={isEnglish} />
      <ToastContainer />
    </>
  );
}

Menu.propTypes = {
  joinedRoom: PropTypes.bool,
  urlRoomId: PropTypes.string,
};

export default Menu;
