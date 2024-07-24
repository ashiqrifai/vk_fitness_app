import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form } from 'react-bootstrap';
import { memberlist } from '../actions/memberAction';

function MemberListModel({ show, onHide, onChangeMember, clubId }) {
  const dispatch = useDispatch();
  const listofmembers = useSelector((state) => state.listofmembers);
  const { error, loading, members } = listofmembers;

  // Initialize filteredMembers state with members if members is not undefined
  const [searchText, setSearchText] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    if (clubId !== undefined) {
      dispatch(memberlist(clubId));
    } else {
      console.error("clubId is undefined in MemberListModel");
    }
  }, [dispatch, clubId]);

  useEffect(() => {
    setFilteredMembers(members || []); // Ensure members is defined before setting state
  }, [members]);

  useEffect(() => {
    const filtered = members?.filter(
      (member) =>
        member.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
        member.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
        member.email.toLowerCase().includes(searchText.toLowerCase()) ||
        (member.mobilenumber && member.mobilenumber.includes(searchText))
    ) || [];

    setFilteredMembers(filtered);
  }, [searchText, members]);

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleMemberClick = (selectedMember) => {
    onChangeMember(selectedMember);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      {error && <div>Error: {error.message}</div>}
      <Modal.Header closeButton>
        <Modal.Title>Select Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="searchText">
          <Form.Label>Search Member:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by name, email or mobile"
            value={searchText}
            onChange={handleSearchTextChange}
          />
        </Form.Group>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Member ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile No</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id} onClick={() => handleMemberClick(member)}>
                <td>{member.id}</td>
                <td>{member.firstname}</td>
                <td>{member.lastname}</td>
                <td>{member.email}</td>
                <td>{member.mobilenumber}</td>
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

export default MemberListModel;
