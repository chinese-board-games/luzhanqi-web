/* eslint-disable no-console */
import React, { useContext } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { GameContext } from "../../GameContext";
import { pieces } from "../../util/piece";

const SetBoard = () => {
  const gameState = useContext(GameContext);
  const { socket } = gameState;
  const { playerName } = gameState.playerName;
  const { roomId } = gameState.roomId;
  const { myPositions } = gameState.myPositions;
  const { submittedSide } = gameState.submittedSide;
  const { startingBoard, setStartingBoard } = gameState.startingBoard;

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

  return submittedSide ? (
    <>
      <h2>請等對手</h2>
      <h2>Waiting for other player</h2>
    </>
  ) : (
    <>
      <h2>前線</h2>
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
  );
};

export default SetBoard;
