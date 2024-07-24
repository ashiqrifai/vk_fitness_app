import React from 'react'
import FormContainer from '../components/FormContainer'
import { useState } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import {Row, Col, Form, Button, FormGroup} from 'react-bootstrap'
import {  createProduct   } from '../actions/productaction'
import { createclub } from '../actions/clubactions'


function NewProduct() {

const [productName, setProductName] = useState('')
const [productRate, setProductRate] = useState('')

const productReducer = useSelector(state => state.newproduct)
const {error, loading, clubinfo} = productReducer


const dispatch = useDispatch()

const submitHandler = () => {

  dispatch(createProduct(productName, productRate));
  setProductName('');
  setProductRate('');

}

  return (
    <FormContainer hederText="Create New Product">

      

    <Form onSubmit={submitHandler}>
    
    <Form.Group controlId='clubname'>
    
        <Form.Label>Product name</Form.Label>
        <Form.Control type='text'
        placeholder='Enter Product Name'
        value={productName}
        onChange={(e) => setProductName(e.target.value)}>
        </Form.Control>
    
    </Form.Group>
    
        <Form.Group controlId='clubcity'>
    
            <Form.Label>Product Rate</Form.Label>
            <Form.Control type='text'
            placeholder='Enter Product Rate'
            value={productRate}
            onChange={(e) => setProductRate(e.target.value)}>
            </Form.Control>
    
     </Form.Group>
    
    
     <div style={{ marginBottom: '20px' }}></div>
    <Button type='submit' variant='primary'>Create New Product</Button>
    
    
    </Form>
    
    
    
    
          
        </FormContainer>
  )
}

export default NewProduct
