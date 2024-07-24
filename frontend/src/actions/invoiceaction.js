import axios from 'axios'

import { 
    
    CREATE_INVOICE_REQUEST, 
    CREATE_INVOICE_SUCCESS, 
    CREATE_INVOICE_FAIL, 

    TRANSACTION_LIST_REQUEST,
    TRANSACTION_LIST_SUCCESS, 
    TRANSACTION_LIST_FAIL,

    CREATE_PTASSIGN_REQUEST,
    CREATE_PTASSIGN_SUCCESS,
    CREATE_PTASSIGN_FAIL,

    COMMISSION_REPORT_REQUEST,
    COMMISSION_REPORT_SUCCESS,
    COMMISSION_REPORT_FAIL,

    COMMISSION_DETAIL_REQUEST,
    COMMISSION_DETAIL_SUCCESS,
    COMMISSION_DETAIL_FAIL,

    CREATE_REASSIGN_REQUEST, 
    CREATE_REASSIGN_SUCCESS, 
    CREATE_REASSIGN_FAIL, 

    SALES_REPORT_REQUEST,
    SALES_REPORT_SUCCESS,
    SALES_REPORT_FAIL,

    EXPIRED_SESSION_REQUEST,
    EXPIRED_SESSION_SUCCESS,
    EXPIRED_SESSION_FAIL,

    EXTEND_SESSION_REQUEST,
    EXTEND_SESSION_SUCCESS,
    EXTEND_SESSION_FAIL, 

    MEMBER_TRANSACTION_REQUEST, 
    MEMBER_TRANSACTION_SUCCESS, 
    MEMBER_TRANSACTION_FAIL

 

} from '../constants/transaction'

export const updateExtenedSession =  (request) => async (dispatch) => {


    try{

        dispatch({type: EXTEND_SESSION_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
        
        const {data} = await axios.post('http://127.0.0.1:8000/extend_session', 
        request,
        config
        )
        dispatch({

            type: EXTEND_SESSION_SUCCESS,
            payload: data
            
        })
    } catch(ext_error) {

        dispatch ({

            type: EXTEND_SESSION_FAIL,
            payload: ext_error.response && ext_error.response.data.detail 
            ? ext_error.response.data.detail : ext_error.message

        })

    }
}

export const createPTReAssign =  (request) => async (dispatch) => {


    try{

        console.log(request)
        dispatch({type: CREATE_REASSIGN_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
        
        const {data} = await axios.post('http://127.0.0.1:8000/ptreassign', 
        request,
        config
        )
        dispatch({

            type: CREATE_REASSIGN_SUCCESS,
            payload: data
            
        })
    } catch(error) {

        dispatch ({

            type: CREATE_REASSIGN_FAIL,
            payload: error.response && error.response.data.detail 
            ? error.response.data.detail : error.message

        })

    }
}


export const createPTAssign =  (request) => async (dispatch) => {


    try{

        dispatch({type: CREATE_PTASSIGN_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
    
        const {data} = await axios.post('http://127.0.0.1:8000/ptassign', 
        request,
        config
        )

        
        dispatch({

            type: CREATE_PTASSIGN_REQUEST,
            payload: data
            
        })

     

    } catch(error) {

        dispatch ({

            type: CREATE_PTASSIGN_FAIL,
            payload: error.response && error.response.data.detail 
            ? error.response.data.detail : error.message

        })


    }


}

export const expired_sessions = () => async (dispatch) => {

    try
    {
       
        dispatch({type: EXPIRED_SESSION_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
        const response = await axios.get('http://127.0.0.1:8000/expired_sessions', config) 
          console.log(response.data)  
        dispatch({ 

            type: EXPIRED_SESSION_SUCCESS,
            payload : response.data
        })

    } catch (error) {

        dispatch({

            type: EXPIRED_SESSION_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}


export const salesreport = (startdate, endate, club_id) => async (dispatch) => {

    try
    {
       
        dispatch({type: SALES_REPORT_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
        const response = await axios.get(`http://127.0.0.1:8000/salesdata?startdate=${startdate}&enddate=${endate}&club_id=${club_id}`, config) 
          console.log(response.data)  
        dispatch({ 

            type: SALES_REPORT_SUCCESS,
            payload : response.data
        })

    } catch (error) {

        dispatch({

            type: SALES_REPORT_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}

export const member_transaction_detail = (memberid, clubid) => async (dispatch) => {

    try
    {
       
        dispatch({type: MEMBER_TRANSACTION_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
        const response = await axios.get(`http://127.0.0.1:8000/membertransactions?member_id=${memberid}&club_id=${clubid}`, config) 
          console.log(response.data)  
        dispatch({ 

            type: MEMBER_TRANSACTION_SUCCESS,
            payload : response.data
        })

    } catch (error) {

        dispatch({

            type: MEMBER_TRANSACTION_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}



export const commissiondetail = (tranid) => async (dispatch) => {

    try
    {
       
        dispatch({type: COMMISSION_DETAIL_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
        const response = await axios.get(`http://127.0.0.1:8000/commissiondetail?transaction_id=${tranid}`, config) 
          console.log(response.data)  
        dispatch({ 

            type: COMMISSION_DETAIL_SUCCESS,
            payload : response.data
        })

    } catch (error) {

        dispatch({

            type: COMMISSION_DETAIL_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}


export const commissionreport = (startdate, endate, clubid) => async (dispatch) => {

    try
    {
       
        dispatch({type: COMMISSION_REPORT_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
        const response = await axios.get(`http://127.0.0.1:8000/commissions?startdate=${startdate}&enddate=${endate}&club_id=${clubid}`, config) 
          console.log(response.data)  
        dispatch({ 

            type: COMMISSION_REPORT_SUCCESS,
            payload : response.data
        })

    } catch (error) {

        dispatch({

            type: COMMISSION_REPORT_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}


export const gettransactionbyId = (tranid) => async (dispatch) => {

    try
    {
       
        dispatch({type: TRANSACTION_LIST_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
          const response = await axios.get(`http://127.0.0.1:8000/transactionbyid?transaction_id=${tranid}`, config) 
            
        dispatch({ 

            type: TRANSACTION_LIST_SUCCESS,
            payload : response.data
        })

    } catch (error) {

        dispatch({

            type: TRANSACTION_LIST_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}

export const createInvoice =  (request) => async (dispatch) => {


    try{

        console.log("this is the transaction reqeust", request)

        dispatch({type: CREATE_INVOICE_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
    
        const {data} = await axios.post('http://127.0.0.1:8000/transaction', 
        request,
        config
        )

        
        dispatch({

            type: CREATE_INVOICE_SUCCESS,
            payload: data
            
        })

     

    } catch(error) {

        dispatch ({

            type: CREATE_INVOICE_FAIL,
            payload: error.response && error.response.data.detail 
            ? error.response.data.detail : error.message

        })


    }


}