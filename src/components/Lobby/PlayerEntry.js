/* eslint-disable no-console */
import React, { useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { GameContext } from "../../GameContext";

const PlayerEntry = () => {
  const gameState = useContext(GameContext);
  const { socket } = gameState;
  const { playerName, setPlayerName } = gameState.playerName;
  const { roomId, setRoomId } = gameState.roomId;
  const { host, setHost } = gameState.host;
  const { joinedGame } = gameState.joinedGame;
  const { playerList } = gameState.playerList;
  const { setError } = gameState.error;

  /** Tell the server to create a new game */
  const createNewGame = () => {
    if (playerName) {
      socket.emit("hostCreateNewGame", { playerName });
      setHost(true);
    } else {
      setError("You must provide a username.");
    }
  };

  /** Tell server to begin game */
  const roomFull = () => {
    socket.emit("hostRoomFull", roomId);
  };

  /** Attempt to join a game by game ID */
  const joinGame = (e) => {
    e.preventDefault();
    if (playerName && roomId) {
      console.log(`Attempting to join game ${roomId} as ${playerName}`);
      socket.emit("playerJoinGame", {
        playerName,
        joinRoomId: roomId,
        playerList,
      });
    } else {
      setError("You must provide both a game number and a player name.");
    }
  };

  return (
    <>
      {
        /** There is no assigned room, give option to create room */
        roomId ? null : (
          <Button
            type="button"
            onClick={createNewGame}
            style={{ width: "10em" }}
          >
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
            <Button
              type="button"
              variant="success"
              onClick={roomFull}
              style={{ width: "7em" }}
            >
              Room Full
            </Button>
          </>
        ) : null
      }

      {
        /** Not host and haven't joined a game, give option to join game */
        host || joinedGame ? null : (
          <>
            <Form onSubmit={joinGame}>
              <Form.Label>Player name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Ex. Ian"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <Form.Label>Join game:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Ex. 12345"
                onChange={(e) => setRoomId(e.target.value.toString())}
              />
              <br />
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </>
        )
      }
    </>
  );
};

export default PlayerEntry;
