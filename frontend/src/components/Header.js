import React, {useState, useEffect} from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import snapweblogo from '../screens/snapweblogo.png'
import { useDispatch, useSelector } from 'react-redux';
import { memberlist } from '../actions/memberAction';
import ClubList from './ClubList'
import { Container, Table, Navbar, Nav, Image, Form, FormControl, Button, Modal, ListGroup, InputGroup } from 'react-bootstrap';
import { useClub } from '../context/ClubContext'

function Header({ isLoggedIn, onLogout }) {
  const listofmembers = useSelector((state) => state.listofmembers);
  const { error, loading, members } = listofmembers;
  const dispatch = useDispatch();
  const { selectedClub } = useClub();


  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate('/login'); // Redirect to the login screen after logout
  };

  const userInfoFromStorage = localStorage.getItem("userInfo") ?
JSON.parse(localStorage.getItem("userInfo")) : null



const fullName =
    userInfoFromStorage &&
    `${userInfoFromStorage.first_name} ${userInfoFromStorage.last_name}`;


    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      if (selectedClub && selectedClub.club_id) {
        dispatch(memberlist(selectedClub.club_id));
      } else {
        // Handle the case when selectedClub is null. 
        // Maybe show a message or use a default club_id.
        console.log('No club selected.');
      }
    }, [dispatch, selectedClub]);
    useEffect(() => {

 
  
    }, [selectedClub])

    const handleSearch = (e) => {
      e.preventDefault();
      const results = members.filter((customer) =>
        customer.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.mobilenumber.includes(searchQuery)
        
      );
      setSearchQuery('')
      setSearchResults(results);
      setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSearchQueryClick = (e) => {
      // Trigger search when search query is clicked
      e.preventDefault();
      if (searchQuery) {
        handleSearch();
      }
    };


  return (
    <header>

     
     
      <Navbar bg="dark" data-bs-theme="dark" collapseOnSelect>
        <Container>
        

          <LinkContainer to="/">
            <Navbar.Brand>         
              <Image src={snapweblogo} alt="Snap Fitness" width={250} height={50} />
            </Navbar.Brand>
          </LinkContainer>
          <ClubList/>
       
          <Form className="d-flex" onSubmit={handleSearch}>
            <InputGroup>
              <FormControl
                type="search"
                placeholder="Search Member(s)"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-secondary" type="submit">
                Submit
              </Button>
            </InputGroup>
          </Form>
          <Nav className="py-3">
          
         
            {isLoggedIn ? (
              // If the user is logged in, show "Logoff"
            
              <Nav.Link onClick={handleLogout}>Logoff</Nav.Link>
              

            ) : (
              // If the user is not logged in, show "Login"
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>

              
            )}

            <Nav.Link>Logged In : {fullName}</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Search Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {searchResults.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                  <th>Barcode</th>
                </tr>
              </thead>
              <tbody>
              {searchResults.map((customer) => (
                  <tr key={customer.id} onClick={() => {navigate(`/MemberTransactions/${customer.id}`, { state: { customer } }); handleCloseModal();}}>
                    <td>{customer.firstname}</td>
                    <td>{customer.lastname}</td>
                    <td>{customer.email}</td>
                    <td>{customer.mobilenumber}</td>
                    <td>{customer.barcode}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No results found</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


    </header>
  );
}

export default Header;
