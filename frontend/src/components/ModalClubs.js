import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form } from 'react-bootstrap'; 
import { getclubs } from '../actions/clubactions'


function ModalClubs({show, onHide, onChangeClub}) {

const dispatch = useDispatch()
const listofclubs = useSelector((state) => state.listofclubs);
const { error, loading, clubs } = listofclubs;

const [searchText, setSearchText] = useState(''); // State to store search text
const [filteredClubs, setFilteredClubs] = useState(clubs); // State to store filtered members


useEffect(() => {
    dispatch(getclubs());
  }, [dispatch]);

  useEffect(() => {
    // Filter members based on searchText
    const filtered = clubs.filter(
      (club) =>
      club.clubname.toLowerCase().includes(searchText.toLowerCase())||
      club.clubcity.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredClubs(filtered);
}, [searchText, clubs]);

const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleclubClick = (selectedClub) => {

    onChangeClub(selectedClub)
    onHide()

    console.log("club at component", selectedClub)
  
  }


  return (
    <Modal show={show} onHide={onHide} size="lg">

    {error && <div>Error: {error.message}</div>}
      <Modal.Header closeButton>
        <Modal.Title>Select Club</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="searchText">
          <Form.Label>Search Club:</Form.Label>
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
              <th>Member ID</th>
              <th>Club Name</th>
              <th>City</th>
              {/* Add more table headings for additional member data */}
            </tr>
          </thead>
          <tbody>
            {filteredClubs.map((club) => (
              <tr key={club.id} onClick={() => handleclubClick(club)}>
                <td>{club.id}</td>
                <td>{club.clubname}</td>
                <td>{club.clubcity}</td>
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

export default ModalClubs
