/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import React, { useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Alert from "react-bootstrap/Alert";
import { GameContext } from "./GameContext";
import PlayerEntry from "./components/Lobby/PlayerEntry";
import SetBoard from "./components/Setup/SetBoard";
import DisplayBoard from "./components/LZQ/DisplayBoard";

function App() {
  const gameState = useContext(GameContext);
  const { roomId } = gameState.roomId;
  const { clientTurn } = gameState.clientTurn;
  const { playerList } = gameState.playerList;
  const { gamePhase } = gameState.gamePhase;
  const { error, setError } = gameState.error;

  /** Clear errors after 5 seconds */
  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 5000);
  }, [error, setError]);

  /**
   * Functions act as services to the SocketIO instance
   * Socket emmissions are headers followed by a data object
   */

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

        {
          /** Players join the game */
          gamePhase === 0 ? <PlayerEntry /> : null
        }

        {
          /** Players set their boards */
          gamePhase === 1 ? <SetBoard /> : null
        }

        {
          /** Players play the game */
          gamePhase === 2 ? <DisplayBoard /> : null
        }

        {clientTurn > -1 ? <h1>The turn is {clientTurn}</h1> : null}
        {error ? <Alert variant="danger">{error}</Alert> : null}
      </div>
    </div>
  );
}

export default App;
