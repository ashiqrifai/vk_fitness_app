import { useState } from 'react';
import MemberListModel from '../components/memberlist';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getmemberptlist } from '../actions/memberAction';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function MemberPTAssign() {
  const memberptlist = useSelector((state) => state.memberptlist);
  const { loading, error, memberpts } = memberptlist;
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleMemberChange = (memberdata) => {
    dispatch(getmemberptlist(memberdata.id));
  };

  return (
    <div>

<div style={{ marginBottom: '20px' }}></div>
      <Button onClick={openModal}>Select a Member</Button>
      <MemberListModel show={showModal} onHide={closeModal} onChangeMember={handleMemberChange} />
      <div style={{ marginBottom: '20px' }}></div>
      <h2>Member PT List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Transaction Id</th>
            <th>Member Id</th>
            <th>Name</th>
            <th>Transaction Date</th>
            <th>Invoice No.</th>
            <th>Membership</th>
            <th>Assigned To</th>

            {/* Add more table headers for other memberdata properties */}
          </tr>
        </thead>
        <tbody>
          {memberpts.map((memberdata) => (
            <tr key={memberdata.member_id}>
 <td>
        {memberdata.assigned_to_user_name ? (
          memberdata.transaction_id
        ) : (
          <Link to={`/memberptassign/${memberdata.transaction_id}`}>{memberdata.transaction_id}</Link>
        )}
      </td>
              <td>{memberdata.member_id}</td>
              <td>{memberdata.member_name}</td>
              <td>{memberdata.trandate}</td>
              <td>{memberdata.invoiceno}</td>s
              <td>{memberdata.membership_description}</td>       
              <td>
                {memberdata.member_pt_sessions ? (
                  memberdata.assigned_to_user_name
                ) : (
                  // Display nothing if member_pt_sessions[0] does not exist
                  'Not Assigned'
                )}
              </td>      

              {/* Add more table data cells for other memberdata properties */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default MemberPTAssign;
