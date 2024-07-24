import React, { useState, useEffect } from 'react';
import FormContainer from '../components/FormContainer';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, Table, Alert, ModalDialog } from 'react-bootstrap';
import { createInvoice } from '../actions/invoiceaction';
import MemberListModel from '../components/memberlist';
import ModalMembershipList from '../components/ModalMembershipList';
import ModalClubs from '../components/ModalClubs'
import ModalPaymentMethods from '../components/ModalPaymentMethods'
import ModalProducts from '../components/ModalProducts'
import ListofStaff from '../components/ListofStaff'
import { useNavigate } from 'react-router-dom';
import { resetMemberInfo } from '../actions/memberAction'; // Adjust the path as needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useClub } from '../context/ClubContext';
import ModalDiscount from '../components/ModalDiscount';

function Transaction() {
  const { selectedClub } = useClub();
  const navigate = useNavigate();

 

  const handleGoBack = () => {
    window.location.href = '/CreateMember' // Navigate to home or any other route
  };

  const location = useLocation();
  const memberData = location.state?.memberData;
  
  const showSuccessToast = () => {
    toast.success("Transaction successful!", {
        position: toast.POSITION.TOP_RIGHT
    });
};

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const [isMembersEmpty, setIsMembersEmpty] = useState(false);
  const [isPaymentsEmpty, setPaymentsEmpty] = useState(false);
  const [showMemberShipModal, setshowMemberShipModal] = useState(false);
  const [membershipDescription, setMembershipDescription] = useState(''); // State to store membership description
  const [paymentid, setPaymentId] = useState('')
  const [paymentamount, setPaymentAmount] = useState(0)
  const [paymentDescription, setPaymentDescription] = useState('')
  const [membershipAmount, setMembershipAmount] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [memberPTSessions, setMemberPTSessions] = useState(0);
  const [clubDescription, setClubDescription] = useState('');
  const [showClubModal, setShowClubModal] = useState(false);
  const [membershipType, setMembershipType] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');
  const [membershipValidity, setMembershipValidity] =  useState(0);
  const [membershipAsProduct, setMembershipAsProduct] = useState(null);
  const [assignedUserError, setAssignedUserError] = useState(null);

  const [showpaymentMethodModel, setShowPaymentMethodModal] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assigneduser, setAssignedUser] = useState(0)
 

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const openMembershipModal = () => setshowMemberShipModal(true);
  const closeMembershipModal = () => setshowMemberShipModal(false);

  const openClubModal = () => setShowClubModal(true);
  const closeClubModal = () => setShowClubModal(false);

  const openPaymentMethodModal = () => setShowPaymentMethodModal(true);
  const closePaymentMethodModal = () => setShowPaymentMethodModal(false);

  const openProductModal = () => setShowProductModal(true);
  const closeProductModal = () => setShowProductModal(false);

  const openDiscountModal = () => setShowDiscountModal(true);
  const closeDiscountModal = () => setShowDiscountModal(false);


  const transactionreducer = useSelector(state => state.transactionreducer);
  const { error, loading, invoice } = transactionreducer;
  const [totalAmount, setTotalAmount] = useState('');
  const [netAmount, setNetAmount] = useState('');
  const [totalPayment, setTotalPayment] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedMemberships, setSelectedMemberships] = useState([]);
  //const [selectedClub, setSelectedClub] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [selectedPaymentMethod, setSelecedPaymentMethod] = useState([]);
  const [transactionAmount, setTransactionAmount] = useState(0)
  const userInfoFromStorage = localStorage.getItem("userInfo") ?
  JSON.parse(localStorage.getItem("userInfo")) : null

  const [transactionData, setTransactionData] = useState({
    trandate: '',
    invoiceno: '',
    remarks: '',
    club_id: '',
    user_id: userInfoFromStorage.user_id,
    membership_id: '',
    amount: 0,
    memberlist: memberData && memberData.id ? [{ memberId: memberData.id }] : [],
    productlist:[],
    discountlist:[{discountId:1, amount:0}],
    payments: [],
    startDate: '',
    endDate: '',
    assignedUser: 0,
    noSessions: 0,
    membershipDescription: '', 
    clubDescription: '', 
  });



  useEffect(() => {
    if (selectedClub && selectedClub.club_id) {
          
      transactionData.clubDescription = selectedClub.clubname
      transactionData.club_id = selectedClub.club_id
      setTransactionData(prevData => ({
        ...prevData,
        club_id: selectedClub.club_id,
        clubDescription: selectedClub.clubname,
      }));

    

    }
  }, [selectedClub]);



  
  const [payments, setPayments] = useState([]);

  const handleInputChange = e => {
    const { name, value } = e.target;

    const parsedValue = name === 'noSessions' ? parseInt(value, 10) : value;

    setTransactionData({
      ...transactionData,
      [name]: parsedValue,
    });

   
  };

 
  const handleSubmit = e => {
    e.preventDefault();
    const totalPayments = payments.reduce((acc, payment) => acc + parseFloat(payment.paymentamount), 0);

    if (payments.length === 0) {
      setPaymentError("Error: Payment list is empty. Please add a payment.");
      return; // Prevent form submission
    }

    if (membershipType === 'PT' && (!assigneduser || assigneduser === 0)) {
      setAssignedUserError('Error: Assigned user is required for PT membership type.');
      return; // Prevent form submission
    }

    if (totalPayments != netAmount) {
      setPaymentError("Error: Payment amount does not match total amount.");
      return; // Prevent form submission
    }
  
    setPaymentError(null); // Clear any existing payment errors
   

    if (transactionData.memberlist.length === 0) {
        // Set isMembersEmpty to true
        setIsMembersEmpty(true);
        return; // Prevent form submission
      }

      setIsMembersEmpty(false);
      setAssignedUserError(null);

      if (membershipType === 'PT' && (!assigneduser || assigneduser === 0)) {
        setAssignedUserError('Error: Assigned user is required for PT membership type.');
        return; // Prevent form submission
      }

    dispatch(createInvoice(transactionData));

    showSuccessToast();

    setTimeout(() => {
      window.location.href = '/CreateMember'
    }, 2000); // 2000 milliseconds delay


    setTransactionData({
        trandate: '',
        invoiceno: '',
        remarks: '',
        club_id: selectedClub.club_id,
        user_id: userInfoFromStorage.user_id,
        membership_id: '',
        memberlist: [],
        productlist: [],
        discountlist: [], 
        payments: [],
        noSessions: 0,
        startDate: '',
        endDate: '',
        assignedUser: 0,
        amount: 0,
        membershipDescription: '',
        clubDescription: '',
      });

      setSelecedPaymentMethod([])
      setSelectedMembers([])
      setSelectedProducts([])
      setPayments([])
      setTransactionAmount(0)
      setMembershipAmount('')
      setMemberPTSessions(0)
      setStartDate('')
      setEndDate('')
      setFormattedEndDate('')      
  };

useEffect(() => {
    return () => {
        dispatch(resetMemberInfo());
    };
}, [dispatch]);

useEffect(() => {
  if (memberData) {
    const newMember = {
      id: memberData.id,
      firstname: memberData.firstname,
      // ... add other memberData properties if needed
    };

    setSelectedMembers(prevMembers => [...prevMembers, newMember]);

    setTransactionData(prevData => {
      const updatedMemberList = [...prevData.memberlist, { memberId: newMember.id }];
      return { ...prevData, memberlist: updatedMemberList };
    });
  }
}, [memberData]);


useEffect(() => {
    
  const validMembershipAmount = Number.isFinite(membershipAmount) ? membershipAmount : 0;

  // Calculate the total of all product amounts, ensuring each amount is a number
  const productsTotal = selectedProducts.reduce((acc, product) => {
      const productAmount = Number.isFinite(product.amount) ? product.amount : 0;
      return acc + productAmount;
  }, 0);

  // Calculate final total
  const finalTotal = Number(validMembershipAmount);
  const netTotal = Number(validMembershipAmount) + Number(productsTotal) - Number(discountValue);

  setTotalAmount(finalTotal);
  setNetAmount(netTotal);

  setTransactionData({
    ...transactionData,
    amount: finalTotal
  });
  console.log("this is membeship amount", membershipAmount)

  const newDiscount = {
    discountId: 1, // Assuming the discountId is always 1
    amount: discountValue,
  };

  // Update the transactionData with the new discount
  setTransactionData(prevData => ({
    ...prevData,
    discountlist: [newDiscount], // Replace existing discountlist with the new discount
  }));
   
}, [selectedProducts, membershipAmount, discountValue]);

  useEffect(() => {

      console.log("Total Amount is this", Number(totalAmount))

  }, [totalAmount])

  useEffect(() => {
    console.log('selectedMembers:', selectedMembers);
    console.log('transactionData: in here where it is going wrong', transactionData);
  }, [selectedMembers, transactionData]);

  useEffect(() => {
    console.log('membership data here', selectedMemberships);
  }, [selectedMemberships]);

  useEffect(() => {
    console.log('membership data here', selectedClub);
  }, [selectedClub]);

  useEffect(() => {
    console.log('clubdata here', selectedClub);
  }, [selectedClub]);

  useEffect(() => {
    console.log('paymentid here', payments);
  }, [payments]);

  const handleMemberChange = memberdata => {
    setSelectedMembers(prevMembers => [...prevMembers, memberdata]);
  
    setTransactionData(prevData => {
      const updatedMemberList = [...prevData.memberlist, { memberId: memberdata.id }];
      return { ...prevData, memberlist: updatedMemberList };
    });
  };

  const handleProductChange = productdata => {

    const updatedSelectedProducts = [...selectedProducts, productdata];
    const updatedProductList = [...transactionData.productlist, { productId: productdata.id, amount: productdata.amount }];
  
    setSelectedProducts(updatedSelectedProducts);
  
    setTransactionData({
      ...transactionData,
      productlist: updatedProductList, // Update productlist in transactionData
    });

  }

  const handleDiscountChange = discountdata => {

     const updatedSelectedDiscounts = [...selectedDiscounts, discountdata];
     setSelectedDiscounts(updatedSelectedDiscounts);
     

  }

  /*
  const handleClubChange = clubdata => {

    setSelectedClub([...selectedClub, clubdata]);


    setTransactionData({
      ...transactionData,
      club_id: clubdata.id,
      clubDescription: clubdata.clubname
    });


    setClubDescription(clubdata.clubname)
    console.log("this is club id", clubdata.id)

  }*/


  const handleMembershipChange = membershipdata => {
    setSelectedMemberships([...selectedMemberships, membershipdata]);
   // setIsMembersEmpty(selectedMembers.length === 0);
   setIsMembersEmpty(selectedMembers.length === 0);
    setMembershipAsProduct({
      id: `membership-${membershipdata.id}`, // Prefix to distinguish from actual products
      itemname: membershipdata.description,
      amount: membershipdata.amount,      
    });

    setTransactionData({
      ...transactionData,
      membership_id: membershipdata.id,
      membershipDescription: membershipdata.description,
      amount: membershipdata.amount,
      noSessions: membershipdata.sessions
      // Update membership description
    });

    setMembershipDescription(membershipdata.description); // Update membership description
    setMembershipAmount(Number(membershipdata.amount))
    setMembershipValidity(membershipdata.validity)
    setMemberPTSessions(membershipdata.sessions)

    if (membershipdata.membershiptype === 'PT') {
      setMembershipType("PT");
    } else {

      setMembershipType("PC");
    }
    closeMembershipModal();
  };


  const handlePaymentMethodChange = paymentdata => {

    setPaymentDescription(paymentdata.payment_description)
    setPaymentId(paymentdata.id)

  }



  const handlePaymentInputChange = e => {
    const { name, value } = e.target;
    setPaymentAmount(value); // Update paymentAmount state with the input value
  }


  const removeMember = index => {
    const updatedSelectedMembers = [...selectedMembers];
    updatedSelectedMembers.splice(index, 1);
    const updatedMemberList = [...transactionData.memberlist];
    updatedMemberList.splice(index, 1);

    setSelectedMembers(updatedSelectedMembers);
    setTransactionData({
      ...transactionData,
      memberlist: updatedMemberList,
    });
  };

  const removeProduct = index => {

    const updatedSelectedProducts = [...selectedProducts];
    updatedSelectedProducts.splice(index,1);
    const updatedProductList = [...transactionData.productlist];
    updatedProductList.splice(index,1);
  
    setSelectedProducts(updatedSelectedProducts);
    setTransactionData({

      ...transactionData,
      productlist: updatedProductList,
    });
  }


  const removePayment = index => {

    const updatedPayments = [...payments];
    updatedPayments.splice(index, 1);
    setPayments(updatedPayments)




    setTransactionData({
        ...transactionData,
        payments: updatedPayments,
      });

     
  }

  

  const handlePaymentButtonClick = () => {

    if (paymentamount <= 0) {
        // Payment amount is not valid
        // You can display an error message or take any other appropriate action
        setPaymentError("Payment amount must be greater than 0.");
        return;
      }
    
      setPaymentError(null);

    const newPayment = {
        paymentId: paymentid,
        paymentDescription: paymentDescription,
        paymentamount: paymentamount,
      };


      setPayments([...payments, newPayment])
    
      setTransactionData({
        ...transactionData,
        payments: [...transactionData.payments, newPayment],
      });
    
      // Clear input fields
      setPaymentId('');
      setPaymentDescription('');
      setPaymentAmount(0);


  }

  const handleTransactionAmount = () => {
 
    
    setTransactionData({
        ...transactionData,
        amount: membershipAmount,
      });

  }

  const handleStartDateChange = (e) => {
    const startDateValue = e.target.value;
    setStartDate(startDateValue);
  
    const startDateObject = new Date(startDateValue);
    const endDateObject = new Date(startDateObject);
    endDateObject.setDate(startDateObject.getDate() + membershipValidity);
    
    const endDateFormatted = endDateObject.toISOString().split('T')[0];
    setFormattedEndDate(endDateFormatted);

    setTransactionData({
      ...transactionData,
      startDate: startDateValue,
      endDate: endDateFormatted
    });
  };
  
  const handleEndDateChange = (e) => {
    const endDateValue = e.target.value;
    setEndDate(endDateValue);
  
    // Update transactionData with the new endDate
    setTransactionData({
      ...transactionData,
      endDate: endDateValue,
    });
  };
  
  const handleUserChange = (assignedusr) => {
    setAssignedUser(assignedusr.id);

    setTransactionData({
      ...transactionData,
      assignedUser: assignedusr.id,
    });
    
  };


  useEffect(() => {
    console.log('Membership Type here now:', membershipType);
  }, [membershipType]);

  return (
    <>
    <ToastContainer />
    <FormContainer hederText="Member Billing">
  
    <Row className="mb-3">

    <Col className="text-end">
            <Button type="button" variant="primary" onClick={openModal}>Select a Member</Button>
 

            </Col>


            <Col className="text-end">
                <Button variant="secondary" onClick={handleGoBack}>
                    Go Back
                </Button>
            </Col>

           

        </Row>

        
<div style={{ marginBottom: '20px' }}></div>



<Table striped bordered hover>
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Member Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedMembers.map((member, index) => (
              <tr key={index}>
                <td>{member.id}</td>
                <td>{member.firstname}</td>
                <td>
                  <Button variant="danger" onClick={() => removeMember(index)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>


        {paymentError && (
                    <Alert variant="danger">
                    {paymentError}
                    </Alert>
        )}


{assignedUserError && (
        <Alert variant="danger">
          {assignedUserError}
        </Alert>
      )}

    {isMembersEmpty && (
        <Alert variant="danger">
          Error: Member list is empty. Please select members.
        </Alert>
      )}

      <ModalMembershipList />
    

      <MemberListModel show={showModal} onHide={closeModal} onChangeMember={handleMemberChange} />
      <ModalMembershipList show={showMemberShipModal} onHide={closeMembershipModal} onChangeMembership={handleMembershipChange} />
      <ModalPaymentMethods show={showpaymentMethodModel} onHide={closePaymentMethodModal} onChangePaymentMethod={handlePaymentMethodChange}/>
      <ModalProducts show={showProductModal} onHide={closeProductModal} onProductChange={handleProductChange}/>

      <div className="container">

    
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
                
              <Form.Group controlId="trandate">
                <Form.Label>Transaction Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="trandate"
                  value={transactionData.trandate}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <div style={{ marginBottom: '20px' }}></div>
              <Form.Group controlId="invoiceno">
                <Form.Label>Invoice Number</Form.Label>
                <Form.Control
                  type="text"
                  name="invoiceno"
                  value={transactionData.invoiceno}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <div style={{ marginBottom: '20px' }}></div>
              <Form.Group controlId="club_id">
                <Form.Label>Club Name</Form.Label>
                <Form.Control
                  type="text"
                  name="club_id"
                  value={transactionData.clubDescription}
                  onChange={handleInputChange}
                  onClick={openClubModal}
                  required
                />
              </Form.Group>
             

              <div style={{ marginBottom: '20px' }}></div>
              <Form.Group controlId="payment_id">
                <Form.Label>Payment Method</Form.Label>
                <Form.Control
                  type="text"
                  name="paymentid"
                  value={paymentDescription}
                  onChange={handleInputChange}
                  onClick={openPaymentMethodModal}              
                />
              </Form.Group>

              

              <div style={{ marginBottom: '20px' }}></div>

              <Form.Group controlId='startDate'>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type='date'
                placeholder='Enter Start Date'
                value={startDate}
                onChange={handleStartDateChange}
                required
              />
            </Form.Group>
           
           
            <div style={{ marginBottom: '20px' }}></div>
              <Form.Group controlId="payment_amount">
          
              <Button type="button" variant="primary" onClick={openProductModal}>Select a Product</Button>
          <div style={{ marginBottom: '20px' }}></div>
              </Form.Group>

              
              <Form.Group controlId="payment_amount">
              <div style={{ marginBottom: '20px' }}></div>
       
          <div style={{ marginBottom: '20px' }}></div>
          {membershipType === 'PT' ? (

              <Form.Group controlId='noSessions'>
              <Form.Label>No. of Sessions</Form.Label>
              <Form.Control
                type='number'
                name = 'noSessions'
                placeholder='Enter Sessions'
                value={memberPTSessions}               
                required
              />
              </Form.Group>
                
          ) : null}

<div style={{ marginBottom: '20px' }}></div>
 <p>Total Amount : {totalAmount}</p>
 <p>Net Amount : {netAmount}</p>
 
  <div style={{ marginBottom: '20px' }}></div>
      </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="user_id">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  name="user_id"
                  value={transactionData.user_id}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <div style={{ marginBottom: '20px' }}></div>
              <Form.Group controlId="membership_id">
                <Form.Label>Product Type</Form.Label>
                <Form.Control
                  onClick={openMembershipModal}
                  type="text"
                  name="membership_id"
                  value={transactionData.membershipDescription} // Display the membership description
                  readOnly
                />
              </Form.Group>



              <div style={{ marginBottom: '20px' }}></div>
              
              <Form.Group controlId="membership_amount">
                <Form.Label>Product Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="membership_amount"
                  value={membershipAmount} // Display the membership description
                  onChange={(e) => {
                    // Check if the input value is an empty string
                    if (e.target.value === '') {
                      setMembershipAmount(''); // Set state to empty string
                    } else {
                      setMembershipAmount(Number(e.target.value)); // Otherwise, convert to number and set state
                    }
                  }}
                />
              </Form.Group>

             
             
              <div style={{ marginBottom: '20px' }}></div>

              <Form.Group controlId="payment_amount">
                <Form.Label>Payment Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="payment_amount"
                  value={paymentamount} // Display the membership description
                  onChange={handlePaymentInputChange}
              
                />
                 
              </Form.Group>
              <div style={{ marginBottom: '20px' }}></div>
              <Form.Group controlId='endDate'>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type='date'
                placeholder='Enter End Date'
                value={formattedEndDate}
                onChange={handleEndDateChange}
                readOnly
              />
            </Form.Group>

                    
            <div style={{ marginBottom: '20px' }}></div>
              
              <Form.Group controlId="discount_amount">
                <Form.Label>Discount Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="discount_amount"
                  value={discountValue} // Display the membership description
                  onChange={(e) => {
                    // Check if the input value is an empty string
                    if (e.target.value === '') {
                      setDiscountValue(0); // Set state to empty string
                    } else {
                      setDiscountValue(Number(e.target.value)); // Otherwise, convert to number and set state
                    }
                  }}
                />
              </Form.Group>
          

              
            </Col>

           
            
          </Row>


        
        <Row>


          
        </Row>

        {membershipType === 'PT' ? (
  <ListofStaff onUserChange={handleUserChange} />
) : null}

        <div style={{ marginBottom: '20px' }}></div>
       

        <div style={{ marginBottom: '20px' }}></div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Description</th>
              <th>Amount</th>

            </tr>
          </thead>
          <tbody>
          {membershipAsProduct && (
      <tr>
        <td>{membershipAsProduct.id}</td>
        <td>{membershipAsProduct.itemname}</td>
        <td>{membershipAsProduct.amount}</td>
        <td>
          {/* Display button or other elements as needed */}
        </td>
      </tr>
    )}

            {selectedProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.id}</td>
                <td>{product.itemname}</td>
                <td>{product.amount}</td>

                <td>
                  <Button variant="danger" onClick={() => removeProduct(index)}>
                    Remove
                  </Button>
                </td>
               
              </tr>
            ))}
          </tbody>
        </Table>
      
 <div style={{ marginBottom: '20px' }}></div>
            <Button type="button" variant="primary" onClick={handlePaymentButtonClick}>
             Add Payment
          </Button>
      
          <div style={{ marginBottom: '20px' }}></div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Payment Description</th>
              <th>Amount</th>

            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.paymentId}</td>
                <td>{payment.paymentDescription}</td>
                <td>{payment.paymentamount}</td>

                <td>
                  <Button variant="danger" onClick={() => removePayment(index)}>
                    Remove
                  </Button>
                </td>
               
              </tr>
            ))}
          </tbody>
        </Table>

        <Button type="submit" variant="primary">
            Submit
          </Button>
        </Form>
      </div>

      
    </FormContainer>
    </>
    
  );
}

export default Transaction;
