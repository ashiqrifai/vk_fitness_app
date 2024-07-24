import axios from 'axios'

import { 
    
    DISCOUNT_CREATE_REQUEST, 
    DISCOUNT_CREATE_SUCCESS, 
    DISCOUNT_CREATE_FAIL,

    DISCOUNT_LIST_REQUEST,
    DISCOUNT_LIST_SUCCESS,
    DISCOUNT_LIST_FAIL

} from '../constants/discountConstant'

export const createDiscount =  (discDescription) => async (dispatch) => {


    try{

        dispatch({type: DISCOUNT_CREATE_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
    
        const {data} = await axios.post('http://127.0.0.1:8000/createDiscount', 
        {"description" : discDescription },
        config
        )

        dispatch({

            type: DISCOUNT_CREATE_SUCCESS,
            payload: data
            
        })

    } catch(error) {

        dispatch ({

            type: DISCOUNT_CREATE_FAIL,
            payload: error.response && error.response.data.detail 
            ? error.response.data.detail : error.message

        })

    }

}

export const getDiscounts = () => async (dispatch) => {

    try
    {
       
        dispatch({type: DISCOUNT_LIST_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
          const response = await axios.get('http://127.0.0.1:8000/discountlist', {
            config, 
          });
      
        dispatch({ 

            type: DISCOUNT_LIST_SUCCESS,
            payload : response.data
        })

        console.log("Disconnt  List", response.data)

    } catch (error) {

        dispatch({

            type: DISCOUNT_LIST_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}