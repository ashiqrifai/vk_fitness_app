import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form } from 'react-bootstrap'; // Import Table and Form from 'react-bootstrap'
import { getusers } from '../actions/useracrtions';
import { useClub } from '../context/ClubContext';

function UserListModal({show, onHide, onChangeUser}) {

const dispatch = useDispatch()
const listofusers = useSelector((state) => state.listofusers);
const { error, loading, users } = listofusers;

const [searchText, setSearchText] = useState(''); // State to store search text
const [filteredUsers, setFilteredUsers] = useState(users); // State to store filtered members
const { selectedClub } = useClub();

useEffect(() => {
  if (selectedClub && selectedClub.club_id) {
    dispatch(getusers(selectedClub.club_id));
  } else {
    console.log('No club selected.');
  }
}, [dispatch, selectedClub]);

useEffect(() => {
    // Filter members based on searchText
    const filtered = users.filter(
      (user) =>
      String(user.id).toLowerCase().includes(searchText.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchText.toLowerCase())

    );
    setFilteredUsers(filtered);
}, [searchText, users]);

const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleUserClick = (selectedUser) => {

    onChangeUser(selectedUser)
    onHide()

    console.log("user at component", selectedUser)
  
  }


  return (
    <Modal show={show} onHide={onHide} size="lg">

    {error && <div>Error: {error.message}</div>}
      <Modal.Header closeButton>
        <Modal.Title>Select Personal Trainer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="searchText">
          <Form.Label>Search PT:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            value={searchText}
            onChange={handleSearchTextChange}
          />
        </Form.Group>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>PT ID</th>
              <th>PT Name</th>
              {/* Add more table headings for additional member data */}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} onClick={() => handleUserClick(user)}>
                <td>{user.id}</td>
                <td>{user.first_name}</td>
                {/* Add more table cells for additional member data */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  )
}

export default UserListModal
