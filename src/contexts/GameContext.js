/* eslint-disable no-console */
import React, { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { uniqueNamesGenerator, colors, animals } from "unique-names-generator";

import { apiBaseUrl } from "../config";

const socket = io(apiBaseUrl);

export const GameContext = createContext({});

// eslint-disable-next-line react/prop-types
export const GameProvider = ({ children }) => {
  /** user-input: the user's name */
  const defaultName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    length: 2,
  });
  const [playerName, setPlayerName] = useState(defaultName);
  /** game ID assigned to host, or user-input: game Id entered by player */
  const [roomId, setRoomId] = useState("");

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

  const gameState = {
    socket,
    playerName: { playerName, setPlayerName },
    roomId: { roomId, setRoomId },
    host: { host, setHost },
    joinedGame: { joinedGame, setJoinedGame },
    clientTurn: { clientTurn, setClientTurn },
    playerList: { playerList, setPlayerList },
    myBoard: { myBoard, setMyBoard },
    myPositions: { myPositions, setMyPositions },
    submittedSide: { submittedSide, setSubmittedSide },
    pendingMove: { pendingMove, setPendingMove },
    gamePhase: { gamePhase, setGamePhase },
    startingBoard: { startingBoard, setStartingBoard },
    error: { error, setError },
  };

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

    /** Server is telling all clients the game has ended */
    socket.on("endGame", (winner) => {
      console.log(winner);
      setGamePhase(3);
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
  }, [roomId, error]);

  return (
    <GameContext.Provider value={gameState}>{children}</GameContext.Provider>
  );
};
