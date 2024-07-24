import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormGroup, Dropdown } from 'react-bootstrap';
import { getProducts } from '../actions/productaction';

import '../styles/listofclubs.css';


function ListofProducts({onProductChange}) {

    const dispatch = useDispatch();
const productList = useSelector((state) => state.productlist);
const { loading, error, products } = productList;
  
const [selectedProduct, setSelectedProduct] = useState(null); // State to store the selected club

useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleClubChange = (selectedProduct) => {
    setSelectedProduct(selectedProduct); // Set the selected club in the state
    onProductChange(selectedProduct); // Call the onClubChange callback with the selected club
  };

  const dropdownStyle = {
    width: '100%',
    border: '1px solid #ced4da',
  };

return (
    <FormGroup>
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="clubDropdown" style={dropdownStyle}>
        {selectedProduct ? selectedProduct.itemname : 'Select a Product'} {/* Display selected club name */}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {products.map((product) => (
          <Dropdown.Item
            key={product.id}
            onClick={() => handleClubChange(club)}
          >
            {product.itemname}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  </FormGroup>
  )
}

export default ListofProducts
