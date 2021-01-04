/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import React, { useContext } from "react";
import { isEqual } from "lodash";
import Button from "react-bootstrap/Button";
import { GameContext } from "../../GameContext";

const DisplayBoard = () => {
  const gameState = useContext(GameContext);
  const { socket } = gameState;
  const { playerName } = gameState.playerName;
  const { roomId } = gameState.roomId;
  const { host } = gameState.host;
  const { clientTurn } = gameState.clientTurn;
  const { playerList } = gameState.playerList;
  const { myBoard } = gameState.myBoard;
  const { pendingMove, setPendingMove } = gameState.pendingMove;
  const { setError } = gameState.error;

  /** Send a move to the server */
  const makeMove = (e) => {
    e.preventDefault();
    if (pendingMove.source.length > 0 && pendingMove.target.length) {
      const sendingMove = pendingMove;

      socket.emit("makeMove", {
        playerName,
        room: roomId,
        turn: clientTurn,
        pendingMove: sendingMove,
      });
    } else {
      setError("You must have both a source and target tile");
    }

    setPendingMove({ source: [], target: [] });
  };

  const setMove = (y, x) => {
    y = host ? y : 11 - y;
    x = host ? x : 4 - x;

    if (pendingMove.source.length > 0) {
      console.log(pendingMove.source);
      const sourcePiece = myBoard[pendingMove.source[0]][pendingMove.source[1]];
      if (isEqual(pendingMove.source, [y, x])) {
        setPendingMove({
          source: [],
          target: [],
        });
      } else if (
        myBoard[y][x] &&
        myBoard[y][x].affiliation === sourcePiece.affiliation
      ) {
        setPendingMove({ source: [y, x], target: [] });
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

  const transformBoard = (board) =>
    board.map((row, y) =>
      row.map((piece, x) => board[board.length - 1 - y][row.length - 1 - x])
    );

  const getHighlightStyle = (y, x) => {
    y = host ? y : 11 - y;
    x = host ? x : 4 - x;
    const { source, target } = pendingMove;
    if (y === source[0] && x === source[1]) {
      return { filter: "drop-shadow(0 0 0.3em black)" };
    }
    if (y === target[0] && x === target[1]) {
      return { filter: "drop-shadow(0 0 0.3em brown)" };
    }
    return {};
  };

  const displayPieces = () => {
    const displayedPieces = host ? myBoard : transformBoard(myBoard);

    const firstHalf = displayedPieces.slice(0, 6).map((row, y) => (
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
                style={getHighlightStyle(y, x)}
                key={`game_blank_${[y + 1, x + 1]}`}
                src="pieces/blank.svg"
                alt="blank"
              />
            ) : (
              <img
                style={getHighlightStyle(y, x)}
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
    ));

    const mountainPass = () => (
      <svg viewBox="0 0 100 20">
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
            fontSize="31%"
            x="5%"
            y="24%"
            textAnchor="middle"
            stroke="white"
            strokeWidth="0.3px"
            dy="1.3em"
            dx="1em"
          >
            前線
          </text>

          <rect
            style={{ fill: "black" }}
            x="42.5%"
            y="18%"
            width="15%"
            height="60%"
            stroke="black"
            strokeWidth="0.05em"
          />
          <text
            fontSize="31%"
            x="45%"
            y="24%"
            textAnchor="middle"
            stroke="white"
            strokeWidth="0.3px"
            dy="1.3em"
            dx="1em"
          >
            前線
          </text>

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
            fontSize="31%"
            x="85%"
            y="24%"
            textAnchor="middle"
            stroke="white"
            strokeWidth="0.3px"
            dy="1.3em"
            dx="1em"
          >
            前線
          </text>
        </g>

        <g>
          <circle
            cx="30%"
            cy="50%"
            r="12%"
            fill="#FEF1C2"
            stroke="green"
            strokeWidth="2%"
          />
          <text
            fontSize="40%"
            x="30%"
            y="50%"
            textAnchor="middle"
            stroke="black"
            strokeWidth="0.3%"
            dy="9%"
          >
            山界
          </text>
        </g>
        <g>
          <circle
            cx="70%"
            cy="50%"
            r="12%"
            fill="#FEF1C2"
            stroke="green"
            strokeWidth="2%"
          />
          <text
            fontSize="40%"
            x="70%"
            y="50%"
            textAnchor="middle"
            stroke="black"
            strokeWidth="0.3%"
            dy="9%"
          >
            山界
          </text>
        </g>
      </svg>
    );

    const secondHalf = displayedPieces.slice(6).map((row, y) => (
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
                style={getHighlightStyle(y + 6, x)}
                key={`game_blank_${[y + 7, x + 1]}`}
                src="pieces/blank.svg"
                alt="blank"
              />
            ) : (
              <img
                style={getHighlightStyle(y + 6, x)}
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
    ));

    return (
      <>
        {firstHalf}
        {mountainPass()}
        {secondHalf}
      </>
    );
  };

  return (
    <>
      <svg
        style={{ position: "absolute", width: "582px" }}
        viewBox="0 0 582 1006"
      >
        <g>
          {/* Roads */}
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

          {/* Railroads */}
          <rect
            style={{ fill: "none" }}
            x="12%"
            y="12.5%"
            width="76%"
            height="75.5%"
            stroke="brown"
            strokeWidth="0.25em"
          />

          <rect
            style={{ fill: "none" }}
            x="12%"
            y="41%"
            width="76%"
            height="18%"
            stroke="brown"
            strokeWidth="0.25em"
          />

          {/* Upper safe zones */}
          <g>
            <circle
              style={{ fill: "white" }}
              stroke="black"
              strokeWidth="8"
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
              stroke="black"
              strokeWidth="8"
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
              stroke="black"
              strokeWidth="8"
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
              stroke="black"
              strokeWidth="8"
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
              stroke="black"
              strokeWidth="8"
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
              stroke="black"
              strokeWidth="8"
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
          {/* Lower safe zones */}
          <g>
            <circle
              style={{ fill: "white" }}
              stroke="black"
              strokeWidth="8"
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
              stroke="black"
              strokeWidth="8"
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
              stroke="black"
              strokeWidth="8"
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
              stroke="black"
              strokeWidth="8"
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
        {displayPieces()}
      </div>
      <h3>
        Source: {host ? pendingMove.source[0] : 11 - pendingMove.source[0]}
        {host ? pendingMove.source[1] : 4 - pendingMove.source[1]}
      </h3>
      <h3>
        Target: {host ? pendingMove.target[0] : 11 - pendingMove.target[0]}
        {host ? pendingMove.target[1] : 4 - pendingMove.target[1]}
      </h3>

      {(host && clientTurn % 2 === 0) || (!host && clientTurn % 2 === 1) ? (
        <Button type="button" variant="primary" onClick={makeMove}>
          Make move
        </Button>
      ) : (
        <Button type="button" variant="secondary" onClick={makeMove}>
          Make move
        </Button>
      )}
    </>
  );
};

export default DisplayBoard;
