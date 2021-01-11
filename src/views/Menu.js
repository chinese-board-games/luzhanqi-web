import React from "react";
import Button from "react-bootstrap/Button";

function Menu() {
  return (
    <div>
      <h1>陸戰棋 Luzhanqi</h1>
      <Button variant="primary">Create Match</Button>
      <Button>Join Match</Button>
      <Button>Settings</Button>
    </div>
  );
}

export default Menu;
