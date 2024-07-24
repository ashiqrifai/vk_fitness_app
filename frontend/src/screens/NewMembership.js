import React, { useEffect } from 'react'
import FormContainer from '../components/FormContainer'
import { useState } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import {Row, Col, Form, Button, FormGroup} from 'react-bootstrap'
import {  createmembership   } from '../actions/membershipaction'

function NewMembership() {
const [description, setDescription] = useState('')
const [membershiptype, setMembershiptype] = useState('')
const [amount, setAmount] = useState(0)
const [validity, setValidity] = useState(0)
const [sessions, setSessions] = useState(0)
const [nsid, setNsId] = useState('')


const membershipReducer = useSelector(state => state.membershipReducer)
const {error, loading, membershipinfo} = membershipReducer

const dispatch = useDispatch()


const submitHandler = (e) => {
        e.preventDefault()
        const validityNumber = parseInt(validity);
        const prodamount = parseFloat(amount);

        const requestPayload = {
          description,
          membershiptype,
          amount: prodamount,
          nsid,
          validity: validityNumber,
          sessions: sessions
        };
    
        console.log("Request Payload:", requestPayload); // Log the request payload
    

        dispatch(createmembership(requestPayload))
        setDescription('');
        setMembershiptype('');
        setAmount('');
        setValidity('');
        setSessions('');
        setNsId('');



      

}

useEffect(() => {

  console.log(membershiptype)

}, [membershiptype])


const renderValidityInput = () => {
  
    return (
      <Form.Group controlId='validity'>
        <Form.Label>Validity Days</Form.Label>
        <Form.Control type='number' onChange={(e) => setValidity(e.target.value)} value={validity} />
      </Form.Group>
    )
}


return (
 
<FormContainer hederText="Create New Membership for Billing">

<Form onSubmit={submitHandler}>

<Form.Group controlId='description'>

<Form.Label>Description</Form.Label>
<Form.Control type='text'
placeholder='Enter Membership Description'
value={description}
onChange={(e) => setDescription(e.target.value)}>
</Form.Control>

</Form.Group>

<Form.Group controlId="membershiptype">
      <Form.Label>Select Membership Type</Form.Label>
      <Form.Control as="select" 
      onChange={(e) => setMembershiptype(e.target.value)}
      value={membershiptype}>
        <option value="PLAN">Package</option>
        <option value="PT">Personal Training</option>
      
      </Form.Control>
    </Form.Group>



<Form.Group controlId='amount'>

    <Form.Label>Membership Fee</Form.Label>
    <Form.Control type="number" step="0.01" placeholder="0.00" 
    value={amount}
    onChange={(e) => setAmount(e.target.value)}>
    
    </Form.Control>

</Form.Group>

{renderValidityInput()}

<Form.Group controlId='nsid'>
    <Form.Label>Netsuite Id</Form.Label>
    <Form.Control type="text" 
    value = {nsid}
    onChange={(e) => setNsId(e.target.value)}>
    </Form.Control>
</Form.Group>


<Form.Group controlId='session'>

    <Form.Label>No Sessions</Form.Label>
    <Form.Control type="text" 
    value={sessions}
    onChange={(e) => setSessions(e.target.value)}>
    </Form.Control>

</Form.Group>



<div style={{ marginBottom: '20px' }}></div>
<Button type='submit' variant='primary'>Create</Button>


</Form>




  
</FormContainer>
  )
}

export default NewMembership
