import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
function FormContainer({children, hederText}) {
  return (

    <div>

<div
      style={{
        backgroundColor: 'maroon',
        color: 'white',
        height: '50px', // Adjust the height as needed
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '30px', // Adjust the padding as needed
        fontSize: '20px',
        fontWeight: "10px",
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      {hederText}
    </div>
       
    
    <Container>


        <Row className='justify-content-md-center mt-4'>

                <Col xs={12} md={6}>
                
                    {children}

                </Col>

        </Row>


      
    </Container>

    </div>
  )
}

export default FormContainer
