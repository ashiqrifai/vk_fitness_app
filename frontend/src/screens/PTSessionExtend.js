import React, { useEffect, useState } from 'react'
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { expired_sessions, updateExtenedSession } from '../actions/invoiceaction'

import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DateComp from '..//components/DateComp'

function PTSessionExtend() {
const [updateCompleted, setUpdateCompleted] = useState(false);

const expiredsessions = useSelector((state) => state.expiredsessions);
const extendsessions = useSelector((state) => state.extendedsessions);

const { loading, error, sessioninfo } = expiredsessions;
const { ext_error } = expiredsessions;

const [selectedId, setSelectedId] = useState(0);
const [selectedDate, setSelectedDate] = useState(null);
const [sessionStartDate, setSessionStartDate] = useState(null);

const dispatch = useDispatch();

useEffect(() => {
    dispatch(expired_sessions());
    console.log("this is from log", sessioninfo);
  }, [dispatch, updateCompleted]); // Add updateCompleted as a dependency

const onDateSelect = (date, transactionId, startDate) => {
    setSelectedDate(date);
    setSelectedId(transactionId);
    setSessionStartDate(new Date(startDate));
};

const handleDateChange = (transactionId) => {
    if (selectedDate) {

        const selectedDateMidnight = new Date(selectedDate.setHours(0, 0, 0, 0));
        const currentDateMidnight = new Date(new Date().setHours(0, 0, 0, 0));

        if (selectedDateMidnight < currentDateMidnight || selectedDateMidnight < sessionStartDate) {
            alert("Extended date cannot be less than today's date and the session start date.");
            return;
        }
        const isConfirmed = window.confirm("Do you want to update this record?");
        if (isConfirmed) {
            const formattedDate = (selectedDate.getMonth() + 1).toString().padStart(2, '0') + 
                                  '/' + selectedDate.getDate().toString().padStart(2, '0') + 
                                  '/' + selectedDate.getFullYear();
            console.log(formattedDate);
            dispatch(updateExtenedSession({"transid": transactionId, "extendeddate": formattedDate}))
            setUpdateCompleted(true);
        } else {
            console.log("User cancelled the update");
        }
    }
};

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.getDate().toString().padStart(2, '0') + '/' +
           (date.getMonth() + 1).toString().padStart(2, '0') + '/' +
           date.getFullYear();
  }

return (
    <div>

<div style={{ marginBottom: '20px' }}></div>
      <div style={{ marginBottom: '20px' }}></div>
      <h2>Member PT Extension</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Transaction Id</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile No.</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Ext. Date</th>
            <th>Extend</th>


            {/* Add more table headers for other memberdata properties */}
          </tr>
        </thead>
        <tbody>
        {loading ? (
          <tr><td>Loading...</td></tr>  // Show loading state
        ) : error ? (
          <tr><td>Error: {error}</td></tr>  // Show error message
        ) : sessioninfo && sessioninfo.map((session) => (
          <tr key={session.transaction_id}>
                <td>{session.transaction_id}</td>
              <td>{session.firstname}</td>
              <td>{session.lastname}</td>
              <td>{session.email}</td>
              <td>{session.mobilenumber}</td>
              <td>{formatDate(session.start_date)}</td>
              <td>{formatDate(session.end_date)}</td>
              <td>
            <DateComp onChange={(date) => onDateSelect(date, session.transaction_id)} />
        </td>
        <td>
            <Button variant="primary" onClick={() => handleDateChange(session.transaction_id)}>
                Extend
            </Button>
        </td>
          </tr>
        ))}
      </tbody>
      </Table>
    </div>
  );
}

export default PTSessionExtend
