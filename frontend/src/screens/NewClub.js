import React from 'react'
import FormContainer from '../components/FormContainer'
import { useState } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import {Row, Col, Form, Button, FormGroup} from 'react-bootstrap'
import {  createclub   } from '../actions/clubactions'

function NewClub() {

const [clubname, setClubName] = useState('')
const [clubcity, setClubCity] = useState('')

const dispatch = useDispatch()

const clubreducer = useSelector(state => state.clubreducer)
const {error, loading, clubinfo} = clubreducer



const submitHandler = (e) => {
    e.preventDefault()

    console.log(clubname)
    dispatch(createclub(clubname, clubcity))
    setClubName('')
    setClubCity('')

    

}


  return (
    <FormContainer hederText="Crate New Club">

      

<Form onSubmit={submitHandler}>

<Form.Group controlId='clubname'>

    <Form.Label>Club Name</Form.Label>
    <Form.Control type='text'
    placeholder='Enter Club Name'
    value={clubname}
    onChange={(e) => setClubName(e.target.value)}>
    </Form.Control>

</Form.Group>

    <Form.Group controlId='clubcity'>

        <Form.Label>City</Form.Label>
        <Form.Control type='text'
        placeholder='Enter City'
        value={clubcity}
        onChange={(e) => setClubCity(e.target.value)}>
        </Form.Control>

 </Form.Group>


 <div style={{ marginBottom: '20px' }}></div>
<Button type='submit' variant='primary'>Create</Button>


</Form>




      
    </FormContainer>
  )
}

export default NewClub
