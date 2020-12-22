/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("localhost:4000");

function App() {
  /** debug message sent through socket on PORT */
  const [socketText, setSocketText] = useState("");
  /** user-input: game ID to join */
  const [joinRoomId, setJoinRoomId] = useState("");
  /** user-input: the user's name */
  const [playerName, setPlayerName] = useState("");
  /** game ID assigned to host */
  const [roomId, setRoomId] = useState("");
  /** value of countdown timer */
  const [displayTimer, setDisplayTimer] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [host, setHost] = useState(false);
  const [clientTurn, setClientTurn] = useState(-1);
  const [playerList, setPlayerList] = useState([]);

  /** Piece names for Luzhanqi */
  const pieces = [
    "bomb",
    "brigadier_general",
    "captain",
    "colonel",
    "engineer",
    "field_marshall",
    "flag",
    "general",
    "landmine",
    "lieutenant",
    "major_general",
    "major",
  ];

  /**
   * Socket handlers receive headers and data from SocketIO connection
   * Function on second parameter handles socket call parameters
   */
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`SocketID: ${socket.id}`);
      console.log(`Connected: ${socket.connected}`);
    });

    /** Server has created a new game, only host receives this message */
    socket.on("newGameCreated", ({ gameId, mySocketId, players }) => {
      console.log(`GameID: ${gameId}, SocketID: ${mySocketId}`);
      setRoomId(gameId);
      setJoinRoomId(gameId);
      setPlayerList(players);
      console.log(players);
    });

    /** Server is telling all clients the game has started  */
    socket.on("beginNewGame", ({ mySocketId, gameId, turn }) => {
      console.log(`Starting game ${gameId} on socket ${mySocketId}`);
      setDisplayTimer(true);
      setClientTurn(turn);
    });

    /** Server is telling all clients someone has joined the room */
    // eslint-disable-next-line no-shadow
    socket.on("playerJoinedRoom", ({ playerName, players }) => {
      console.log(`${playerName} has joined the room!`);
      setPlayerList(players);
      console.log(players);
    });

    /** Server is telling all clients a move has been made */
    socket.on("playerMadeMove", (data) => {
      console.log("Move has been made", data);
      setClientTurn(data.turn);
    });

    return () => {
      socket.on("disconnect", () => {
        console.log(`SocketID: ${socket.id}`);
        console.log(`Connected: ${socket.connected}`);
      });
    };
  }, [roomId]);

  useEffect(() => {
    if (displayTimer) {
      setInterval(() => {
        setCountdown((count) => count - 1);
      }, 1000);
    }
  }, [displayTimer]);

  /**
   * Functions act as services to the SocketIO instance
   * Socket emmissions are headers followed by a data object
   */

  /** Tell the server to create a new game */
  const createNewGame = () => {
    if (playerName) {
      socket.emit("hostCreateNewGame", { playerName });
      setHost(true);
    } else {
      console.log("You must provide a playerName.");
    }
  };

  /** Tell server to begin game */
  const roomFull = () => {
    socket.emit("hostRoomFull", roomId);
  };

  /** Send debug message to server */
  const submitDebug = (e) => {
    e.preventDefault();
    console.log(`emitting: ${socketText}`);
    socket.emit(socketText);
  };

  /** Attempt to join a game by game ID */
  const joinGame = (e) => {
    e.preventDefault();
    console.log(`Attempting to join game ${joinRoomId} as ${playerName}`);
    socket.emit("playerJoinGame", { playerName, joinRoomId, playerList });
  };

  /** Send a move to the server */
  const makeMove = (e) => {
    e.preventDefault();
    console.log("Making move...");
    socket.emit("makeMove", { playerName, gameId: joinRoomId, clientTurn });
  };

  return (
    <div>
      {pieces.map((name) => (
        <img key={name} src={`pieces/${name}.svg`} alt={name} />
      ))}

      {roomId ? <h1>{`Your game ID is: ${roomId}`}</h1> : null}
      <form onSubmit={submitDebug}>
        <label>To socket:</label>
        <input
          type="text"
          name="name"
          onChange={(e) => setSocketText(e.target.value)}
        />
        <input type="submit" />
      </form>

      <form>
        <label>Player name:</label>
        <input
          type="text"
          name="name"
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </form>

      <form onSubmit={joinGame}>
        <label>Join game:</label>
        <input
          type="text"
          name="name"
          onChange={(e) => setJoinRoomId(e.target.value)}
        />
        <input type="submit" />
      </form>

      {roomId ? null : (
        <button type="button" onClick={createNewGame}>
          Create New Game
        </button>
      )}

      <button type="button" onClick={roomFull}>
        Room Full
      </button>
      {displayTimer && countdown > 0 ? <h1>{countdown}</h1> : null}
      {countdown < 1 ? <img src="board.svg" alt="board" /> : null}
      <button type="button" onClick={makeMove}>
        Make move
      </button>
      {clientTurn}
      {(host && clientTurn % 2 === 0) || (!host && clientTurn % 2 === 1)
        ? "Your turn"
        : "Not your turn"}
      {host ? <h1>You are the host</h1> : null}
    </div>
  );
}

export default App;
