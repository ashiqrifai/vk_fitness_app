import React from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Table } from 'react-bootstrap';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { commissiondetail } from '../actions/invoiceaction';
import { useClub } from '../context/ClubContext'

function PTDetail() {
  const commdetail = useSelector((state) => state.commissiondetail);
  const { error, loading, commission_detail } = commdetail;

  const location = useLocation();
  const { commdata } = location.state || {};
  const { selectedClub } = useClub();
  const dispatch = useDispatch();

  useEffect(() => {
    if (commdata.tranid) {
      dispatch(commissiondetail(commdata.tranid));
    }
  }, [dispatch, commdata.tranid]);

  if (!commdata) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h2>Details</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Record Id</th>
            <th>PT Name</th>
            <th>Member Name</th>
            <th>Club Name</th>
            <th>Total Sessions</th>
            <th>Sessions Conducted</th>
            <th>Membership Amount</th>
            <th>Comm. %</th>
            <th>Comm. Amt</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{commdata.tranid}</td>
            <td>{commdata.ptname}</td>
            <td>{commdata.member_name}</td>
            <td>{commdata.clubname}</td>
            <td>{commdata.total_sessions}</td>
            <td>{commdata.conducted_sessions}</td>
            <td style={{ textAlign: 'right' }}>
              {parseFloat(commdata.amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
            <td>{commdata.percentage}</td>
            <td style={{ textAlign: 'right' }}>
              {parseFloat(commdata.total_commission).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
          </tr>
        </tbody>
      </Table>

      <hr></hr>

      <div style={{ marginBottom: '20px' }}></div>

      <h2>Conducted Sessions</h2>
      <div style={{ marginBottom: '20px' }}></div>
      <Row>
        <Col md={12}>
          <Table striped bordered hover id="table-to-xls">
            <thead>
              <tr style={{ textAlign: 'center' }}>
                <th>Record Id</th>
                <th>Assigned Date</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Session Id</th>
                <th>Conducted Date</th>
                <th>Session Status</th>
              </tr>
            </thead>

            <tbody>
              {commission_detail &&
                commission_detail.map((comm_detail) => (
                  <tr key={comm_detail.session_id}>
                    <td>{comm_detail.id}</td>
                    <td>{comm_detail.assigned_date}</td>
                    <td>{comm_detail.start_date}</td>
                    <td>{comm_detail.end_date}</td>
                    <td>{comm_detail.session_id}</td>
                    <td>{comm_detail.session_date}</td>
                    <td>{comm_detail.session_status}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
}

export default PTDetail;
