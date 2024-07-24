import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import { salesreport } from '../actions/invoiceaction';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import { useClub } from '../context/ClubContext'

function Homescreen() {
  const salesdata = useSelector(state => state.salesdata);
  const { error, loading, sales } = salesdata;
  const dispatch = useDispatch();
  const { selectedClub } = useClub();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    if (selectedClub && selectedClub.club_id) {
      dispatch(salesreport(start, end, selectedClub.club_id));
    }
  }, [dispatch, startDate, endDate, selectedClub]);


  const headers = [
    { label: 'Record Id', key: 'id' },
    { label: 'Trans. Date', key: 'trandate' },
    { label: 'Invoice #', key: 'invoiceno' },
    { label: 'Club Name', key: 'clubname' },
    { label: 'Membership', key: 'description' },
    { label: 'Transaction Amount', key: 'transaction_amount' },
    { label: 'Products Sold', key: 'products_amt' },
    { label: 'Discount', key: 'discount_amt' },
    { label: 'Member Name', key: 'firstname' },
    { label: 'Mobile No.', key: 'mobilenumber' },
    { label: 'Email', key: 'email' },
  ];

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  const handleReportLoad = () => {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    if (selectedClub && selectedClub.club_id) {
      dispatch(salesreport(start, end, selectedClub.club_id));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Club Sales Report</h2>
        <Form>
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
            <Col md={6}>
            <Button onClick={handleReportLoad} className="mt-3">Load Report</Button>
            </Col>

          </Row>
         
        </Form>
        <CSVLink
          data={sales}
          headers={headers}
          filename="sales.csv"
          className="btn btn-primary mt-3"
        >
          Export to CSV
        </CSVLink>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Record Id</th>
            <th>Trans Date</th>
            <th>Invoice #</th>
            <th>Club Name</th>
            <th>Membership</th>
            <th>Transaction Amount</th>
            <th>Products Sold</th>
            <th>Discount Amt</th>
            <th>Member Name</th>
            <th>Mobile No.</th>
            <th>Email</th>
            {/* Add more table headers for other member data properties */}
          </tr>
        </thead>
        <tbody>
          {sales.map((salesdata) => (
            <tr key={salesdata.id}>
              <td>{salesdata.id}</td>
              <td>{formatDate(salesdata.trandate)}</td>
              <td>{salesdata.invoiceno}</td>
              <td>{salesdata.clubname}</td>
              <td>{salesdata.description}</td>
              <td style={{ textAlign: 'right' }}>
                {parseFloat(salesdata.transaction_amount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
              </td>
              <td style={{ textAlign: 'right' }}>
                {parseFloat(salesdata.products_amt).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
              </td>
              <td style={{ textAlign: 'right' }}>
                {parseFloat(salesdata.discount_amt).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
              </td>
              <td>{salesdata.membername}</td>
              <td>{salesdata.mobilenumber}</td>
              <td>{salesdata.email}</td>
              {/* Add more table data cells for other member data properties */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Homescreen;
