import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form } from 'react-bootstrap'; 
import { getDiscounts } from '../actions/discountaction'

function ModalDiscount({show, onHide, onDiscountChange}) {

    const dispatch = useDispatch()
    const discount_list = useSelector((state) => state.discountlist);
    const { error, loading, discounts } = discount_list;
    
    const [searchText, setSearchText] = useState(''); // State to store search text
    const [filteredDiscounts, setFilteredDiscounts] = useState(discounts); // State to store filtered members
    
    
    useEffect(() => {
        dispatch(getDiscounts());
        console.log(discounts)
      }, [dispatch]);
    
      useEffect(() => {
        // Filter members based on searchText
        const filtered = discounts.filter(
          (discount) =>
            discount.description.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredDiscounts(filtered);
    }, [searchText, discounts]);

    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value);
      };
    
      const handlediscountclick = (selecteddiscount) => {
    
        onDiscountChange(selecteddiscount)
        onHide()
    
        console.log("Product at product modal component", selecteddiscount)
      
      }
    


  return (
    <Modal show={show} onHide={onHide} size="lg">

    {error && <div>Error: {error.message}</div>}
      <Modal.Header closeButton>
        <Modal.Title>Select Discount</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="searchText">
          <Form.Label>Search Discount:</Form.Label>
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
              <th>Discount ID</th>
              <th>Discount Name</th>
              {/* Add more table headings for additional member data */}
            </tr>
          </thead>
          <tbody>
            {filteredDiscounts.map((discount) => (
              <tr key={discount.id} onClick={() => handlediscountclick(discount)}>
                <td>{discount.id}</td>
                <td>{discount.description}</td>
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

export default ModalDiscount
