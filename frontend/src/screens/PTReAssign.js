import React, { useEffect, useState } from 'react';
import UserListModal from '../components/UserListModal';
import { getptlist } from '../actions/useracrtions';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import ListofStaff from '../components/ListofStaff';
import { createPTReAssign } from '../actions/invoiceaction';

function PTReAssign() {
    const userptlist = useSelector((state) => state.userptlist);
    const reassignpt = useSelector((state) => state.reassignpt);

    const { loading, error, ptusers } = userptlist;
    const { reassign_loading, reassign_error, ressigninfo } = reassignpt;

    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    const dispatch = useDispatch();

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleUserChange = (userdata) => {
        dispatch(getptlist(userdata.id)); // Assuming getptlist action takes user ID
    };

    const handlePTChange = (session, assignedStaffId) => {
        if (session) {
            // User confirmation
            const isConfirmed = window.confirm("Do you want to update this record?");
    
            if (isConfirmed) {
                const remainingSessions = session.total_sessions - session.session_detail_count;
                const reassignData = {
                    session_id: session.session_id,
                    sessions: remainingSessions,
                    assigned_to: assignedStaffId.id
                };
                dispatch(createPTReAssign(reassignData));
            } else {
                
                console.log("User cancelled the update");
            }
        }
    };
    const selectSession = (session) => {
        setSelectedSession(session);
    };

    return (
        <div>
            <Button onClick={openModal}>Select a PT</Button>
            <UserListModal show={showModal} onHide={closeModal} onChangeUser={handleUserChange} />
            <h2>Member PT List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Session Id</th>
                        <th>Member Name</th>
                        <th>Total Sessions</th>
                        <th>Sessions Conducted</th>
                        <th>Sessions Remaining</th>
                        <th>Assign To</th>
                    </tr>
                </thead>
                <tbody>
                    {ptusers && ptusers.map((userdata) => (
                        <tr key={userdata.session_id} onClick={() => selectSession(userdata)}>
                            <td>{userdata.session_id}</td>
                            <td>{userdata.membername}</td>
                            <td>{userdata.total_sessions}</td>
                            <td>{userdata.session_detail_count}</td>
                            <td>{userdata.total_sessions - userdata.session_detail_count}</td>
                            <td><ListofStaff session={userdata} onUserChange={(assignedStaffId) => handlePTChange(userdata, assignedStaffId)} /></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default PTReAssign;
