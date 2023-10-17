/* eslint-disable no-console */
import React, { useContext } from 'react';
import { useForm } from '@mantine/form';
import { Button, TextInput, Container } from '@mantine/core';
import { GameContext } from 'contexts/GameContext';
import { useFirebaseAuth } from 'contexts/FirebaseContext';

const Lobby = () => {
  const gameState = useContext(GameContext);
  const { socket } = gameState;
  const { playerName } = gameState.playerName;
  const { roomId, setRoomId } = gameState.roomId;
  const { host, setHost } = gameState.host;
  const { joinedGame } = gameState.joinedGame;
  const { playerList } = gameState.playerList;
  const { setErrors } = gameState.errors;
  // const { storedPlayerName, setStoredPlayerName } = gameState.storedPlayerName;
  // const { storedRoomId, setStoredRoomId } = gameState.storedRoomId;
  // const { storedPlayerList, setStoredPlayerList } = gameState.storedPlayerList;
  const user = useFirebaseAuth();

  // const [rejoin, setRejoin] = useState(false);

  // useEffect(() => {
  //   setStoredPlayerName(window.sessionStorage.getItem('playerName'));
  //   setStoredRoomId(window.sessionStorage.getItem('roomId'));
  //   setStoredPlayerList(window.sessionStorage.getItem('playerList') || []);
  // }, []);

  // useEffect(() => {
  //   if (storedPlayerName && storedRoomId && storedPlayerList.length) {
  //     setRejoin(true);
  //   }
  //   return () => {
  //     setRejoin(false);
  //   };
  // }, [storedPlayerName, storedRoomId, storedPlayerList]);

  /** Tell the server to create a new game */
  const createNewGame = () => {
    if (playerName) {
      socket.emit('hostCreateNewGame', { playerName, hostId: user?.uid || null });
      setHost(true);
    } else {
      setErrors((prevErrors) => [...prevErrors, 'You must provide a username.']);
    }
  };

  /** Tell server to begin game */
  const roomFull = () => {
    socket.emit('hostRoomFull', roomId);
  };

  /** Attempt to join a game by game ID */
  const joinGame = ({ playerName, roomId }) => {
    if (playerName && roomId) {
      console.log(`Attempting to join game ${roomId} as ${playerName} with clientId ${user?.uid}`);
      socket.emit('playerJoinGame', {
        playerName,
        clientId: user?.uid || null,
        joinRoomId: roomId,
        playerList
      });
      setRoomId(roomId);
    } else {
      setErrors((prevErrors) => [
        ...prevErrors,
        'You must provide both a game number and a player name.'
      ]);
    }
  };

  // /** Attempt to rejoin a game by game ID */
  // const rejoinGame = (e) => {
  //   e.preventDefault();
  //   if (storedPlayerName && storedRoomId) {
  //     console.log(`Attempting to rejoin game ${roomId} as ${playerName}`);
  //     socket.emit('playerRejoinGame', {
  //       storedPlayerName,
  //       storedRoomId,
  //       storedPlayerList
  //     });
  //   } else {
  //     console.error('playerName and storedRoomId not stored, cannot rejoin game.');
  //   }
  // };

  const form = useForm({
    initialValues: {
      // these keys must match the input keys for joinGame
      playerName,
      roomId
    }
  });

  // eslint-disable-next-line no-unused-vars
  const handleError = (_errors) => {
    console.log('Form error handled serverside');
  };
  const handleSubmit = (values) => {
    joinGame(values);
  };
  return (
    <Container style={{ backgroundColor: '#d0edf5' }}>
      {
        /** There is no assigned room, give option to create room */
        roomId ? null : (
          <Button variant="success" onClick={createNewGame} style={{ width: '12em' }}>
            Create New Game
          </Button>
        )
      }

      {
        /** You have joined the game and are waiting for the host to start */
        joinedGame && !host ? (
          <>
            <h3>請等主持人</h3>
            <h3>Waiting for the host</h3>
          </>
        ) : null
      }

      {
        /** Give host ability to start game */
        host ? (
          <>
            <h3>按 &quot;Room Full&quot; 開始遊戲</h3>
            <h3>Click &quot;Room Full&quot; to begin the game</h3>
            <Button type="button" variant="success" onClick={roomFull} style={{ width: '8em' }}>
              Room Full
            </Button>
          </>
        ) : null
      }

      {
        /** Not host and haven't joined a game, give option to join game */
        host || joinedGame ? null : (
          <>
            {/* disabled until fully implemented */}
            {/* {rejoin ? (
              <Button variant="warning" onClick={rejoinGame}>
                Rejoin
              </Button>
            ) : null} */}
            {user ? (
              <>
                <h2>Hello {user.email}</h2>
              </>
            ) : (
              <div />
            )}
            <form onSubmit={form.onSubmit(handleSubmit, handleError)}>
              <TextInput
                label="Player name:"
                placeholder="Ex. Ian"
                {...form.getInputProps('playerName')}
              />
              <TextInput
                label="Join game:"
                placeholder="Ex. 12345"
                {...form.getInputProps('roomId')}
              />
              <br />
              <Button variant="info" type="submit">
                Submit
              </Button>
            </form>
          </>
        )
      }
    </Container>
  );
};

export default Lobby;
