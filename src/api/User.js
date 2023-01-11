// call API endpoints to get and set user data
import axios from 'axios';

axios.defaults.baseURL = `${process.env.REACT_APP_API_URL}/users`;

export const createUser = async (userId) => {
  axios
    .post(`/${userId}`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getUser = async (userId) => {
  axios
    .get(`/${userId}`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addGame = async (userId, gameId) => {
  axios
    .post(`/${userId}/games/${gameId}`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const removeGame = async (userId, gameId) => {
  axios
    .delete(`/${userId}/games/${gameId}`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getGames = async (userId) => {
  axios
    .get(`/${userId}/games`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getRank = async (userId) => {
  axios
    .get(`/${userId}/rank`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const setRank = async (userId, rank) => {
  axios
    .post(`/${userId}/rank/${rank}`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
