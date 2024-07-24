import React from 'react'
import FormContainer from '../components/FormContainer'
import { useState } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import {Row, Col, Form, Button, FormGroup} from 'react-bootstrap'
import {  createDiscount   } from '../actions/discountaction'

function NewDiscount() {

const [discountName, setDiscountName] = useState('')


const discountReducer = useSelector(state => state.newdiscount)
const {error, loading, clubinfo} = discountReducer

const dispatch = useDispatch()

const submitHandler = () => {

  dispatch(createDiscount(discountName));
  setDiscountName('');

}

  return (
    <FormContainer hederText="Create New Discount">

      

    <Form onSubmit={submitHandler}>
    
    <Form.Group controlId='discname'>
    
        <Form.Label>Discount name</Form.Label>
        <Form.Control type='text'
        placeholder='Enter Discount Name'
        value={discountName}
        onChange={(e) => setDiscountName(e.target.value)}>
        </Form.Control>
    
    </Form.Group>
    

    
     <div style={{ marginBottom: '20px' }}></div>
    <Button type='submit' variant='primary'>Create New Discount</Button>
    
    
    </Form>
    
    
    
    
          
        </FormContainer>
  )
}

export default NewDiscount
