import React from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Table } from 'react-bootstrap';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { member_transaction_detail } from '../actions/invoiceaction';
import { useClub } from '../context/ClubContext'


function MemberTransactions() {
const { state } = useLocation();
const { customerId } = useParams();
const customer = state?.customer;

const navigate = useNavigate();

  const transdetail = useSelector((state) => state.membertransaction);
  const { error, loading, membertrans } = transdetail;
  const dispatch = useDispatch();
  const { selectedClub } = useClub();

  useEffect(() => {
    if (!selectedClub || !selectedClub.club_id) {
      
    } else if (customer && customer.id) {
      dispatch(member_transaction_detail(customer.id, selectedClub.club_id));
    }
  }, [dispatch, customer, selectedClub, navigate]);



   
  return (
    <div>
      <h2>Member Info</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Member Id</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile No.</th>
            <th>Barcode</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{customer.id}</td>
            <td>{customer.firstname}</td>
            <td>{customer.lastname}</td>
            <td>{customer.email}</td>
            <td>{customer.mobilenumber}</td>
            <td>{customer.barcode}</td>
          </tr>
        </tbody>
      </Table>

      <hr></hr>

      <div style={{ marginBottom: '20px' }}></div>

<h2>Transaction Detail</h2>
<div style={{ marginBottom: '20px' }}></div>
<Row>
  <Col md={12}>
    <Table striped bordered hover id="table-to-xls">
      <thead>
        <tr style={{ textAlign: 'center' }}>
          <th>Record Id</th>
          <th>Tran. Date</th>
          <th>Invoice No.</th>
          <th>Product Description</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Transaction Amount</th>
          <th>Product Sales</th>
          <th>Discount</th>

        </tr>
      </thead>

      <tbody>
        {membertrans &&
          membertrans.map((trans) => (
            <tr key={membertrans.id}>
              <td>{trans.id}</td>                
              <td>{trans.trandate}</td>
              <td>{trans.invoiceno}</td>
              <td>{trans.description}</td>
              <td>{trans.startdate}</td>
              <td>{trans.enddate}</td>

              <td style={{ textAlign: 'right' }}>
              {parseFloat(trans.transaction_amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
            <td style={{ textAlign: 'right' }}>
              {parseFloat(trans.product_amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
            <td style={{ textAlign: 'right' }}>
              {parseFloat(trans.discount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
            </tr>
          ))}
      </tbody>
    </Table>
  </Col>
</Row>


    </div>
  )
}



export default MemberTransactions
