import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form } from 'react-bootstrap'; 
import { membershiplist } from '../actions/membershipaction'

function ModalMembershipList({ show, onHide, onChangeMembership }) {
const dispatch = useDispatch();
const listofmemberships = useSelector((state) => state.listofmemberships);
const { error, loading, memberships } = listofmemberships;

const [searchText, setSearchText] = useState(''); // State to store search text
const [filteredMemberships, setFilteredMemberships] = useState(memberships); // State to store filtered members


useEffect(() => {
    dispatch(membershiplist());
  }, [dispatch]);


useEffect(() => {
    // Filter members based on searchText
    const filtered = memberships.filter(
      (membership) =>
      membership.description.toLowerCase().includes(searchText.toLowerCase())||
      membership.amount.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredMemberships(filtered);
}, [searchText, memberships]);

const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleMemberClick = (selectedMembership) => {

    onChangeMembership(selectedMembership)
    onHide()
    console.log("membership at component", selectedMembership)

  }


  return (
    <Modal show={show} onHide={onHide} size="lg">

    {error && <div>Error: {error.message}</div>}
      <Modal.Header closeButton>
        <Modal.Title>Select Membership</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="searchText">
          <Form.Label>Search Membership:</Form.Label>
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
              <th>Description</th>
              <th>Amount</th>
              <th>Validity</th>
              <th>Sessions</th>

              {/* Add more table headings for additional member data */}
            </tr>
          </thead>
          <tbody>
            {filteredMemberships.map((membership) => (
              <tr key={membership.id} onClick={() => handleMemberClick(membership)}>
                <td>{membership.id}</td>
                <td>{membership.description}</td>
                <td>{membership.amount}</td>
                <td>{membership.validity}</td>
                <td>{membership.sessions}</td>

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

export default ModalMembershipList
