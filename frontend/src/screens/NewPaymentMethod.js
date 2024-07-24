import React from 'react'
import FormContainer from '../components/FormContainer'
import { useState } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import {Row, Col, Form, Button, FormGroup} from 'react-bootstrap'
import { createpayment_method } from '../actions/paymentmethod'


function NewPaymentMethod() {

const [paymentDescription, setpaymentDesctiption] = useState('')

const dispatch = useDispatch()

const paymentmethod = useSelector(state => state.paymentmethod)
const {error, loading, paymentmethods} = paymentmethod



const submitHandler = (e) => {
    e.preventDefault()

    
    dispatch(createpayment_method(paymentDescription))
    setpaymentDesctiption('')

    

}


  return (
    <FormContainer hederText="Create Payment Method">

   

<Form onSubmit={submitHandler}>

<Form.Group controlId='paymentMethod'>

<Form.Label>Payment Description</Form.Label>
<Form.Control type='text'
placeholder='Enter Payment Method'
value={paymentDescription}
onChange={(e) => setpaymentDesctiption(e.target.value)}>
</Form.Control>

</Form.Group>
<div style={{ marginBottom: '20px' }}></div>
<Button type='submit' variant='primary'>Create</Button>


</Form>




  
</FormContainer>
  )
}

export default NewPaymentMethod
