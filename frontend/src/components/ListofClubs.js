import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Dropdown } from 'react-bootstrap';
import { getclubs } from '../actions/clubactions';

import '../styles/listofclubs.css';

function ListofClubs({ onClubChange }) {
  const dispatch = useDispatch();
  const clublist = useSelector((state) => state.listofclubs);
  const { loading, error, clubs } = clublist;

  const [selectedClubs, setSelectedClubs] = useState([]); // State to store multiple selected clubs

  useEffect(() => {
    dispatch(getclubs());
  }, [dispatch]);

  useEffect(() => {
    // Map selectedClubs to their ids before passing to onClubChange
    const clubIds = selectedClubs.map(club => club.id);
    onClubChange(clubIds);
  }, [selectedClubs, onClubChange]);


  const handleClubSelect = (selectedClub) => {
    const isAlreadySelected = selectedClubs.some(club => club.id === selectedClub.id);

    if (isAlreadySelected) {
      // Remove the club from selection
      setSelectedClubs(selectedClubs.filter(club => club.id !== selectedClub.id));
    } else {
      // Add the club to selection
      setSelectedClubs([...selectedClubs, selectedClub]);
    }

    onClubChange(selectedClubs); // Update the parent component
  };

  const getSelectedClubNames = () => {
    return selectedClubs.length > 0
      ? selectedClubs.map(club => club.clubname).join(', ')
      : 'Select Clubs'; // Default text when no clubs are selected
  };

  return (
    <FormGroup>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="clubDropdown" style={{ width: '100%', border: '1px solid #ced4da' }}>
          {getSelectedClubNames()} {/* Display names of selected clubs */}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {clubs.map((club) => (
            <Dropdown.Item
              key={club.id}
              onClick={() => handleClubSelect(club)}
              active={selectedClubs.some(selectedClub => selectedClub.id === club.id)} // Highlight selected clubs
            >
              {club.clubname}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </FormGroup>
  );
}

export default ListofClubs;
