/* eslint-disable no-console */
import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';

const socket = io(process.env.REACT_APP_API);
// const socket = io('localhost:4000');
// const socket = io('https://luzhanqi.herokuapp.com/');

export const GameContext = createContext({});

// eslint-disable-next-line react/prop-types
export const GameProvider = ({ children }) => {
  /** user-input: the user's name */
  const defaultName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    length: 2
  });
  const [playerName, setPlayerName] = useState(defaultName);
  /** game ID assigned to host, or user-input: game Id entered by player */
  const [roomId, setRoomId] = useState('');
  const [storedPlayerName, setStoredPlayerName] = useState(null);
  const [storedRoomId, setStoredRoomId] = useState(null);
  const [storedPlayerList, setStoredPlayerList] = useState([]);

  const [host, setHost] = useState(false);
  const [joinedGame, setJoinedGame] = useState(false);

  const [clientTurn, setClientTurn] = useState(-1);
  const [playerList, setPlayerList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [myBoard, setMyBoard] = useState(Array(12).fill(Array(5).fill(null)));
  const [myPositions, setMyPositions] = useState(Array(6).fill(Array(5).fill(null)));
  const [submittedSide, setSubmittedSide] = useState(false);
  const [pendingMove, setPendingMove] = useState({
    source: [],
    target: []
  });
  const [successors, setSuccessors] = useState([]);

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
      boardPositions[[j, i]] = 'none';
    }
  }

  const [startingBoard, setStartingBoard] = useState(boardPositions);
  const [winner, setWinner] = useState(null);

  // const [startingBoard, setStartingBoard] = useState();
  const [errors, setErrors] = useState([]);

  const gameState = {
    socket,
    playerName: { playerName, setPlayerName },
    roomId: { roomId, setRoomId },
    storedPlayerName: { storedPlayerName, setStoredPlayerName },
    storedRoomId: { storedRoomId, setStoredRoomId },
    storedPlayerList: { storedPlayerList, setStoredPlayerList },
    host: { host, setHost },
    joinedGame: { joinedGame, setJoinedGame },
    clientTurn: { clientTurn, setClientTurn },
    playerList: { playerList, setPlayerList },
    myBoard: { myBoard, setMyBoard },
    myPositions: { myPositions, setMyPositions },
    submittedSide: { submittedSide, setSubmittedSide },
    pendingMove: { pendingMove, setPendingMove },
    successors: { successors, setSuccessors },
    gamePhase: { gamePhase, setGamePhase },
    startingBoard: { startingBoard, setStartingBoard },
    winner: { winner, setWinner },
    errors: { errors, setErrors }
  };

  // extend error (list of errors) to include new errors
  const pushErrors = (newErrors) => {
    setErrors((prevErrorStack) => [...prevErrorStack, ...newErrors]);
  };

  /**
   * Socket handlers receive headers and data from SocketIO connection
   * Function on second parameter handles socket call parameters
   */
  useEffect(() => {
    socket.on('connect', () => {
      console.log(`SocketID: ${socket.id}`);
      console.log(`Connected: ${socket.connected}`);
    });

    /** Server has created a new game, only host receives this message */
    socket.on('newGameCreated', ({ gameId, mySocketId, players }) => {
      console.log(`GameID: ${gameId}, SocketID: ${mySocketId}`);
      setRoomId(gameId);
      // setJoinRoomId(gameId);
      setPlayerList(players);
    });

    /** Server is telling all clients the game has started  */
    socket.on('beginNewGame', ({ mySocketId, gameId, turn }) => {
      console.log(`Starting game ${gameId} on socket ${mySocketId}`);
      // setDisplayTimer(true);
      setClientTurn(turn);
      setGamePhase(1);
    });

    /** Server is telling all clients someone has joined the room */
    socket.on('playerJoinedRoom', (data) => {
      console.log(`${data.playerName} has joined the room!`);
      setPlayerList(data.players);
    });

    /** Server is telling this socket that it has joined a room */
    socket.on('youHaveJoinedTheRoom', (data) => {
      setJoinedGame(true);
      setPlayerList(data.players);
      window.sessionStorage.setItem('playerName', playerName);
      window.sessionStorage.setItem('roomId', roomId);
      window.sessionStorage.setItem('playerList', data.players);
    });

    /** Server is sending the starting board with all placed pieces */
    socket.on('boardSet', (game) => {
      setMyBoard(game.board);
      setGamePhase(2);
    });

    socket.on('halfBoardReceived', () => {
      setSubmittedSide(true);
    });

    socket.on('pieceSelected', (pieces) => {
      setSuccessors(pieces);
      console.log('successors: ', pieces);
    });

    /** Server is telling all clients a move has been made */
    socket.on('playerMadeMove', (data) => {
      console.log('Move has been made', data);
      setClientTurn(data.turn);
      setMyBoard(data.board);
    });

    /** Server is telling all clients the game has ended */
    socket.on('endGame', (won) => {
      setGamePhase(3);
      setWinner(won);
    });

    /** Server is returning an error message to the client */
    socket.on('error', (errMsg) => {
      pushErrors(errMsg);
    });

    return () => {
      socket.on('disconnect', () => {
        console.log(`SocketID: ${socket.id}`);
        console.log(`Connected: ${socket.connected}`);
      });
    };
  }, [roomId, JSON.stringify(errors)]);

  return <GameContext.Provider value={gameState}>{children}</GameContext.Provider>;
};
