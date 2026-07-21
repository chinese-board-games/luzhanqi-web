import React, { createContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { uniqueNamesGenerator, colors, animals } from 'unique-names-generator';
import PropTypes from 'prop-types';

import i18n from '../i18n';

const socket = io(import.meta.env.VITE_API);
// const socket = io('localhost:4000');
// const socket = io('https://luzhanqi.herokuapp.com/');

// dev-only: without this, every Vite hot-reload of this module (or
// anything it transitively imports) opens a brand new socket connection on
// top of the old one, which never gets closed - a long dev session with
// many edits ends up with dozens of live sockets/listeners piling up in
// the same tab, which is real, cumulative overhead the app itself doesn't
// have (import.meta.hot doesn't exist in a production build, so this is a
// no-op there)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    socket.close();
  });
}

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
  /** short human-shareable code resolving to roomId, for inviting others */
  const [joinCode, setJoinCode] = useState('');
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
  /** the most recent move's { source, target } coordinates (host-perspective,
   * unrotated), or null before any move has been made */
  const [lastMove, setLastMove] = useState(null);
  const [myPositions, setMyPositions] = useState(Array(6).fill(Array(5).fill(null)));
  const [submittedSide, setSubmittedSide] = useState(false);
  const [pendingMove, setPendingMove] = useState({
    source: [],
    target: [],
  });
  const [successors, setSuccessors] = useState([]);
  // isEnglish/setIsEnglish are a compat shim over i18next for the many
  // components not yet migrated to useTranslation() - the real source of
  // truth (current language, persistence, detection) now lives in
  // src/i18n. setIsEnglish only distinguishes English from "not English"
  // (falling back to zh-Hant, matching the old default), so it can't
  // express the other languages i18next supports - migrated components
  // should call i18n.changeLanguage directly instead.
  const [isEnglish, setIsEnglishState] = useState(() => i18n.language?.startsWith('en'));
  useEffect(() => {
    const handleLanguageChanged = (lng) => setIsEnglishState(lng.startsWith('en'));
    i18n.on('languageChanged', handleLanguageChanged);
    return () => i18n.off('languageChanged', handleLanguageChanged);
  }, []);
  const setIsEnglish = (value) => i18n.changeLanguage(value ? 'en' : 'zh-Hant');
  // rule-variant config (flyingBombs/landminesSurvive/captureTheFlag/...)
  // set by the host in the Lobby - needed locally so move highlighting and
  // combat-outcome prediction match how the server will actually resolve them
  const [gameConfig, setGameConfig] = useState({});
  // mirrors playerNameRef above - lets the socket handlers below (registered
  // in an effect that doesn't re-run on every isEnglish change) always read
  // the current language instead of a stale closure
  const isEnglishRef = useRef(isEnglish);
  useEffect(() => {
    isEnglishRef.current = isEnglish;
  }, [isEnglish]);

  /**
   * Game phases:
   * 0: waiting
   * 1: placement
   * 2: gameplay
   */

  // eslint-disable-next-line no-unused-vars
  const [gamePhase, setGamePhase] = useState(0);
  // mirrors playerNameRef above - lets the error handler below (registered
  // in an effect that doesn't re-run on every gamePhase change) always read
  // the current phase instead of a stale closure
  const gamePhaseRef = useRef(gamePhase);
  useEffect(() => {
    gamePhaseRef.current = gamePhase;
  }, [gamePhase]);

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
  /** in-progress games tied to the logged-in user's account that are worth
   * rejoining (opponent connected, or an AI game), from a device with no
   * localStorage session for them - see checkActiveGames */
  const [activeGames, setActiveGames] = useState([]);

  /** Attempts to reclaim a seat using a locally-stored session token if one
   * exists for this game ID, otherwise (given a logged-in Firebase user)
   * falls back to asking the server to match a verified uid against the
   * game's players. Returns false immediately if neither is available. */
  const attemptRejoin = async (gameId, user = null) => {
    const session = loadSession(gameId);
    if (!session && !user) {
      setRejoining(false);
      return false;
    }
    setRejoining(true);
    if (session) {
      setPlayerName(session.playerName);
    }
    socket.emit('playerRejoinRoom', {
      gameId,
      playerName: session?.playerName,
      token: session?.token,
      idToken: user ? await user.getIdToken() : null,
    });
    return true;
  };

  /** Asks the server which of the logged-in user's games are still ongoing
   * and worth showing a "rejoin" prompt for. Results land in activeGames. */
  const checkActiveGames = async (user) => {
    if (!user) {
      setActiveGames([]);
      return;
    }
    socket.emit('getMyActiveGames', { idToken: await user.getIdToken() });
  };

  const gameState = {
    socket,
    playerName: { playerName, setPlayerName },
    spectatorName: { spectatorName, setSpectatorName },
    roomId: { roomId, setRoomId },
    joinCode: { joinCode, setJoinCode },
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
    lastMove: { lastMove, setLastMove },
    myPositions: { myPositions, setMyPositions },
    submittedSide: { submittedSide, setSubmittedSide },
    pendingMove: { pendingMove, setPendingMove },
    successors: { successors, setSuccessors },
    gamePhase: { gamePhase, setGamePhase },
    startingBoard: { startingBoard, setStartingBoard },
    winner: { winner, setWinner },
    gameResults: { gameResults, setGameResults },
    isEnglish: { isEnglish, setIsEnglish },
    gameConfig: { gameConfig, setGameConfig },
    errors: { errors, setErrors },
    rejoining: { rejoining, setRejoining },
    disconnectedPlayer: { disconnectedPlayer, setDisconnectedPlayer },
    activeGames: { activeGames, setActiveGames },
    attemptRejoin,
    checkActiveGames,
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
      // the underlying transport can reconnect under a new socket.id after
      // a network drop or server restart without the page ever reloading -
      // React state (joinedGame, playerList, ...) survives that untouched,
      // so Game.jsx's own mount-time rejoin effect never re-fires, but the
      // server's in-memory socketSeatRegistry (keyed by socket.id, proof
      // that a later move/forfeit/etc. actually belongs to this seat) does
      // NOT survive it. Silently re-establishing the seat here - a no-op
      // on the very first connect, since roomId is still empty then - is
      // what prevents "You do not have permission to act as X" on the
      // first action after a reconnect.
      if (roomId) {
        attemptRejoin(roomId);
      }
    });

    /** Server has created a new game, only host receives this message */
    socket.on(
      'newGameCreated',
      ({ gameId, joinCode: newJoinCode, mySocketId, players, phase, token }) => {
        const serverRoomId = gameId;
        console.info(`GameID: ${serverRoomId}, SocketID: ${mySocketId}`);
        setRoomId(serverRoomId);
        setJoinCode(newJoinCode || '');
        setPlayerList(players);
        saveSession(serverRoomId, playerNameRef.current, token);
        if (typeof phase === 'number') setGamePhase(phase);
        navigate(`/game/${serverRoomId}`);
      }
    );

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
      setJoinCode(data.joinCode || '');
      saveSession(joinedRoomId, playerNameRef.current, data.token);
      if (typeof data.phase === 'number') setGamePhase(data.phase);
      if (Array.isArray(data.spectators)) setSpectatorList(data.spectators);
    });

    /** A stored session, or (from a device with none) a logged-in uid
     * matching a seat, successfully reclaimed a seat after a disconnect */
    socket.on('youHaveRejoinedTheRoom', (data) => {
      setRejoining(false);
      setJoinedGame(true);
      setPlayerName(data.playerName);
      saveSession(data.gameId, data.playerName, data.token);
      setPlayerList(data.players || []);
      setSpectatorList(data.spectators || []);
      setHost(data.players?.[0] === data.playerName);
      setClientTurn(typeof data.turn === 'number' ? data.turn : -1);
      setGamePhase(typeof data.phase === 'number' ? data.phase : 0);
      setSubmittedSide(!!data.submittedSide);
      if (data.board) setMyBoard(data.board);
      if (Array.isArray(data.deadPieces)) setMyDeadPieces(data.deadPieces);
      if (Array.isArray(data.moves) && data.moves.length) {
        setLastMove(data.moves[data.moves.length - 1]);
      }
      if (data.phase === 3) {
        setWinner(data.winnerIndex);
        if (data.gameStats) setGameResults(data.gameStats);
      }
      if (data.config) setGameConfig(data.config);
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

    /** Server's answer to checkActiveGames - games tied to this account
     * that are still ongoing and worth prompting the user to rejoin */
    socket.on('myActiveGames', (games) => {
      setActiveGames(Array.isArray(games) ? games : []);
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
    socket.on('youAreSpectatingTheRoom', (data) => {
      setJoinedGame(true);
      const joinedRoomId = data?.gameId || roomId;
      setRoomId(joinedRoomId);
      setJoinCode(data?.joinCode || '');
      navigate(`/game/${joinedRoomId}`);
    });

    /** Server is sending the starting board with all placed pieces */
    socket.on('boardSet', (game) => {
      setMyBoard(game.board);
      setGamePhase(2);
      setLastMove(null);
      // normally set by beginNewGame, but that event never fires for AI
      // games since they skip the Lobby's "Room Full" step entirely
      if (typeof game.turn === 'number') setClientTurn(game.turn);
      if (game.config) setGameConfig(game.config);
    });

    socket.on('halfBoardReceived', () => {
      setSubmittedSide(true);
    });

    socket.on('pieceSelected', (pieces) => {
      setSuccessors(pieces);
    });

    /** Server is telling all clients a move has been made */
    socket.on('playerMadeMove', ({ turn, board, deadPieces, moves }) => {
      setClientTurn(turn);
      setMyBoard(board);
      setMyDeadPieces(deadPieces);
      if (Array.isArray(moves) && moves.length) {
        setLastMove(moves[moves.length - 1]);
      }
    });

    /** Server is telling both players (and spectators) that a field marshal
     * died on the move that just resolved - notable since the loser's flag
     * becomes revealed to their opponent once this happens */
    socket.on('fieldMarshallDown', (fallen) => {
      fallen.forEach(({ playerName: fallenPlayerName }) => {
        const isMine = fallenPlayerName === playerNameRef.current;
        const message = isEnglishRef.current
          ? isMine
            ? 'Your Field Marshal has fallen!'
            : `${fallenPlayerName}'s Field Marshal has fallen — their flag is now revealed!`
          : isMine
          ? '你的司令陣亡了！'
          : `${fallenPlayerName} 的司令陣亡了 — 他們的軍旗現已顯示！`;
        toast.warning(message, { autoClose: 6000 });
      });
    });

    /** Server is telling all clients the game has ended */
    socket.on('endGame', ({ winnerIndex, gameStats, finalGame }) => {
      setGamePhase(3);
      setWinner(winnerIndex);
      setGameResults(gameStats);
      // finalGame is the server's unfogged view, revealing the board now
      // that fog no longer needs to hide anything - guard it since it
      // crosses the socket boundary from a separately-maintained payload
      if (finalGame) {
        setMyBoard(finalGame.board);
      }
    });

    /** Server is returning an error message to the client. During active
     * gameplay, also resync with the server - an error here can mean a
     * client-side optimistic update (see Game.jsx's playerMakeMove) guessed
     * wrong and is now showing a stale/incorrect board. */
    socket.on('error', (errMsg) => {
      pushErrors(errMsg);
      if (gamePhaseRef.current === 2) {
        attemptRejoin(roomId);
      }
    });

    // this effect re-registers every listener above from scratch on each
    // run, so the old set must be removed first or they'll pile up
    return () => {
      socket.off();
    };
  }, [roomId, JSON.stringify(errors)]);

  return <GameContext.Provider value={gameState}>{children}</GameContext.Provider>;
};

GameProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
