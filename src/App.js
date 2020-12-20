import React, { useEffect, useState } from "react";
import { createClient } from "graphql-ws";

function App() {
  const [listOfImages, setImages] = useState([]);
  // const [state, setState] = useState({
  //   name: "Bob",
  //   messages: [],
  // });

  const client = createClient({
    url: "ws://localhost:8080/graphql",
  });
  // query
  (async () => {
    const result = await new Promise((resolve, reject) => {
      // eslint-disable-next-line no-shadow
      let result;
      client.subscribe(
        {
          query: "{ hello }",
        },
        {
          // eslint-disable-next-line no-return-assign
          next: (data) => (result = data),
          error: reject,
          complete: () => resolve(result),
        }
      );
    });

    expect(result).toEqual({ hello: "Hello World!" });
  })();
  function importAll(r) {
    return r.keys().map(r);
  }

  // const ws = new WebSocket("wss://localhost:4000/graphql");

  useEffect(() => {
    // ws.onopen = () => {
    //   // on connecting, do nothing but log it to the console
    //   console.log("connected");
    // };

    // ws.onmessage = (evt) => {
    //   // on receiving a message, add it to the list of messages
    //   const message = JSON.parse(evt.data);
    //   addMessage(message);
    // };

    // ws.onclose = () => {
    //   console.log("disconnected");
    //   // automatically try to reconnect on connection loss
    //   this.setState({
    //     ws: new WebSocket("wss://localhost:4000/graphql"),
    //   });
    // };
    setImages(
      importAll(
        require.context("./MahjongPieces/", false, /\.(png|jpe?g|svg)$/)
      )
    );
  }, []);

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
