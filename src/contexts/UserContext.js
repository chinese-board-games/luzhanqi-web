import React, { createContext, useState } from 'react';

export const UserContext = createContext({});

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const userState = {};

  return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
};
