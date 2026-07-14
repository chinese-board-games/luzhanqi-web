import React, { createContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';
import PropTypes from 'prop-types';

const socket = io(import.meta.env.VITE_API);
// const socket = io('localhost:4000');
// const socket = io('https://luzhanqi.herokuapp.com/');

export const GameContext = createContext({});

const sessionKey = (gameId) => `luzhanqi:session:${gameId}`;

const saveSession = (gameId, name, token) => {
  if (!gameId || !token) return;
  window.localStorage.setItem(sessionKey(gameId), JSON.stringify({ playerName: name, token }));
};

const loadSession = (gameId) => {
  try {
    const raw = window.localStorage.getItem(sessionKey(gameId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const clearSession = (gameId) => {
  window.localStorage.removeItem(sessionKey(gameId));
};

export const GameProvider = ({ children }) => {
  const navigate = useNavigate();

  /** user-input: the user's name */
  const defaultName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    length: 2,
  });
  const [playerName, setPlayerName] = useState(defaultName);
  // socket handlers below are registered in an effect that doesn't
  // re-run on every playerName change (see its dependency array) - this
  // ref lets them always read the latest name instead of a stale closure
  const playerNameRef = useRef(playerName);
  useEffect(() => {
    playerNameRef.current = playerName;
  }, [playerName]);
  const [spectatorName, setSpectatorName] = useState(defaultName);
  /** game ID assigned to host, or user-input: game Id entered by player */
  const [roomId, setRoomId] = useState('');
  const [storedPlayerName, setStoredPlayerName] = useState(null);
  const [storedRoomId, setStoredRoomId] = useState(null);
  const [storedPlayerList, setStoredPlayerList] = useState([]);

  const [host, setHost] = useState(false);
  const [joinedGame, setJoinedGame] = useState(false);

  const [clientTurn, setClientTurn] = useState(-1);
  const [playerList, setPlayerList] = useState([]);

  const [spectatorList, setSpectatorList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [myBoard, setMyBoard] = useState(Array(12).fill(Array(5).fill(null)));
  const [myDeadPieces, setMyDeadPieces] = useState([]);
  const [myPositions, setMyPositions] = useState(Array(6).fill(Array(5).fill(null)));
  const [submittedSide, setSubmittedSide] = useState(false);
  const [pendingMove, setPendingMove] = useState({
    source: [],
    target: [],
  });
  const [successors, setSuccessors] = useState([]);
  const [isEnglish, setIsEnglish] = useState(false);

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
  const [gameResults, setGameResults] = useState({ remain: [[], []], lost: [[], []] });

  const [errors, setErrors] = useState([]);

  /** whether a silent rejoin attempt is in flight for the current game ID */
  const [rejoining, setRejoining] = useState(false);
  /** name of the opponent whose socket most recently disconnected, or null */
  const [disconnectedPlayer, setDisconnectedPlayer] = useState(null);

  /** Attempts to silently reclaim a seat using a locally-stored session token. Returns
   * false immediately if no stored session exists for this game ID. */
  const attemptRejoin = (gameId) => {
    const session = loadSession(gameId);
    if (!session) {
      setRejoining(false);
      return false;
    }
    setRejoining(true);
    setPlayerName(session.playerName);
    socket.emit('playerRejoinRoom', {
      gameId,
      playerName: session.playerName,
      token: session.token,
    });
    return true;
  };

  const gameState = {
    socket,
    playerName: { playerName, setPlayerName },
    spectatorName: { spectatorName, setSpectatorName },
    roomId: { roomId, setRoomId },
    storedPlayerName: { storedPlayerName, setStoredPlayerName },
    storedRoomId: { storedRoomId, setStoredRoomId },
    storedPlayerList: { storedPlayerList, setStoredPlayerList },
    host: { host, setHost },
    joinedGame: { joinedGame, setJoinedGame },
    clientTurn: { clientTurn, setClientTurn },
    playerList: { playerList, setPlayerList },
    spectatorList: { spectatorList, setSpectatorList },
    myBoard: { myBoard, setMyBoard },
    myDeadPieces: { myDeadPieces, setMyDeadPieces },
    myPositions: { myPositions, setMyPositions },
    submittedSide: { submittedSide, setSubmittedSide },
    pendingMove: { pendingMove, setPendingMove },
    successors: { successors, setSuccessors },
    gamePhase: { gamePhase, setGamePhase },
    startingBoard: { startingBoard, setStartingBoard },
    winner: { winner, setWinner },
    gameResults: { gameResults, setGameResults },
    isEnglish: { isEnglish, setIsEnglish },
    errors: { errors, setErrors },
    rejoining: { rejoining, setRejoining },
    disconnectedPlayer: { disconnectedPlayer, setDisconnectedPlayer },
    attemptRejoin,
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
      console.info(`SocketID: ${socket.id}`);
      console.info(`Connected: ${socket.connected}`);
    });

    /** Server has created a new game, only host receives this message */
    socket.on('newGameCreated', ({ gameId, mySocketId, players, phase, token }) => {
      const serverRoomId = gameId;
      console.info(`GameID: ${serverRoomId}, SocketID: ${mySocketId}`);
      setRoomId(serverRoomId);
      setPlayerList(players);
      saveSession(serverRoomId, playerNameRef.current, token);
      if (typeof phase === 'number') setGamePhase(phase);
      navigate(`/game/${serverRoomId}`);
    });

    /** Server is telling all clients the game has started  */
    socket.on('beginNewGame', ({ mySocketId, roomId, turn }) => {
      console.info(`Starting game for room ${roomId} on socket ${mySocketId}`);
      // setDisplayTimer(true);
      setClientTurn(turn);
      setGamePhase(1);
    });

    /** Server is telling all clients someone has joined the room */
    socket.on('playerJoinedRoom', ({ playerName: returnedPlayerName, players, spectators }) => {
      console.info(`${returnedPlayerName} has joined the room!`);
      setPlayerList(players);
      if (Array.isArray(spectators)) setSpectatorList(spectators);
    });

    /** Server is telling this socket that it has joined a room */
    socket.on('youHaveJoinedTheRoom', (data) => {
      setJoinedGame(true);
      // setPlayerList(data.players);
      const joinedRoomId = data.joinRoomId || roomId;
      navigate(`/game/${joinedRoomId}`);
      saveSession(joinedRoomId, playerNameRef.current, data.token);
      if (typeof data.phase === 'number') setGamePhase(data.phase);
      if (Array.isArray(data.spectators)) setSpectatorList(data.spectators);
    });

    /** A stored session successfully reclaimed a seat after a disconnect/reload */
    socket.on('youHaveRejoinedTheRoom', (data) => {
      setRejoining(false);
      setJoinedGame(true);
      setPlayerList(data.players || []);
      setSpectatorList(data.spectators || []);
      setHost(data.players?.[0] === data.playerName);
      setClientTurn(typeof data.turn === 'number' ? data.turn : -1);
      setGamePhase(typeof data.phase === 'number' ? data.phase : 0);
      setSubmittedSide(!!data.submittedSide);
      if (data.board) setMyBoard(data.board);
      if (Array.isArray(data.deadPieces)) setMyDeadPieces(data.deadPieces);
      if (data.phase === 3) {
        setWinner(data.winnerIndex);
        if (data.gameStats) setGameResults(data.gameStats);
      }
      setRoomId(data.gameId);
      navigate(`/game/${data.gameId}`);
    });

    /** The stored session token was rejected - fall back to the normal join form */
    socket.on('rejoinFailed', (data) => {
      setRejoining(false);
      clearSession(data.gameId);
    });

    /** An opponent's socket dropped - their seat is still reserved, they may reconnect */
    socket.on('playerDisconnected', ({ playerName: droppedName }) => {
      setDisconnectedPlayer(droppedName);
    });

    socket.on('playerReconnected', ({ playerName: returnedName }) => {
      setDisconnectedPlayer((current) => (current === returnedName ? null : current));
    });

    socket.on('playerLeftRoom', ({ playerName: returnedPlayerName, players }) => {
      console.info(`${returnedPlayerName} has left the room!`);
      setPlayerList(players);
      setClientTurn(-1);
      setGamePhase(0);
      setSubmittedSide(false);
    });

    socket.on('spectatorLeftRoom', ({ spectatorName: returnedSpectatorName, spectators }) => {
      console.info(`${returnedSpectatorName} has left the room!`);
      setSpectatorList(spectators);
    });

    /** Server is telling this socket that it has left a room */
    socket.on('youHaveLeftTheRoom', () => {
      setJoinedGame(false);
      setPlayerList([]);
      navigate(`/`);
      window.sessionStorage.removeItem('playerName');
      window.sessionStorage.removeItem('roomId');
      window.sessionStorage.removeItem('playerList');
    });

    /** Server is telling all clients someone is spectating the room */
    socket.on(
      'spectatorJoinedRoom',
      ({ spectatorName: returnedSpectatorName, spectators, players }) => {
        console.info(`${returnedSpectatorName} has joined the room!`);
        setPlayerList(players);
        setSpectatorList(spectators);
      }
    );

    /** Server is telling this socket that it has joined a room */
    socket.on('youAreSpectatingTheRoom', () => {
      setJoinedGame(true);
      navigate(`/game/${roomId}`);
    });

    /** Server is sending the starting board with all placed pieces */
    socket.on('boardSet', (game) => {
      setMyBoard(game.board);
      setGamePhase(2);
      // normally set by beginNewGame, but that event never fires for AI
      // games since they skip the Lobby's "Room Full" step entirely
      if (typeof game.turn === 'number') setClientTurn(game.turn);
    });

    socket.on('halfBoardReceived', () => {
      setSubmittedSide(true);
    });

    socket.on('pieceSelected', (pieces) => {
      setSuccessors(pieces);
    });

    /** Server is telling all clients a move has been made */
    socket.on('playerMadeMove', ({ turn, board, deadPieces }) => {
      setClientTurn(turn);
      setMyBoard(board);
      setMyDeadPieces(deadPieces);
    });

    /** Server is telling all clients the game has ended */
    socket.on('endGame', ({ winnerIndex, gameStats, finalGame }) => {
      setGamePhase(3);
      setWinner(winnerIndex);
      setGameResults(gameStats);
      setMyBoard(finalGame.board);
    });

    /** Server is returning an error message to the client */
    socket.on('error', (errMsg) => {
      pushErrors(errMsg);
    });

    return () => {
      socket.on('disconnect', () => {
        console.info(`SocketID: ${socket.id}`);
        console.info(`Connected: ${socket.connected}`);
      });
    };
  }, [roomId, JSON.stringify(errors)]);

  return <GameContext.Provider value={gameState}>{children}</GameContext.Provider>;
};

GameProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
