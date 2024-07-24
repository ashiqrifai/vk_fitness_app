import { 
    
    PAYMENTMETHOD_CREATE_REQUEST, 
    PAYMENTMETHOD_CREATE_SUCCESS, 
    PAYMENTMETHOD_CREATE_FAIL,

    PAYMENTMETHOD_LIST_REQUEST, 
    PAYMENTMETHOD_LIST_SUCCESS, 
    PAYMENTMETHOD_LIST_FAIL,

} from '../constants/paymentConstant'
import axios from 'axios'


export const createpayment_method =  (payment_description) => async (dispatch) => {


    try{

        dispatch({type: PAYMENTMETHOD_CREATE_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
    
        const {data} = await axios.post('http://127.0.0.1:8000/createPayment', 
        {"payment_description" : payment_description},
        config
        )

        
        dispatch({

            type: PAYMENTMETHOD_CREATE_SUCCESS,
            payload: data
            
        })

     

    } catch(error) {

        dispatch ({

            type: PAYMENTMETHOD_CREATE_FAIL,
            payload: error.response && error.response.data.detail 
            ? error.response.data.detail : error.message

        })


    }


}


export const getpaymentmethods = () => async (dispatch) => {

    try
    {
       
        dispatch({type: PAYMENTMETHOD_LIST_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
          const response = await axios.get('http://127.0.0.1:8000/paymentmethods', {
            config, 
          });
      
        dispatch({ 

            type: PAYMENTMETHOD_LIST_SUCCESS,
            payload : response.data
        })

    } catch (error) {

        dispatch({

            type: PAYMENTMETHOD_LIST_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}