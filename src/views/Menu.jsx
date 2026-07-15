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
  const createNewGame = (name, vsAi, aiSettings, rules) => {
    if (name) {
      setPlayerName(name);
      socket.emit('hostCreateNewGame', {
        playerName: name,
        hostId: user?.uid || null,
        // vsAi games skip the Lobby (where a human game's host would
        // otherwise set these), so rules must be sent at creation time
        gameConfig: vsAi ? { opponentType: 'ai', aiSettings, ...rules } : undefined,
      });
      setHost(true);
      // GameContext will redirect to /game when socket starts the game
    } else {
      setErrors((prevErrors) => [
        ...prevErrors,
        isEnglish ? 'You must provide a player name.' : '請輸入玩家名稱。',
      ]);
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
        isEnglish
          ? 'You must provide both a game number and a player name.'
          : '請同時輸入房間代碼和玩家名稱。',
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
        isEnglish
          ? 'You must provide both a game number and a spectator name.'
          : '請同時輸入房間代碼和觀眾名稱。',
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
        <Title order={3}>{isEnglish ? 'Host a New Game' : '建立新遊戲'}</Title>
        <form onSubmit={createForm.onSubmit(handleCreateSubmit)}>
          <Tabs defaultValue="basic" keepMounted={false}>
            <Tabs.List>
              <Tabs.Tab value="basic">{isEnglish ? 'Basic' : '基本'}</Tabs.Tab>
              {vsAi ? <Tabs.Tab value="rules">{isEnglish ? 'Rules' : '規則'}</Tabs.Tab> : null}
              {vsAi ? (
                <Tabs.Tab value="advanced">{isEnglish ? 'Advanced' : '進階'}</Tabs.Tab>
              ) : null}
            </Tabs.List>

            <Tabs.Panel value="basic" pt="sm">
              <TextInput
                label={isEnglish ? 'Player name:' : '玩家名稱：'}
                placeholder="Ex. Ian"
                {...createForm.getInputProps('playerName')}
              />
              <Checkbox
                mt="md"
                label={isEnglish ? 'Play against the computer' : '與電腦對戰'}
                {...createForm.getInputProps('vsAi', { type: 'checkbox' })}
              />
            </Tabs.Panel>

            {vsAi ? (
              <Tabs.Panel value="rules" pt="sm">
                <Checkbox
                  mt="md"
                  label={isEnglish ? 'Enable fog of war' : '啟用戰爭迷霧'}
                  {...createForm.getInputProps('fogOfWar', { type: 'checkbox' })}
                />
                <Checkbox
                  mt="sm"
                  label={
                    isEnglish
                      ? 'Landmines survive (only the attacker dies)'
                      : '地雷不會被摧毀（只有攻擊方陣亡）'
                  }
                  {...createForm.getInputProps('landminesSurvive', { type: 'checkbox' })}
                />
                <Checkbox
                  mt="sm"
                  label={
                    isEnglish
                      ? 'Flying bombs (bombs move like the Engineer)'
                      : '飛彈（炸彈可像工兵一樣轉彎移動）'
                  }
                  {...createForm.getInputProps('flyingBombs', { type: 'checkbox' })}
                />
                <Checkbox
                  mt="sm"
                  label={
                    isEnglish
                      ? 'Capture the flag (carry it back to your HQ to win)'
                      : '奪旗規則（需將軍旗帶回己方大本營才能獲勝）'
                  }
                  {...createForm.getInputProps('captureTheFlag', { type: 'checkbox' })}
                />
              </Tabs.Panel>
            ) : null}

            {vsAi ? (
              <Tabs.Panel value="advanced" pt="sm">
                <Text size="xs" c="dimmed" mb="sm">
                  {isEnglish ? 'Tune how the computer opponent plays.' : '調整電腦對手的下棋方式。'}
                </Text>
                <Text size="sm">{isEnglish ? 'Randomness' : '隨機性'}</Text>
                <Text size="xs" c="dimmed">
                  {isEnglish ? 'How unpredictable its moves are.' : '棋步的不可預測程度。'}
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
                  {isEnglish ? 'Positional drive' : '進攻傾向'}
                </Text>
                <Text size="xs" c="dimmed">
                  {isEnglish
                    ? 'How much it favors advancing toward your side over holding position.'
                    : '相較於固守陣地，電腦有多傾向向前推進。'}
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
                  {isEnglish ? 'Caution' : '謹慎程度'}
                </Text>
                <Text size="xs" c="dimmed">
                  {isEnglish
                    ? 'How strongly it avoids exposing valuable pieces to risk.'
                    : '電腦避免讓重要棋子暴露於風險中的程度。'}
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
                  {isEnglish ? 'Aggression' : '侵略性'}
                </Text>
                <Text size="xs" c="dimmed">
                  {isEnglish
                    ? 'How much extra value it places on capturing pieces.'
                    : '電腦對俘獲棋子賦予多少額外價值。'}
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
            {isEnglish ? 'Create Match' : '建立對局'}
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
        <Title order={3}>{isEnglish ? 'Join a Game' : '加入遊戲'}</Title>
        <form onSubmit={joinForm.onSubmit(handleJoinSubmit)}>
          <TextInput
            label={isEnglish ? 'Player name:' : '玩家名稱：'}
            placeholder="Ex. Ian"
            {...joinForm.getInputProps('playerName')}
          />
          <TextInput
            label={isEnglish ? 'Join game:' : '加入代碼：'}
            placeholder="Ex. 7K4X2P"
            {...joinForm.getInputProps('roomId')}
            disabled={!!urlRoomId}
          />
          <br />
          <Button variant="info" type="submit">
            {isEnglish ? 'Submit' : '送出'}
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
        <Title order={3}>{isEnglish ? 'Spectate a Game' : '觀戰遊戲'}</Title>
        <form onSubmit={spectateForm.onSubmit(handleSpectateSubmit)}>
          <TextInput
            label={isEnglish ? 'Spectator name:' : '觀眾名稱：'}
            placeholder="Ex. Ian"
            {...spectateForm.getInputProps('spectatorName')}
          />
          <TextInput
            label={isEnglish ? 'Spectate game:' : '觀戰代碼：'}
            placeholder="Ex. 7K4X2P"
            {...spectateForm.getInputProps('roomId')}
            disabled={!!urlRoomId}
          />
          <br />
          <Button variant="info" type="submit">
            {isEnglish ? 'Submit' : '送出'}
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
              <Title order={3}>{isEnglish ? 'Rejoin a Game' : '重新加入遊戲'}</Title>
              {activeGames.slice(0, 1).map((game) => (
                <Container key={game.gameId} style={cardContentStyle}>
                  <Text size="sm" style={{ flex: 1 }}>
                    {isEnglish
                      ? game.isAiGame
                        ? 'vs. Computer'
                        : `vs. ${game.opponentName}`
                      : game.isAiGame
                      ? '對戰電腦'
                      : `對戰 ${game.opponentName}`}
                  </Text>
                  <Link to={`/game/${game.gameId}`} style={linkStyle}>
                    <Button size="xs">{isEnglish ? 'Rejoin' : '重新加入'}</Button>
                  </Link>
                  <Button size="xs" variant="outline" onClick={() => handleArchive(game.gameId)}>
                    {isEnglish ? 'Archive' : '封存'}
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
