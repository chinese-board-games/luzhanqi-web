import React, { createContext } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const userState = {};

  return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
