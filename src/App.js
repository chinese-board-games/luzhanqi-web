/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("localhost:4000");

function App() {
  // const [listOfImages, setImages] = useState([]);
  const [socketText, setSocketText] = useState("");
  const [roomId, setRoomId] = useState("");
  const [displayTimer, setDisplayTimer] = useState(false);
  const [countdown, setCountdown] = useState(5);

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

    socket.on("newGameCreated", ({ gameId, mySocketId }) => {
      console.log(`GameID: ${gameId}, SocketID: ${mySocketId}`);
      setRoomId(gameId);
    });

    // setImages(
    //   importAll(
    //     require.context("../public/pieces", false, /\.(png|jpe?g|svg)$/)
    //   )
    // );

    socket.on("beginNewGame", ({ mySocketId, gameId }) => {
      console.log(`Starting game ${gameId} on socket ${mySocketId}`);
      setDisplayTimer(true);
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

  const handleSubmit = (text) => {
    console.log(`emitting: ${text}`);
    socket.emit(text);
  };

  const createNewGame = () => {
    socket.emit("hostCreateNewGame");
  };

  const roomFull = () => {
    socket.emit("hostRoomFull", roomId);
  };

  const submit = (e) => {
    e.preventDefault();
    handleSubmit(socketText);
  };
  // console.log(`Game ID: ${roomId}`);
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
        <form onSubmit={submit}>
          <label>To socket:</label>
          <input
            type="text"
            name="name"
            onChange={(e) => setSocketText(e.target.value)}
          />
          <input type="submit" />
        </form>
        <button type="button" onClick={createNewGame}>
          Create New Game
        </button>
        <button type="button" onClick={roomFull}>
          Room Full
        </button>
        {displayTimer && countdown > 0 ? <h1>{countdown}</h1> : null}
        {countdown < 1 ? <img src="board.svg" alt="board" /> : null}
      </div>
    </>
  );
}

export default App;
