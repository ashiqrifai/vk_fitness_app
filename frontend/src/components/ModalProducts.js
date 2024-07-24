import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form } from 'react-bootstrap'; 
import { getProducts } from '../actions/productaction'

function ModalProducts({show, onHide, onProductChange}) {

    const dispatch = useDispatch()
    const productlist = useSelector((state) => state.productlist);
    const { error, loading, products } = productlist;
    
    const [searchText, setSearchText] = useState(''); // State to store search text
    const [filteredProducts, setFilteredProducts] = useState(products); // State to store filtered members
    
    
    useEffect(() => {
        dispatch(getProducts());
        console.log(products)
      }, [dispatch]);
    
      useEffect(() => {
        // Filter members based on searchText
        const filtered = products.filter(
          (product) =>
          product.itemname.toLowerCase().includes(searchText.toLowerCase())||
          product.amount.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchText, products]);
    
    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value);
      };
    
      const handleproductClick = (selectedProduct) => {
    
        onProductChange(selectedProduct)
        onHide()
    
        console.log("Product at product modal component", selectedProduct)
      
      }
    

  return (
    <Modal show={show} onHide={onHide} size="lg">

    {error && <div>Error: {error.message}</div>}
      <Modal.Header closeButton>
        <Modal.Title>Select Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="searchText">
          <Form.Label>Search Product:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product Name"
            value={searchText}
            onChange={handleSearchTextChange}
          />
        </Form.Group>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Product Rate</th>
              {/* Add more table headings for additional member data */}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} onClick={() => handleproductClick(product)}>
                <td>{product.id}</td>
                <td>{product.itemname}</td>
                <td>{product.amount}</td>
                {/* Add more table cells for additional member data */}
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalProducts
