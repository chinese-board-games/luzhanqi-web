import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GameContext } from 'contexts/GameContext';
import { Link } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Checkbox, Container, TextInput, Tabs, Slider, Text } from '@mantine/core';
import { useFirebaseAuth } from 'contexts/FirebaseContext';
import { useForm } from '@mantine/form';
import { Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import HelpButton from '../components/HelpButton';
import { archiveGame } from 'api/User';

const cardStyle = {
  backgroundColor: '#adcdff',
  padding: '1em',
  width: '20em',
  borderRadius: '0.5em',
  boxShadow: '0.3em 0.3em 0.1em #69a2ff',
};

function CreateForm({ playerName, onSubmit }) {
  const { t } = useTranslation('menu');
  const createForm = useForm({
    initialValues: {
      playerName,
      vsAi: false,
      // defaults must match DEFAULT_AI_WEIGHTS in the backend's aiConstants.ts
      randomness: 1.5,
      positionalDrive: 0.15,
      caution: 0.5,
      aggression: 1,
      // rule variants - defaults match createGame's resolvedConfig in the backend
      fogOfWar: true,
      landminesSurvive: false,
      flyingBombs: false,
      captureTheFlag: false,
    },
  });
  const vsAi = createForm.values.vsAi;

  return (
    <Container style={cardStyle}>
      <Title order={3}>{t('hostNewGame')}</Title>
      <form onSubmit={createForm.onSubmit(onSubmit)}>
        <Tabs defaultValue="basic" keepMounted={false}>
          <Tabs.List>
            <Tabs.Tab value="basic">{t('basic')}</Tabs.Tab>
            {vsAi ? <Tabs.Tab value="rules">{t('rules')}</Tabs.Tab> : null}
            {vsAi ? <Tabs.Tab value="advanced">{t('advanced')}</Tabs.Tab> : null}
          </Tabs.List>

          <Tabs.Panel value="basic" pt="sm">
            <TextInput
              label={t('playerNameLabel')}
              placeholder="Ex. Ian"
              {...createForm.getInputProps('playerName')}
            />
            <Checkbox
              mt="md"
              label={t('playAgainstComputer')}
              {...createForm.getInputProps('vsAi', { type: 'checkbox' })}
            />
          </Tabs.Panel>

          {vsAi ? (
            <Tabs.Panel value="rules" pt="sm">
              <Checkbox
                mt="md"
                label={t('enableFogOfWar')}
                {...createForm.getInputProps('fogOfWar', { type: 'checkbox' })}
              />
              <Checkbox
                mt="sm"
                label={t('landminesSurvive')}
                {...createForm.getInputProps('landminesSurvive', { type: 'checkbox' })}
              />
              <Checkbox
                mt="sm"
                label={t('flyingBombs')}
                {...createForm.getInputProps('flyingBombs', { type: 'checkbox' })}
              />
              <Checkbox
                mt="sm"
                label={t('captureTheFlag')}
                {...createForm.getInputProps('captureTheFlag', { type: 'checkbox' })}
              />
            </Tabs.Panel>
          ) : null}

          {vsAi ? (
            <Tabs.Panel value="advanced" pt="sm">
              <Text size="xs" c="dimmed" mb="sm">
                {t('tuneComputer')}
              </Text>
              <Text size="sm">{t('randomness')}</Text>
              <Text size="xs" c="dimmed">
                {t('randomnessHint')}
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
                {t('positionalDrive')}
              </Text>
              <Text size="xs" c="dimmed">
                {t('positionalDriveHint')}
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
                {t('caution')}
              </Text>
              <Text size="xs" c="dimmed">
                {t('cautionHint')}
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
                {t('aggression')}
              </Text>
              <Text size="xs" c="dimmed">
                {t('aggressionHint')}
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
          {t('createMatch')}
        </Button>
      </form>
    </Container>
  );
}

CreateForm.propTypes = {
  playerName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

function JoinForm({ playerName, urlRoomId, onSubmit }) {
  const { t } = useTranslation('menu');
  const joinForm = useForm({
    initialValues: {
      // these keys must match the input keys for handlejoinSubmit
      playerName,
      roomId: urlRoomId,
    },
  });
  return (
    <Container style={cardStyle}>
      <Title order={3}>{t('joinGame')}</Title>
      <form onSubmit={joinForm.onSubmit(onSubmit)}>
        <TextInput
          label={t('playerNameLabel')}
          placeholder="Ex. Ian"
          {...joinForm.getInputProps('playerName')}
        />
        <TextInput
          label={t('joinGameLabel')}
          placeholder="Ex. 7K4X2P"
          {...joinForm.getInputProps('roomId')}
          disabled={!!urlRoomId}
        />
        <br />
        <Button variant="info" type="submit">
          {t('submit')}
        </Button>
      </form>
    </Container>
  );
}

JoinForm.propTypes = {
  playerName: PropTypes.string.isRequired,
  urlRoomId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

function SpectateForm({ spectatorName, urlRoomId, onSubmit }) {
  const { t } = useTranslation('menu');
  const spectateForm = useForm({
    initialValues: {
      // these keys must match the input keys for handleSpectateSubmit
      spectatorName,
      roomId: urlRoomId,
    },
  });
  return (
    <Container style={cardStyle}>
      <Title order={3}>{t('spectateGame')}</Title>
      <form onSubmit={spectateForm.onSubmit(onSubmit)}>
        <TextInput
          label={t('spectatorNameLabel')}
          placeholder="Ex. Ian"
          {...spectateForm.getInputProps('spectatorName')}
        />
        <TextInput
          label={t('spectateGameLabel')}
          placeholder="Ex. 7K4X2P"
          {...spectateForm.getInputProps('roomId')}
          disabled={!!urlRoomId}
        />
        <br />
        <Button variant="info" type="submit">
          {t('submit')}
        </Button>
      </form>
    </Container>
  );
}

SpectateForm.propTypes = {
  spectatorName: PropTypes.string.isRequired,
  urlRoomId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

function Menu({ joinedRoom = false, urlRoomId = '' }) {
  const { t } = useTranslation('menu');
  const {
    socket,
    playerName: { playerName, setPlayerName },
    spectatorName: { spectatorName },
    roomId: { setRoomId },
    host: { setHost },
    errors: { errors, setErrors },
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

  // ask whether this logged-in account has other games worth rejoining -
  // notably covers logging in from a device with no local session for them
  useEffect(() => {
    if (!joinedRoom && user?.uid) {
      checkActiveGames(user);
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
  const cardContentStyle = {
    display: 'flex',
    gap: '0.4em 0.4em',
  };
  const linkStyle = { color: 'white' };

  /** Tell the server to create a new game */
  const createNewGame = async (name, vsAi, aiSettings, rules) => {
    if (name) {
      setPlayerName(name);
      socket.emit('hostCreateNewGame', {
        playerName: name,
        idToken: user ? await user.getIdToken() : null,
        // vsAi games skip the Lobby (where a human game's host would
        // otherwise set these), so rules must be sent at creation time
        gameConfig: vsAi ? { opponentType: 'ai', aiSettings, ...rules } : undefined,
      });
      setHost(true);
      // GameContext will redirect to /game when socket starts the game
    } else {
      setErrors((prevErrors) => [...prevErrors, t('provideNameError')]);
    }
  };

  /** Attempt to join a room by game ID */
  const playerJoinGame = async (name, roomId) => {
    if (name && roomId) {
      console.info(`Attempting to JOIN game ${roomId} as ${name}`);
      setPlayerName(name);
      socket.emit('playerJoinRoom', {
        playerName: name,
        idToken: user ? await user.getIdToken() : null,
        joinRoomId: roomId,
      });
      setRoomId(roomId);
    } else {
      setErrors((prevErrors) => [...prevErrors, t('provideRoomAndNameError')]);
    }
  };

  /** Attempt to spectate a room by game ID */
  const spectateGame = async (spectatorName, roomId) => {
    if (playerName && roomId) {
      console.info(`Attempting to SPECTATE game ${roomId} as ${spectatorName}`);
      socket.emit('spectateRoom', {
        spectatorName,
        idToken: user ? await user.getIdToken() : null,
        joinRoomId: roomId,
      });
      setRoomId(roomId);
    } else {
      setErrors((prevErrors) => [...prevErrors, t('provideRoomAndSpectatorError')]);
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
    fogOfWar,
    landminesSurvive,
    flyingBombs,
    captureTheFlag,
  }) => {
    createNewGame(
      playerName,
      vsAi,
      { randomness, positionalDrive, caution, aggression },
      { fogOfWar, landminesSurvive, flyingBombs, captureTheFlag }
    );
  };

  const handleJoinSubmit = ({ playerName, roomId }) => {
    playerJoinGame(playerName, roomId);
  };

  const handleSpectateSubmit = ({ spectatorName, roomId }) => {
    spectateGame(spectatorName, roomId);
  };

  return (
    <>
      <Container style={viewStyle}>
        <Container style={stackStyle}>
          {!joinedRoom && activeGames.length > 0 ? (
            <Container style={cardStyle}>
              <Title order={3}>{t('rejoinGame')}</Title>
              {activeGames.slice(0, 1).map((game) => (
                <Container key={game.gameId} style={cardContentStyle}>
                  <Text size="sm" style={{ flex: 1 }}>
                    {game.isAiGame ? t('vsComputer') : t('vsOpponent', { name: game.opponentName })}
                  </Text>
                  <Link to={`/game/${game.gameId}`} style={linkStyle}>
                    <Button size="xs">{t('rejoin')}</Button>
                  </Link>
                  <Button size="xs" variant="outline" onClick={() => handleArchive(game.gameId)}>
                    {t('archive')}
                  </Button>
                </Container>
              ))}
            </Container>
          ) : null}
          {joinedRoom ? null : <CreateForm playerName={playerName} onSubmit={handleCreateSubmit} />}
          <JoinForm playerName={playerName} urlRoomId={urlRoomId} onSubmit={handleJoinSubmit} />
          <SpectateForm
            spectatorName={spectatorName}
            urlRoomId={urlRoomId}
            onSubmit={handleSpectateSubmit}
          />
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
      <HelpButton gamePhase={0} />
      <ToastContainer />
    </>
  );
}

Menu.propTypes = {
  joinedRoom: PropTypes.bool,
  urlRoomId: PropTypes.string,
};

export default Menu;
