import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { gettransactionbyId, createPTAssign } from '../actions/invoiceaction';
import { Form, Button, FormGroup, Row, Col, Table, Alert } from 'react-bootstrap';
import ListofStaff from '../components/ListofStaff'

function AssignPTToMember() {
  const transactionlist = useSelector((state) => state.transactionlist);
  const ptassign = useSelector((state) => state.ptassign)

  const { error, loading, transactions } = transactionlist;
  const { ptassigninfo } = ptassign

  const dispatch = useDispatch();
  const { transactionId } = useParams();


  const [noSessions, setNoSessions] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assigneduser, setAssignedUser] = useState('')

  const [ptassignData, setPtAssignData] = useState({

    assignedDate: '',
    startDate: '',
    endDate: '',
    transactionId: '',
    memberId: '',
    assignedUser: '',
    clubId: '',
    ptsessions: 0,
    amount: 0


  })

  useEffect(() => {

    setPtAssignData({
        ...setPtAssignData,
        transactionId: transactionId,
        memberId: transactions?.[0]?.member_id,
        clubId: transactions?.[0]?.club_id,
        amount: transactions?.[0]?.transaction_amount,
        startDate: startDate, 
        endDate: endDate, 
        assignedDate: startDate,
        ptsessions: noSessions,
        assignedUser: assigneduser
   
      });

   

  }, [transactionId, transactions?.[0]?.member_id, transactions?.[0]?.club_id, startDate, endDate, assigneduser])




  useEffect(() => {

    console.log(ptassignData)

  }, [ptassignData])


  const handleUserChange = (assignedusr) => {
    setAssignedUser(assignedusr.id);
  };
  
 
  useEffect(() => {
    dispatch(gettransactionbyId(transactionId));
  }, [dispatch, transactionId]);

  const submitHandler = () => {
    dispatch(createPTAssign(ptassignData))
  };

  return (
    
    

    <FormContainer hederText="Assign Personal Trainer">
        
        
      <Form onSubmit={submitHandler}>
    
        <Row>
          <Col md={6}>
            <Form.Group controlId='membershipType'>
              <Form.Label>Membership Type</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Membership Type'
                value={transactions?.[0]?.membership_description || ''}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId='invoiceNo'>
              <Form.Label>Invoice No.</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Invoice No.'
                value={transactions?.[0]?.invoiceno || ''}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId='startDate'>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type='date'
                placeholder='Enter Start Date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Form.Group>


            <Form.Group controlId='amountpaid'>
              <Form.Label>Amount Paid</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter End Date'
                value={transactions?.[0]?.transaction_amount || ''}
                readOnly
              />
            </Form.Group>


          </Col>

          <Col md={6}>
            <Form.Group controlId='memberName'>
              <Form.Label>Member Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Member Name'
                value={transactions?.[0]?.member_name || ''}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId='noSessions'>
              <Form.Label>Number of Sessions</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Number of Sessions'
                value={noSessions}
                onChange={(e) => setNoSessions(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='endDate'>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type='date'
                placeholder='Enter End Date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='clubName'>
              <Form.Label>Club Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Club Name'
                value={transactions?.[0]?.club_name || ''}
                readOnly
              />
            </Form.Group>

            

          </Col>

          <ListofStaff onUserChange = {handleUserChange} />
        </Row>

        <Button type='submit' variant='primary'>
          Assign
        </Button>
      </Form>
    </FormContainer>
  );
}

export default AssignPTToMember;
