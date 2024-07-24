import { useEffect, useState } from 'react';
import MemberListModel from '../components/memberlist';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { commissionreport } from '../actions/invoiceaction';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CSVLink } from 'react-csv'; // Import the library
import { useClub } from '../context/ClubContext'
import { useNavigate } from 'react-router-dom';
import './ManagePTSessions.css'; 

function ManagePTSessions() {
const commissiondata = useSelector(state => state.commissiondata)
const {error, loading, commissions} = commissiondata
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);


const dispatch = useDispatch();
const { selectedClub } = useClub();
const navigate = useNavigate();

const handleSearch = () => {
  if (startDate && endDate) {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    dispatch(commissionreport(start, end, selectedClub.club_id));
    console.log("starte date", start);
  }
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};




useEffect(() => {
  // Initial load with default dates
  handleSearch();
  console.log("selected club", selectedClub)
}, [startDate, endDate, selectedClub]);

const headers = [
    { label: 'Tran. Date', key: 'trandate' },
    { label: 'Session Id', key: 'tranid' },
    { label: 'PT Name', key: 'ptname' },
    { label: 'Club Id', key: 'club_id' },
    { label: 'Club', key: 'clubname' },
    { label: 'Member Name', key: 'member_name' },
    { label: 'Transaction Id', key: 'transaction_id' },
    { label: 'Rate for Comm', key: 'act_rate' },
    { label: 'Transaction Amount', key: 'amount' },
    { label: 'Total Sessions', key: 'total_sessions' },
    { label: 'Sessions Conducted', key: 'conducted_sessions' },
    { label: 'Membership Amount', key: 'amount' },
    { label: 'Comm. %', key: 'percentage' },
    { label: 'Comm. Amt', key: 'total_commission' },
  ];


  const handleRowClick = (commdata) => {
    navigate('/PTDetail', { state: { commdata } });
  };



  return (
    <div>

<CSVLink
        data={commissions} // Your data array
        headers={headers} // Headers to define CSV structure
        filename="commission_data.csv" // Name of the CSV file
        className="btn btn-primary"
      >
        Export to CSV
      </CSVLink>
   
    <div style={{ marginBottom: '20px' }}></div>
         
          <h2>Member PT List</h2>
          <div style={{ marginBottom: '20px' }}></div>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="form-control"
                />
              </Form.Group>
            </Col>

          </Row>
          <div style={{ marginBottom: '20px' }}></div>
          <Table striped bordered hover id="table-to-xls">
            <thead>
              <tr style={{ textAlign: 'center' }}>
                <th>Record Id</th>
                <th>PT Name</th>
                <th>Member Name</th>
                <th>Club Name</th>
                <th>Total Sessions</th>
                <th>Sessions Conducted</th>
                <th>Membership Amount</th>         
                <th>Comm. %</th>
                <th>Comm. Amt</th>
    
                {/* Add more table headers for other memberdata properties */}
              </tr>
            </thead>
            <tbody>
              {commissions.map((commdata) => (
                <tr key={commdata.tranid}  onClick={() => handleRowClick(commdata)}>
                  <td className="clickable-column">{commdata.tranid}</td>
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

                  {/* Add more table data cells for other memberdata properties */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
  )
}

export default ManagePTSessions
