import React, { useEffect, useState } from "react";

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
