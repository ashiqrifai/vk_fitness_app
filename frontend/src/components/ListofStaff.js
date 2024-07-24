import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Dropdown, Table } from 'react-bootstrap';
import { getusers } from '../actions/useracrtions';
import { useClub } from '../context/ClubContext';

function ListofStaff({ onUserChange }) {
  const dispatch = useDispatch();
  const userlist = useSelector((state) => state.listofusers);
  const { loading, error, users } = userlist;

  const [selectedUser, setSelectedUser] = useState(null);

  const { selectedClub } = useClub();

  useEffect(() => {
    if (selectedClub && selectedClub.club_id) {
      dispatch(getusers(selectedClub.club_id));
    } else {
      // Handle the case when selectedClub is null. 
      // Maybe show a message or use a default club_id.
      console.log('No club selected.');
    }
  }, [dispatch, selectedClub]);

  const handleUserChange = (selectedUser) => {
    setSelectedUser(selectedUser);
    onUserChange(selectedUser);
  };

  const dropdownStyle = {
    width: '100%',
    border: '1px solid #ced4da',
    background: 'transparent', // Make the background transparent
    color: '#000', // Set text color to black
  };

  return (
    <FormGroup>
      <Dropdown>
        <Dropdown.Toggle id="userDropDown" style={dropdownStyle}>
          {selectedUser ? selectedUser.first_name : 'Select a Personal Trainer'} {/* Display selected user's first name */}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {users.map((usr) => (
            <Dropdown.Item
              key={usr.id}
              onClick={() => handleUserChange(usr)}
            >
              {usr.first_name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </FormGroup>
  );
}

export default ListofStaff;
