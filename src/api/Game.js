// call API endpoints to get and set game data
import axios from 'axios';

export const getGameById = async (gameId) => {
  return axios
    .get(`/games/${gameId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });
};

export const updateUidMap = async (gameId, playerName) => {
  // the server derives the uid from the caller's own verified ID token
  // (attached by the axios interceptor in index.jsx), not from this URL
  return axios.post(`/games/${gameId}/${playerName}`).catch((err) => {
    console.error(err);
  });
};
