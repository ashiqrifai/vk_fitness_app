import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form } from 'react-bootstrap'; // Import Table and Form from 'react-bootstrap'
import { memberlist } from '../actions/memberAction';
import { useClub } from '../context/ClubContext';

function MemberListModel({ show, onHide, onChangeMember }) {
  const dispatch = useDispatch();
  const listofmembers = useSelector((state) => state.listofmembers);
  const { error, loading, members } = listofmembers;
  const { selectedClub } = useClub();

  const [searchText, setSearchText] = useState(''); // State to store search text
  const [filteredMembers, setFilteredMembers] = useState(members); // State to store filtered members

  useEffect(() => {
    if (selectedClub && selectedClub.club_id) {
      dispatch(memberlist(selectedClub.club_id));
    } else {
      // Handle the case when selectedClub is null. 
      // Maybe show a message or use a default club_id.
      console.log('No club selected.');
    }
  }, [dispatch, selectedClub]);
  
  useEffect(() => {

    console.log("tis is selected club", selectedClub)

  }, [selectedClub])
  useEffect(() => {
    // Filter members based on searchText
    const filtered = members.filter(
      (member) =>
        member.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
        member.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
        member.email.toLowerCase().includes(searchText.toLowerCase()) ||
        member.mobilenumber.includes(searchText)
    );
    setFilteredMembers(filtered);
  }, [searchText, members]);

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleMemberClick = (selectedMember) => {

    onChangeMember(selectedMember)
    onHide()


  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="searchText">
          <Form.Label>Search Member:</Form.Label>
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
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Mobile No.</th>
              {/* Add more table headings for additional member data */}
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
  );
}

export default MemberListModel;
