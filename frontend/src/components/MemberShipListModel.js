import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Table } from 'react-bootstrap';
import { listofmemberships } from '../actions/membershipaction';

function MemberShipListModel({ show, onHide, onChangeMembership }) {
  const dispatch = useDispatch();
  const membershipslist = useSelector((state) => state.membershipslist);
  const { error, loading, memberships } = membershipslist;

  const [searchText, setSearchText] = useState('');
  const [filteredMemberships, setFilteredMemberships] = useState(memberships);

  useEffect(() => {
    dispatch(listofmemberships());
  }, [dispatch]);

  useEffect(() => {
    const filtered = memberships.filter(
      (membership) =>
        membership.description.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredMemberships(filtered);
  }, [searchText, memberships]);

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleMembershipClick = (selectedMembership) => {
    onChangeMembership(selectedMembership);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Membership</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="searchText">
          <Form.Label>Search Membership:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by description"
            value={searchText}
            onChange={handleSearchTextChange}
          />
        </Form.Group>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Membership ID</th>
              <th>Description</th>
              <th>Amount 1</th>
              <th>Validity</th>

              {/* Add more table headings for additional membership data */}
            </tr>
          </thead>
          <tbody>
            {filteredMemberships.map((membership) => (
              <tr
                key={membership.id}
                onClick={() => handleMembershipClick(membership)}
              >
                <td>{membership.id}</td>
                <td>{membership.description}</td>
                <td>{membership.amount}</td>
                <td>{membership.validity}</td>
                {/* Add more table cells for additional membership data */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  );
}

export default MemberShipListModel;
