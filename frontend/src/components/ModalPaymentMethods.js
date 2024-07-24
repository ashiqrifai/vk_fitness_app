import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Form } from 'react-bootstrap'; 
import { getpaymentmethods } from '../actions/paymentmethod'

function ModalPaymentMethods({show, onHide, onChangePaymentMethod }) {

const dispatch = useDispatch()
const paymentmethodList = useSelector((state) => state.paymentmethodList);
const { error, loading, paymentmethods } = paymentmethodList;

const [searchText, setSearchText] = useState(''); // State to store search text
const [filteredPaymentMethods, setFilteredPaymentMethods] = useState(paymentmethods); // State to store filtered members



useEffect(() => {
    dispatch(getpaymentmethods());
  }, [dispatch]);

  useEffect(() => {
    // Filter members based on searchText
    const filtered = paymentmethods.filter(
      (paymentmethod) =>
      paymentmethod.payment_description.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredPaymentMethods(filtered);
}, [searchText, paymentmethods]);


const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleMemberClick = (selectedPamentMethod) => {

    onChangePaymentMethod(selectedPamentMethod)
    onHide()


  }

  return (
    <Modal show={show} onHide={onHide} size="lg">

    {error && <div>Error: {error.message}</div>}
      <Modal.Header closeButton>
        <Modal.Title>Select Payment Method</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="searchText">
          <Form.Label>Search Payment Method:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            value={searchText}
            onChange={handleSearchTextChange}
          />
        </Form.Group>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Description</th>
              {/* Add more table headings for additional member data */}
            </tr>
          </thead>
          <tbody>
            {filteredPaymentMethods.map((paymentmethod) => (
              <tr key={paymentmethod.id} onClick={() => handleMemberClick(paymentmethod)}>
                <td>{paymentmethod.id}</td>
                <td>{paymentmethod.payment_description}</td>          
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

export default ModalPaymentMethods
