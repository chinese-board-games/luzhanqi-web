/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";
import { isEqual } from "lodash";
import Piece, { pieces } from "./util/piece";

// const socket = io("localhost:4000");
const socket = io("https://luzhanqi.herokuapp.com/");

function App() {
  /** debug message sent through socket on PORT */
  // const [socketText, setSocketText] = useState("");

  /** user-input: the user's name */
  const defaultName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
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
  const [submittedSide, setSubmittedSide] = useState(false);
  const [pendingMove, setPendingMove] = useState({
    source: [],
    target: [],
  });

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

  useEffect(() => {
    if (playerList.length > 0) {
      let newHalf = Array(6).fill(null);
      newHalf = newHalf.map(() => new Array(5).fill(null));
      Object.entries(startingBoard).forEach(([pos, name]) => {
        const yX = pos.split(",").map((num) => parseInt(num, 10));
        if (name !== "none") {
          newHalf[parseInt(yX[0], 10)][parseInt(yX[1], 10)] = Piece(
            name,
            playerList.indexOf(playerName)
          );
        }
      });
      setMyPositions(newHalf);
    }
  }, [startingBoard, playerList, playerName]);

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
    socket.on("boardSet", (game) => {
      setMyBoard(game.board);
      setGamePhase(2);
    });

    socket.on("halfBoardReceived", () => {
      setSubmittedSide(true);
    });

    /** Server is telling all clients a move has been made */
    socket.on("playerMadeMove", (data) => {
      console.log("Move has been made", data);
      setClientTurn(data.turn);
      setMyBoard(data.board);
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

  // /** Send debug message to server */
  // const submitDebug = (e) => {
  //   e.preventDefault();
  //   console.log(`emitting: ${socketText}`);
  //   socket.emit(socketText);
  // };

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
    socket.emit("playerInitialBoard", {
      playerName,
      myPositions,
      room: roomId,
    });
  };

  /** Send a move to the server */
  const makeMove = (e) => {
    e.preventDefault();
    if (pendingMove.source.length > 0 && pendingMove.target.length) {
      socket.emit("makeMove", {
        playerName,
        room: roomId,
        turn: clientTurn,
        pendingMove,
      });
    } else {
      setError("You must have both a source and target tile");
    }

    setPendingMove({ source: [], target: [] });
  };

  const setMove = (y, x) => {
    if (pendingMove.source.length > 0) {
      console.log(pendingMove.source);
      const sourcePiece = myBoard[pendingMove.source[0]][pendingMove.source[1]];
      if (
        isEqual(pendingMove.source, [y, x]) ||
        (myBoard[y][x] && myBoard[y][x].affiliation === sourcePiece.affiliation)
      ) {
        setPendingMove({
          source: [],
          target: [],
        });
      } else {
        setPendingMove((prevState) => ({ ...prevState, target: [y, x] }));
      }
    } else if (
      myBoard[y][x] !== null &&
      myBoard[y][x].affiliation === playerList.indexOf(playerName)
    ) {
      setPendingMove({ source: [y, x], target: [] });
    }
  };

  const setExampleOne = () => {
    const example1 = [
      ["major_general", "lieutenant", "colonel", "engineer", "major_general"],
      ["engineer", "none", "field_marshall", "none", "engineer"],
      ["colonel", "lieutenant", "none", "bomb", "major"],
      ["brigadier_general", "none", "brigadier_general", "none", "lieutenant"],
      ["bomb", "landmine", "general", "captain", "captain"],
      ["landmine", "flag", "major", "landmine", "captain"],
    ];

    const exampleBoard = {};
    example1.forEach((row, y) => {
      row.forEach((pieceName, x) => {
        const pos = [y, x];
        exampleBoard[pos] = pieceName;
      });
    });
    setStartingBoard(exampleBoard);
  };

  console.log(myBoard);
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
        <h1>陸戰棋 Luzhanqi</h1>
        {roomId ? <h1>{`Your game ID is: ${roomId}`}</h1> : null}

        {/* <Form onSubmit={submitDebug}>
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
        </Form> */}

        {playerList.length > 0 ? <h2>Players</h2> : null}

        <div style={{ display: "flex", flexDirection: "row" }}>
          {playerList.map((name) => (
            <div
              key={name}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "0.5em",
                paddingBottom: "0.5em",
                paddingLeft: "0.5em",
                paddingRight: "0.5em",
                margin: "0.5em",
                border: "0.2em solid green",
                borderRadius: "0.5em",
              }}
            >
              <h5 style={{ fontWeight: "bold", margin: 0 }}>{name}</h5>
            </div>
          ))}
        </div>
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
                <>
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
                      onChange={(e) => setRoomId(e.target.value.toString())}
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
        {gamePhase === 1 && !submittedSide ? (
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
            <Button type="button" variant="secondary" onClick={setExampleOne}>
              Set Example 1
            </Button>
            <Button type="button" variant="info" onClick={sendStartingBoard}>
              Send Board Placement
            </Button>
          </>
        ) : null}

        {submittedSide && gamePhase === 1 ? (
          <h2>Waiting for other player</h2>
        ) : null}

        {gamePhase === 2 ? (
          <>
            <svg
              style={{ position: "absolute", width: "582px" }}
              viewBox="0 0 582 1006"
            >
              <g>
                <rect
                  style={{ fill: "none" }}
                  x="12%"
                  y="5%"
                  width="76%"
                  height="90%"
                  stroke="black"
                  strokeWidth="0.25em"
                />
                <line
                  x1="50%"
                  y1="5%"
                  x2="50%"
                  y2="95%"
                  stroke="black"
                  strokeWidth="0.25em"
                />
                <g>
                  <circle
                    style={{ fill: "white" }}
                    cx="50%"
                    cy="26.65%"
                    r={45}
                  />
                  <text
                    fontSize={35}
                    x="50%"
                    y="26.65%"
                    textAnchor="middle"
                    stroke="black"
                    strokeWidth="0.5px"
                    dy=".3em"
                  >
                    行營
                  </text>
                </g>

                <g>
                  <circle
                    style={{ fill: "white" }}
                    cx="31%"
                    cy="19.45%"
                    r={45}
                  />
                  <text
                    fontSize={35}
                    x="31%"
                    y="19.45%"
                    textAnchor="middle"
                    stroke="black"
                    strokeWidth="0.5px"
                    dy=".3em"
                  >
                    行營
                  </text>
                </g>
                <g>
                  <circle
                    style={{ fill: "white" }}
                    cx="69%"
                    cy="19.45%"
                    r={45}
                  />
                  <text
                    fontSize={35}
                    x="69%"
                    y="19.45%"
                    textAnchor="middle"
                    stroke="black"
                    strokeWidth="0.5px"
                    dy=".3em"
                  >
                    行營
                  </text>
                </g>

                <g>
                  <circle
                    style={{ fill: "white" }}
                    cx="31%"
                    cy="33.75%"
                    r={45}
                  />
                  <text
                    fontSize={35}
                    x="31%"
                    y="33.75%"
                    textAnchor="middle"
                    stroke="black"
                    strokeWidth="0.5px"
                    dy=".3em"
                  >
                    行營
                  </text>
                </g>
                <g>
                  <circle
                    style={{ fill: "white" }}
                    cx="69%"
                    cy="33.75%"
                    r={45}
                  />
                  <text
                    fontSize={35}
                    x="69%"
                    y="33.75%"
                    textAnchor="middle"
                    stroke="black"
                    strokeWidth="0.5px"
                    dy=".3em"
                  >
                    行營
                  </text>
                </g>

                <g>
                  <circle
                    style={{ fill: "white" }}
                    cx="50%"
                    cy="73.35%"
                    r={45}
                  />
                  <text
                    fontSize={35}
                    x="50%"
                    y="73.35%"
                    textAnchor="middle"
                    stroke="black"
                    strokeWidth="0.5px"
                    dy=".3em"
                  >
                    行營
                  </text>
                </g>

                <g>
                  <circle
                    style={{ fill: "white" }}
                    cx="31%"
                    cy="80.55%"
                    r={45}
                  />
                  <text
                    fontSize={35}
                    x="31%"
                    y="80.55%"
                    textAnchor="middle"
                    stroke="black"
                    strokeWidth="0.5px"
                    dy=".3em"
                  >
                    行營
                  </text>
                </g>
                <g>
                  <circle
                    style={{ fill: "white" }}
                    cx="69%"
                    cy="80.55%"
                    r={45}
                  />
                  <text
                    fontSize={35}
                    x="69%"
                    y="80.55%"
                    textAnchor="middle"
                    stroke="black"
                    strokeWidth="0.5px"
                    dy=".3em"
                  >
                    行營
                  </text>
                </g>

                <g>
                  <circle
                    style={{ fill: "white" }}
                    cx="31%"
                    cy="66.25%"
                    r={45}
                  />
                  <text
                    fontSize={35}
                    x="31%"
                    y="66.25%"
                    textAnchor="middle"
                    stroke="black"
                    strokeWidth="0.5px"
                    dy=".3em"
                  >
                    行營
                  </text>
                </g>
                <g>
                  <circle
                    style={{ fill: "white" }}
                    cx="69%"
                    cy="66.25%"
                    r={45}
                  />
                  <text
                    fontSize={35}
                    x="69%"
                    y="66.25%"
                    textAnchor="middle"
                    stroke="black"
                    strokeWidth="0.5px"
                    dy=".3em"
                  >
                    行營
                  </text>
                </g>
              </g>
            </svg>
            <div
              style={{
                backgroundColor: "#4F7276",
                display: "inline-flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "1em",
              }}
            >
              {myBoard.slice(0, 6).map((row, y) => (
                <div
                  key={`game_row_${y + 1}`}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    zIndex: 0,
                  }}
                >
                  {row.map((piece, x) => (
                    <div
                      key={`game_piece_${[y + 1, x + 1]}`}
                      role="button"
                      onClick={() => setMove(y, x)}
                      onKeyDown={() => {}}
                      tabIndex={0}
                      style={{ margin: "1em" }}
                    >
                      {piece === null ? (
                        <img
                          key={`game_blank_${[y + 1, x + 1]}`}
                          src="pieces/blank.svg"
                          alt="blank"
                        />
                      ) : (
                        <img
                          key={`game_piece_image_${[y + 1, x + 1]}`}
                          src={
                            playerList.indexOf(playerName) === piece.affiliation
                              ? `pieces/${piece.name}.svg`
                              : `pieces/enemy/${piece.name}_enemy.svg`
                          }
                          alt={piece.name}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
              {/* <h3>Mountain pass</h3> */}
              <svg viewBox="0 0 100 20">
                {/* <line x1={10} y1="0" x2={10} y2={20} stroke="black" />
                <line x1={50} y1="0" x2={50} y2={20} stroke="black" />
                <line x1={90} y1="0" x2={90} y2={20} stroke="black" /> */}

                <g>
                  <rect
                    style={{ fill: "black" }}
                    x="2.5%"
                    y="18%"
                    width="15%"
                    height="60%"
                    stroke="black"
                    strokeWidth="0.05em"
                  />
                  <text
                    fontSize={5}
                    x="5%"
                    y="24%"
                    textAnchor="middle"
                    stroke="white"
                    strokeWidth="0.3px"
                    dy="1.3em"
                    dx="1em"
                  >
                    前站
                  </text>
                </g>

                <g>
                  <rect
                    style={{ fill: "black" }}
                    x="82.5%"
                    y="18%"
                    width="15%"
                    height="60%"
                    stroke="black"
                    strokeWidth="0.05em"
                  />
                  <text
                    fontSize={5}
                    x="85%"
                    y="24%"
                    textAnchor="middle"
                    stroke="white"
                    strokeWidth="0.3px"
                    dy="1.3em"
                    dx="1em"
                  >
                    前站
                  </text>
                </g>

                <g>
                  <circle cx={30} cy={10} r={8} fill="red" />
                  <text
                    fontSize={7}
                    x="30%"
                    y="50%"
                    textAnchor="middle"
                    stroke="white"
                    strokeWidth="0.5px"
                    dy=".3em"
                  >
                    山界
                  </text>
                </g>
                <g>
                  <circle cx={70} cy={10} r={8} fill="red" />
                  <text
                    fontSize={7}
                    x="70%"
                    y="50%"
                    textAnchor="middle"
                    stroke="white"
                    strokeWidth="0.5px"
                    dy=".3em"
                  >
                    山界
                  </text>
                </g>
              </svg>
              {myBoard.slice(6).map((row, y) => (
                <div
                  key={`game_row_${y + 7}`}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",
                    zIndex: 0,
                  }}
                >
                  {row.map((piece, x) => (
                    <div
                      key={`game_piece_${[y + 7, x + 1]}`}
                      role="button"
                      onClick={() => setMove(y + 6, x)}
                      onKeyDown={() => {}}
                      tabIndex={0}
                      style={{ margin: "1em" }}
                    >
                      {piece === null ? (
                        <img
                          key={`game_blank_${[y + 7, x + 1]}`}
                          src="pieces/blank.svg"
                          alt="blank"
                        />
                      ) : (
                        <img
                          key={`game_piece_image_${[y + 7, x + 1]}`}
                          src={
                            playerList.indexOf(playerName) === piece.affiliation
                              ? `pieces/${piece.name}.svg`
                              : `pieces/enemy/${piece.name}_enemy.svg`
                          }
                          alt={piece.name}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <h3>Source: {pendingMove.source}</h3>
            <h3>Target: {pendingMove.target}</h3>
            {/* <img src="board.svg" alt="board" /> */}
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
        {error ? <Alert variant="danger">{error}</Alert> : null}
      </div>
    </div>
  );
}

export default App;
