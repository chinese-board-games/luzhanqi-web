// call API endpoints to get and set user data
import axios from 'axios';

export const createUser = async (userId) => {
  return axios
    .post(`/user/${userId}`)
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getUser = async (userId) => {
  console.log(`getUser: ${userId} `);
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
      console.log(err);
    });
};

export const addGame = async (userId, gameId) => {
  console.log(`addGame, game: ${userId}, user: ${gameId}`);
  return axios
    .post(`/user/${userId}/games/${gameId}`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const removeGame = async (userId, gameId) => {
  return axios
    .delete(`/user/${userId}/games/${gameId}`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getGames = async (userId) => {
  return axios
    .get(`/user/${userId}/games`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getRank = async (userId) => {
  return axios
    .get(`/user/${userId}/rank`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const setRank = async (userId, rank) => {
  return axios
    .post(`/user/${userId}/rank/${rank}`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
