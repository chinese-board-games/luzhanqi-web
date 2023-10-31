// call API endpoints to get and set game data
import axios from 'axios';

export const getGameById = async (gameId) => {
  console.log(`getGame: ${gameId} `);
  return axios
    .get(`/gameRecord/${gameId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
