import React, { useState, useEffect } from 'react'
import ListofClubs from '../components/ListofClubs'
import FormContainer from '../components/FormContainer'
import {  useDispatch, useSelector } from 'react-redux'
import {Row, Col, Form, Button, FormGroup, ProgressBar} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import '../styles/screenstyle.css'
import { createMember, member, resetMemberInfo  } from '../actions/memberAction'
import { useClub } from '../context/ClubContext'

function validateMobileNumber(number) {
  const pattern = /^9715\d{8}$/;
  return pattern.test(number);
}

function NewMember() {
const { selectedClub } = useClub();

 
const navigate = useNavigate();

const [firstname, setFirstname] = useState('')
const [lastname, setLastname] = useState('')
const [email, setEmail] = useState('')
const [mobilenumber, setMobilenumber] = useState('')
const [barcode, setBarcode] = useState('')
const [clubId, setClubid] = useState('')

const memberCreate = useSelector(state => state.memberCreate)
const {error, loading, memberInfo} = memberCreate

const dispatch = useDispatch()

const  handleClubIdChange = (clubid) => {

  setClubid(selectedClub ? selectedClub.club_id : '');

  
}

useEffect(() => {
  return () => {
      // Dispatch the reset action when component unmounts
      dispatch(resetMemberInfo());
  };
}, [dispatch]);

useEffect(() => {

  setClubid(selectedClub ? selectedClub.club_id : '');
  console.log(selectedClub ? selectedClub.club_id : '')
}, [selectedClub])

useEffect(() => {
  if (memberInfo && !loading && !error) {
      navigate('/MemberSales', { state: { memberData: memberInfo } });
  }
}, [memberInfo, loading, error, navigate]);

const submitHandler = (e) => {
    e.preventDefault()
    if (!validateMobileNumber(mobilenumber)) {
      alert('Invalid mobile number. The number should start with 9715 and be followed by 7 digits.');
      return;
    }
    
    dispatch(createMember(firstname, lastname, mobilenumber, email, barcode, selectedClub.club_id))
    setFirstname('')
    setLastname('')
    setBarcode('')
    setEmail('')
    setMobilenumber('')
    setClubid('')

}

let loadingBar = null;


  return (
    <FormContainer hederText="Create New Member">
 {loading && (
        <div className="loading-overlay">
          <ProgressBar animated now={100} />
        </div>
      )}
<Form onSubmit={submitHandler}>

<Form.Group controlId='firstname'>

    <Form.Label>First Name</Form.Label>
    <Form.Control type='text'
    placeholder='Enter First Name'
    value={firstname}
    onChange={(e) => setFirstname(e.target.value)}>
    </Form.Control>

</Form.Group>


<Form.Group controlId='lastname'>

        <Form.Label>Last Name</Form.Label>
        <Form.Control type='text'
        placeholder='Enter Laster Name'
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}>
        </Form.Control>

 </Form.Group>

 <Form.Group controlId='email'>

        <Form.Label>Email</Form.Label>
        <Form.Control type='text'
        placeholder='Enter Email Address'
        value={email}
        onChange={(e) => setEmail(e.target.value)}>
        </Form.Control>

 </Form.Group>

<Form.Group controlId='mobilenumber'>

<Form.Label>Mobile Number</Form.Label>
<Form.Control type='text'
placeholder='Enter Mobile Number : eg: 9715xxxxxxxx'
value={mobilenumber}
onChange={(e) => setMobilenumber(e.target.value)}>
</Form.Control>

</Form.Group>

<Form.Group controlId='barcode'>

<Form.Label>Barcode</Form.Label>
<Form.Control type='text'
placeholder='Enter Barcode'
value={barcode}
onChange={(e) => setBarcode(e.target.value)}>
</Form.Control>


</Form.Group>


<div>
          <Form.Group controlId="clubId">
            <Form.Label>Select Club</Form.Label>
            <ListofClubs onClubChange={handleClubIdChange} />
          </Form.Group>
        </div>

<Button type='submit' variant='primary' className="mt-3 mb-3">Next</Button>

 
</Form>



       
    </FormContainer>
  )
}

export default NewMember
