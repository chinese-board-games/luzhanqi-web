/* eslint-disable no-console */
import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import {
  uniqueNamesGenerator,
  animals,
  starWars,
} from "unique-names-generator";

const socket = io("localhost:4000");

function App() {
  /** debug message sent through socket on PORT */
  const [socketText, setSocketText] = useState("");

  /** user-input: the user's name */
  const defaultName = uniqueNamesGenerator({
    dictionaries: [animals, starWars],
    length: 2,
  });
  const [playerName, setPlayerName] = useState(defaultName);
  /** game ID assigned to host, or user-input: game Id entered by player */
  const [roomId, setRoomId] = useState("");
  /** value of countdown timer */
  // const [displayTimer, setDisplayTimer] = useState(false);
  // const [countdown, setCountdown] = useState(5);
  const [host, setHost] = useState(false);
  const [joinedGame, setJoinedGame] = useState(false);
  const [clientTurn, setClientTurn] = useState(-1);
  const [playerList, setPlayerList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [myBoard, setMyBoard] = useState(Array(12).fill(Array(5).fill(null)));
  const [myPositions, setMyPositions] = useState(
    Array(6).fill(Array(5).fill(null))
  );

  /**
   * Game phases:
   * 0: waiting
   * 1: placement
   * 2: gameplay
   */

  // eslint-disable-next-line no-unused-vars
  const [gamePhase, setGamePhase] = useState(0);

  const boardPositions = {};

  for (let j = 0; j < 6; j++) {
    for (let i = 0; i < 5; i++) {
      boardPositions[[j, i]] = "none";
    }
  }

  const [startingBoard, setStartingBoard] = useState(boardPositions);

  // const [startingBoard, setStartingBoard] = useState();
  const [error, setError] = useState("");

  /** Piece names for Luzhanqi */
  const pieces = useMemo(
    () => ({
      bomb: { count: 2, order: 0 },
      brigadier_general: { count: 2, order: 6 },
      captain: { count: 3, order: 3 },
      colonel: { count: 2, order: 5 },
      engineer: { count: 3, order: 1 },
      field_marshall: { count: 1, order: 9 },
      flag: { count: 1, order: 0 },
      general: { count: 1, order: 8 },
      landmine: { count: 3, order: 0 },
      lieutenant: { count: 3, order: 2 },
      major_general: { count: 2, order: 7 },
      major: { count: 2, order: 4 },
    }),
    []
  );

  useEffect(() => {
    if (playerList.length > 0) {
      let newHalf = Array(6).fill(null);
      newHalf = newHalf.map(() => new Array(5).fill(null));
      Object.entries(startingBoard).forEach(([pos, name]) => {
        const yX = pos.split(",").map((num) => parseInt(num, 10));
        // console.log(`y: ${yX[0]} x: ${yX[1]}, name: ${name}`);
        if (name !== "none") {
          newHalf[parseInt(yX[0], 10)][parseInt(yX[1], 10)] = {
            name,
            order: pieces[`${name}`].order,
            affiliation: playerList.indexOf(playerName),
          };
        }
      });
      setMyPositions(newHalf);
    }
  }, [startingBoard, pieces, playerList, playerName]);

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
      // setJoinRoomId(gameId);
      setPlayerList(players);
    });

    /** Server is telling all clients the game has started  */
    socket.on("beginNewGame", ({ mySocketId, gameId, turn }) => {
      console.log(`Starting game ${gameId} on socket ${mySocketId}`);
      // setDisplayTimer(true);
      setClientTurn(turn);
      setGamePhase(1);
    });

    /** Server is telling all clients someone has joined the room */
    socket.on("playerJoinedRoom", (data) => {
      console.log(`${data.playerName} has joined the room!`);
      setPlayerList(data.players);
    });

    /** Server is telling this socket that it has joined a room */
    socket.on("youHaveJoinedTheRoom", () => {
      setJoinedGame(true);
    });

    /** Server is sending the starting board with all placed pieces */
    socket.on("boardSetUp", ({ board }) => {
      setMyBoard(board);
      setGamePhase(2);
    });

    /** Server is telling all clients a move has been made */
    socket.on("playerMadeMove", (data) => {
      console.log("Move has been made", data);
      setClientTurn(data.turn);
    });

    /** Server is returning an error message to the client */
    socket.on("error", (errMsg) => {
      setError(errMsg);
    });

    return () => {
      socket.on("disconnect", () => {
        console.log(`SocketID: ${socket.id}`);
        console.log(`Connected: ${socket.connected}`);
      });
    };
  }, [roomId]);

  // useEffect(() => {
  //   if (displayTimer) {
  //     setInterval(() => {
  //       setCountdown((count) => count - 1);
  //     }, 1000);
  //   }
  // }, [displayTimer]);

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 5000);
  }, [error]);

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
      setError("You must provide a username.");
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
    if (playerName && roomId) {
      console.log(`Attempting to join game ${roomId} as ${playerName}`);
      // setJoinedGame(true);
      socket.emit("playerJoinGame", {
        playerName,
        joinRoomId: roomId,
        playerList,
      });
    } else {
      setError("You must provide both a game number and a player name.");
    }
  };

  /** Send the starting board to the server (my side) */
  const sendStartingBoard = (e) => {
    e.preventDefault();
    console.log("Sending board...");
    console.log(myPositions);
    socket.emit("playerInitialBoard", { playerName, myPositions });
  };

  /** Send a move to the server */
  const makeMove = (e) => {
    e.preventDefault();
    console.log("Making move...");
    socket.emit("makeMove", {
      playerName,
      gameId: roomId,
      turn: clientTurn,
    });
  };

  return (
    <div
      style={{
        margin: "2em",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "35em" }}>
        <div>
          {Object.keys(pieces).map((name) => (
            <img key={name} src={`pieces/${name}.svg`} alt={name} />
          ))}
        </div>

        {roomId ? <h1>{`Your game ID is: ${roomId}`}</h1> : null}

        <Form onSubmit={submitDebug}>
          <Form.Label>DANGER Emit to socket:</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Ex. makeMove"
            onChange={(e) => setSocketText(e.target.value)}
          />
          <br />
          <Button variant="danger" type="submit">
            Submit
          </Button>
        </Form>

        <h1>Players</h1>
        {playerList.map((name) => (
          <div key={name}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "5em",
                paddingBottom: "5em",
                paddingLeft: "2em",
                paddingRight: "2em",
                marginBottom: "1em",
                border: "0.5em solid red",
                borderRadius: "1em",
                width: "35em",
              }}
            >
              <h1>{name}</h1>
            </div>
          </div>
        ))}
        <br />
        {roomId ? null : (
          <Button
            type="button"
            onClick={createNewGame}
            style={{ width: "10em" }}
          >
            Create New Game
          </Button>
        )}

        {
          /** Players join the game */
          gamePhase === 0 ? (
            <>
              <h3>{joinedGame}</h3>
              {host ? (
                <Button
                  type="button"
                  variant="success"
                  onClick={roomFull}
                  style={{ width: "7em" }}
                >
                  Room Full
                </Button>
              ) : null}
              {host || joinedGame ? null : (
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
                      onChange={(e) => setRoomId(e.target.value)}
                    />
                    <br />
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </Form>
                </>
              )}
            </>
          ) : null
        }
        {/* {displayTimer && countdown > 0 ? <h1>{countdown}</h1> : null} */}
        {gamePhase === 1 ? (
          <>
            <h2>Frontier</h2>
            <Form
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "25em",
              }}
            >
              {Object.keys(startingBoard).map((pos) => (
                <Form.Group style={{ width: "5em" }} key={pos}>
                  <Form.Control
                    as="select"
                    size="sm"
                    value={startingBoard[pos]}
                    onChange={(e) =>
                      setStartingBoard({
                        ...startingBoard,
                        [pos]: e.target.value,
                      })
                    }
                  >
                    {Object.keys(pieces).map((piece) => (
                      <option key={piece}>{piece}</option>
                    ))}
                    <option>none</option>
                  </Form.Control>
                </Form.Group>
              ))}
            </Form>
            <Button type="button" variant="info" onClick={sendStartingBoard}>
              Send Board Placement
            </Button>
          </>
        ) : null}

        {gamePhase === 2 ? (
          <>
            <img src="board.svg" alt="board" />
            {(host && clientTurn % 2 === 0) ||
            (!host && clientTurn % 2 === 1) ? (
              <Button type="button" variant="primary" onClick={makeMove}>
                Make move
              </Button>
            ) : (
              <Button type="button" variant="secondary" onClick={makeMove}>
                Make move
              </Button>
            )}
          </>
        ) : null}

        {clientTurn > -1 ? <h1>The turn is {clientTurn}</h1> : null}

        {host ? <h1>You are the host</h1> : null}
        {error ? <Alert variant="danger">{error}</Alert> : null}
      </div>
    </div>
  );
}

export default App;
