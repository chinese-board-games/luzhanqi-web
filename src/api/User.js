// call API endpoints to get and set user data
import axios from 'axios';

export const createUser = async (userId) => {
  return axios
    .post(`/user/${userId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });
};

export const getUser = async (userId) => {
  console.info(`getUser: ${userId} `);
  return axios
    .get(`/user/${userId}`)
    .then((res) => {
      if (res.data.games) {
        return res.data;
      } else {
        return {};
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

export const addGame = async (userId, gameId) => {
  console.info(`addGame, game: ${userId}, user: ${gameId}`);
  return axios.post(`/user/${userId}/games/${gameId}`).catch((err) => {
    console.error(err);
  });
};

export const removeGame = async (userId, gameId) => {
  return axios.delete(`/user/${userId}/games/${gameId}`).catch((err) => {
    console.error(err);
  });
};

/** Dismisses a game from the user's "rejoin" prompt without removing it
 * from their games list - it still shows up in full game history. */
export const archiveGame = async (userId, gameId) => {
  return axios.post(`/user/${userId}/games/${gameId}/archive`).catch((err) => {
    console.error(err);
  });
};

export const unarchiveGame = async (userId, gameId) => {
  return axios.delete(`/user/${userId}/games/${gameId}/archive`).catch((err) => {
    console.error(err);
  });
};

export const getGames = async (userId) => {
  return axios.get(`/user/${userId}/games`).catch((err) => {
    console.error(err);
  });
};

export const getRank = async (userId) => {
  return axios.get(`/user/${userId}/rank`).catch((err) => {
    console.error(err);
  });
};

export const setRank = async (userId, rank) => {
  return axios.post(`/user/${userId}/rank/${rank}`).catch((err) => {
    console.error(err);
  });
};
