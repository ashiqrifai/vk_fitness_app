import React from 'react';
import { Link, Route, Routes, useNavigate, BrowserRouter as Router } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import MemberSales from './MemberSales'; // Import the MemberSales component
import Homescreen from '../screens/Homescreen';
import CreateMember from './CreateMember';
import UserRegister from '../screens/UserRegister';
import NewMembership from '../screens/NewMembership';
import NewClub from '../screens/NewClub';
import NewMember from '../screens/NewMember';
import Transaction from '../screens/Transaction';
import NewPaymentMethod from '../screens/NewPaymentMethod';
import MemberPTAssign from '../screens/MemberPTAssign';
import AssignPTToMember from '../screens/AssignPTToMember';
import ManagePTSessions from '../screens/ManagePTSessions';
import PTReAssign from '../screens/PTReAssign';
import NewDiscount from '../screens/NewDiscount'

import LoginScreen from '../screens/LoginScreen';
import NewProduct from '../screens/NewProduct';
import PTSessionExtend from '../screens/PTSessionExtend';
import PTDetail from '../screens/PTDetail';
import MemberTransactions from '../screens/MemberTransactions';

function Sidenav({isLoggedIn}) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const userType = userInfo.user_type;
 
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Static Navigation Bar on the Left */}
        <Col md={2}>
          <nav className="navbar navbar-expand-lg navbar-light bg-light  sidebar">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
              <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav flex-column">
              {userType === 'Admin' && (
              <>       
              <li className="nav-item" >
                  <Link to="/Home" className="nav-link">Home</Link>
                </li>
              
                <li className="nav-item">
                  <Link to="/CreateMember" className="nav-link">Create New Member</Link>
                </li>

                <li className="nav-item">
                  <Link to="/MemberSales" className="nav-link">New Product Sales</Link>
                </li>

                <li className="nav-item">
                  <Link to="/ReAssign" className="nav-link">Re Assign PT</Link>
                </li>

                <li className="nav-item">
                  <Link to="/PTCommission" className="nav-link">PT Commission Report</Link>
                </li>

                <li className="nav-item">
                  <Link to="/PTExtend" className="nav-link">Extend PT Validity</Link>
                </li>
               
                <li className="nav-item">
                  <Link to="/UserRegister" className="nav-link">Create New Staff</Link>
                </li>
                <li className="nav-item">
                  <Link to="/NewMembership" className="nav-link">Create New Membership</Link>
                </li>
                <li className="nav-item">
                  <Link to="/NewClub" className="nav-link">Create New Club</Link>
                </li>
                <li className="nav-item">
                  <Link to="/NewPaymentMethod" className="nav-link">Create New Payment Method</Link>
                </li>
                
                <li className="nav-item">
                  <Link to="/NewProduct" className="nav-link">Create New Product</Link>
                </li>

                <li className="nav-item">
                  <Link to="/NewDiscount" className="nav-link">Create New Discount</Link>
                </li>



                </>

               )}

              {userType === 'user' && (
              <>       
              <li className="nav-item" >
                  <Link to="/Home" className="nav-link">Home</Link>
                </li>
              
                <li className="nav-item">
                  <Link to="/CreateMember" className="nav-link">Create New Member</Link>
                </li>

                <li className="nav-item">
                  <Link to="/MemberSales" className="nav-link">New Product Sales</Link>
                </li>

                <li className="nav-item">
                  <Link to="/ReAssign" className="nav-link">Re Assign PT</Link>
                </li>

                <li className="nav-item">
                  <Link to="/PTCommission" className="nav-link">PT Commission Report</Link>
                </li>

               

                
                </>

               )}
                
                
              </ul>
            </div>
          </nav>
        </Col>

        {/* Content on the Right */}
        <Col md={10}>
          
          <Routes>

            <Route path="/Home" element={<Homescreen />} exact/>
            <Route path="/MemberSales" element={<Transaction />} />
            <Route path="/CreateMember" element={<NewMember />} />
            <Route path="/UserRegister" element={<UserRegister />} />
            <Route path="/NewMembership" element={<NewMembership />} />
            <Route path="/NewClub" element={<NewClub />} />
            <Route path="/NewPaymentMethod" element={<NewPaymentMethod />} />
            <Route path="/MemberPT" element={<MemberPTAssign />} />
            <Route path="/memberptassign/:transactionId" element={<AssignPTToMember />} />
            <Route path="/PTCommission" element={<ManagePTSessions />} />
            <Route path="/NewProduct" element={<NewProduct />} />
            <Route path="/ReAssign" element={<PTReAssign />} />
            <Route path="/PTAssign" element={<MemberPTAssign />} />
            <Route path="/PTExtend" element={<PTSessionExtend />} />
            <Route path="/NewDiscount" element={<NewDiscount />} />
            <Route path="/PTDetail" element={<PTDetail />} />
            <Route path="/MemberTransactions/:customerId" element={<MemberTransactions />} />

          </Routes>
          
        </Col>
      </div>
    </div>
  );
}

export default Sidenav;
