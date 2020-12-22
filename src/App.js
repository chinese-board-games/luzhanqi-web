/* eslint-disable no-shadow */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("localhost:4000");

function App() {
  // const [listOfImages, setImages] = useState([]);
  const [socketText, setSocketText] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [displayTimer, setDisplayTimer] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [host, setHost] = useState(false);
  const [turn, setTurn] = useState(-1);
  const [players, setPlayers] = useState([]);

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
  // function importAll(r) {
  //   return r.keys().map(r);
  // }

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`SocketID: ${socket.id}`);
      console.log(`Connected: ${socket.connected}`);
    });

    socket.on("newGameCreated", ({ gameId, mySocketId, players }) => {
      console.log(`GameID: ${gameId}, SocketID: ${mySocketId}`);
      setRoomId(gameId);
      setJoinRoomId(gameId);
      setPlayers(players);
      console.log(players);
    });

    // setImages(
    //   importAll(
    //     require.context("../public/pieces", false, /\.(png|jpe?g|svg)$/)
    //   )
    // );

    socket.on("beginNewGame", ({ mySocketId, gameId, turn }) => {
      console.log(`Starting game ${gameId} on socket ${mySocketId}`);
      setDisplayTimer(true);
      setTurn(turn);
    });

    // eslint-disable-next-line no-shadow
    socket.on("playerJoinedRoom", ({ playerName, players }) => {
      console.log(`${playerName} has joined the room!`);
      setPlayers(players);
      console.log(players);
    });

    socket.on("playerMadeMove", (data) => {
      console.log("Move has been made", data);
      setTurn(data.turn);
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

  const createNewGame = () => {
    if (playerName) {
      socket.emit("hostCreateNewGame", { playerName });
      setHost(true);
    } else {
      console.log("You must provide a playerName.");
    }
  };

  const roomFull = () => {
    socket.emit("hostRoomFull", roomId);
  };

  const submitDebug = (e) => {
    e.preventDefault();
    console.log(`emitting: ${socketText}`);
    socket.emit(socketText);
  };

  const joinGame = (e) => {
    e.preventDefault();
    console.log(`Attempting to join game ${joinRoomId} as ${playerName}`);
    socket.emit("playerJoinGame", { playerName, joinRoomId, players });
  };

  const makeMove = (e) => {
    e.preventDefault();
    console.log("Making move...");
    socket.emit("makeMove", { playerName, gameId: joinRoomId, turn });
  };

  return (
    <>
      <div>
        {/* {listOfImages.map((image, index) => (
          // console.log(image);
          <img key={`${index * 5}e`} src={image.default} alt="info" />
        ))} */}
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
        {turn}
        {(host && turn % 2 === 0) || (!host && turn % 2 === 1)
          ? "Your turn"
          : "Not your turn"}
        {host ? <h1>You are the host</h1> : null}
      </div>
    </>
  );
}

export default App;
