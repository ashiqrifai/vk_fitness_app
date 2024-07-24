import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert,Row, Col, Image } from 'react-bootstrap';
import { useDispatch, useSelector  } from 'react-redux'
import { login  } from '../actions/useracrtions'
import snapimage from './snapfitness.jpg'
import FormContainer from '../components/FormContainer'
import snapweblogo from '../screens/snapweblogo.png'

function LoginScreen({onLogin, isLoggedIn}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errormessage, setErrorMessage] = useState('');

    const userlogin = useSelector(state => state.userlogin)
    const {error, loading,  userInfo} = userlogin
    
    const dispatch = useDispatch()

    useEffect(() => {

        if(userInfo){

            onLogin();
            setErrorMessage('');
            console.log("this is userinfo", userInfo)

        } else {

            setErrorMessage('Invalid email or password');
        }


  }, [dispatch, userInfo, error])

    const handleLogin = () => {
      // You can implement your login logic here, e.g., calling an API to validate credentials
      // For simplicity, we'll assume a hardcoded username and password
      const validEmail = 'user@example.com';
      const validPassword = 'password';
  
      dispatch(login(email, password))  


    


      if (email === validEmail && password === validPassword) {
        onLogin();
        errormessage('');
      } else {
        setErrorMessage('Invalid email or password');
      }
    };
  
    return (
      <Container fluid className="p-0 m-0"> {/* Added fluid and removed padding and margin */}
   
   
      <Row className="g-0"> {/* Remove gutter space between columns */}
        <Col md={6} style={{ 
                  backgroundImage: `url(${snapimage})`,
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center center',
                  minHeight: '100vh'
              }}>
        </Col>

        
                <Col md={6}>
                <FormContainer hederText="Snap Fitness User Login">

                <Image src={snapweblogo} alt="Snap Fitness" width={250} height={50} />

                <div style={{ marginBottom: '20px' }}></div>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <div style={{ marginBottom: '20px' }}></div>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <div style={{ marginBottom: '20px' }}></div>
          <Button
            variant="primary"
            type="button"
            onClick={handleLogin}
            disabled={isLoggedIn}
          >
            Login
          </Button>
        </Form>
        </FormContainer>
        </Col>
        </Row>
      </Container>
    );
}

export default LoginScreen
