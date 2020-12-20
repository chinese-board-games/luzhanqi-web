import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [listOfImages, setImages] = useState([]);

  function importAll(r) {
    return r.keys().map(r);
  }

  useEffect(() => {
    setImages(
      importAll(
        require.context("./MahjongPieces/", false, /\.(png|jpe?g|svg)$/)
      )
    );
  }, []);

  const socket = io("localhost:3000");
  socket.on("connect", () => {
    console.log(socket.id);
    console.log(socket.connected);
  });

  socket.on("disconnect", () => {
    console.log(socket.id);
    console.log(socket.connected);
  });

  return (
    <div>
      {listOfImages.map((image, index) => {
        console.log(image);
        return <img key={`${index * 5}shit`} src={image.default} alt="info" />;
      })}
    </div>
  );
}

export default App;
