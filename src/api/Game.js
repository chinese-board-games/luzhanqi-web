// call API endpoints to get and set game data
import axios from 'axios';

export const getGameById = async (gameId) => {
  return axios
    .get(`/games/${gameId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateUidMap = async (gameId, playerName, uid) => {
  return axios
    .post(`/games/${gameId}/${playerName}/${uid}`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
