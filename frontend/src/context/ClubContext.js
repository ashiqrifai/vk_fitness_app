import React, { createContext, useContext, useState } from 'react';

const ClubContext = createContext();

export const useClub = () => useContext(ClubContext);

export const ClubProvider = ({ children }) => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);

  return (
    <ClubContext.Provider value={{ clubs, selectedClub, setSelectedClub }}>
      {children}
    </ClubContext.Provider>
  );
};