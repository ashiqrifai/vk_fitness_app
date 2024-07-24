import { useState, useCallback } from 'react'
import React from 'react'
import FormContainer from '../components/FormContainer'
import {  useDispatch, useSelector } from 'react-redux'
import {Row, Col, Form, Button, FormGroup} from 'react-bootstrap'
import { register } from '../actions/useracrtions'
import ListofClubs from '../components/ListofClubs'


function UserRegister() {
const [email_address, setEmailAddress] = useState('')
const [firstname, setFirstName] = useState('')
const [lastname, setLastName] = useState('')
const [clubid, setClubId] = useState('')
const [clubs, setSelectedClubs] = useState([]);
const [password, setPassword] = useState('')
const [confirmpassword, setConfirmPassword] = useState('')
const [resetKey, setResetKey] = useState(0);

const dispatch = useDispatch()




const userRegister = useSelector(state => state.userRegister)
const {error, loading, userInfo} = userRegister

const handleClubIdChange = useCallback((clubIds) => {
    setSelectedClubs(clubIds);
  }, []);



  

const submitHandler = (e) => {
    e.preventDefault()
    
    if (!clubs || clubs.length === 0) {
        // Display an error message
        alert("Please select at least one club before submitting.");
        return; // Early return to prevent the rest of the function from executing
    }

  
dispatch(register(email_address, firstname, lastname, password, clubs, "user"))

    setEmailAddress('');
    setFirstName('');
    setLastName('');
    setPassword('');
    setSelectedClubs([]);
    setConfirmPassword('');
    setResetKey(prevKey => prevKey + 1);
    console.log("After resetting:", clubs);
}


  return (
    
    
    
    <FormContainer hederText="Register New User">
       
  

        <Form onSubmit={submitHandler}>

        <div className="maroon-bg"> {/* Apply maroon background */}
     
    </div>


                <Form.Group controlId='email'>

                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email'
                    placeholder='Enter Email Id'
                    value={email_address}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                    >
                  
                    </Form.Control>

                </Form.Group>

                <Form.Group controlId='fname'>

                    <Form.Label>First Name</Form.Label>
                    <Form.Control type='text'
                    placeholder='Enter First Name'
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}>
                    </Form.Control>

                    </Form.Group>

                    <Form.Group controlId='lname'>

                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type='text'
                        placeholder='Enter Last Name'
                        value={lastname}
                        onChange={(e) => setLastName(e.target.value)}>
                        </Form.Control>

                        </Form.Group>


                 <Form.Group controlId='password'>

                    <Form.Label>Password</Form.Label>

                    <Form.Control type='password'
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>

                </Form.Control>

                </Form.Group>

                <div>

                    <Form.Group controlId="clubId">
                        <Form.Label>Select Club</Form.Label>
                        <ListofClubs key={resetKey} onClubChange={handleClubIdChange}  />
                    </Form.Group>
                    
        </div>


        <div style={{ marginBottom: '20px' }}></div>
            
                <Button type='submit' variant='primary'>Register New User</Button>


            </Form>



    </FormContainer>
  )
}

export default UserRegister
