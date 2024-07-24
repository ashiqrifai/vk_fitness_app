import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidenav from './components/Sidenav';
import Homescreen from './screens/Homescreen';
import LoginScreen from './screens/LoginScreen';

function App() {
  // Initialize isLoggedIn from localStorage, default to false if not found

 
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true' || false
  );

  const handleLogin = () => {
    // Perform login logic here and set isLoggedIn to true if login is successful
    setIsLoggedIn(true);
    // Store the login state in localStorage
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    // Perform logout logic here and set isLoggedIn to false
    setIsLoggedIn(false);
    // Clear the stored login state in localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
   
  
  };

  return (
    <div>
      <Router>
        {isLoggedIn && <Header onLogout={handleLogout} isLoggedIn = {isLoggedIn} />}
        {isLoggedIn && <Sidenav isLoggedIn={isLoggedIn}  />}
        <Routes>
          {isLoggedIn ? (
            // If logged in, allow access to protected routes
            <Route path="/"/>
          ) : (
            // If not logged in, redirect to the login screen
            <Route
              path="/"
              element={
                <LoginScreen
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
