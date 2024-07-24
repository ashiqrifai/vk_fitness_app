import axios from 'axios'

import { 
    
    PRODUCT_CREATE_REQUEST, 
    PRODUCT_CREATE_SUCCESS, 
    PRODUCT_CREATE_FAIL,

    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL

} from '../constants/productConstant'


export const createProduct =  (itemname, amount) => async (dispatch) => {


    try{

        dispatch({type: PRODUCT_CREATE_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
    
        const {data} = await axios.post('http://127.0.0.1:8000/createProduct', 
        {"itemname" : itemname, "amount": amount},
        config
        )

        
        dispatch({

            type: PRODUCT_CREATE_SUCCESS,
            payload: data
            
        })

     

    } catch(error) {

        dispatch ({

            type: PRODUCT_CREATE_FAIL,
            payload: error.response && error.response.data.detail 
            ? error.response.data.detail : error.message

        })


    }


}

export const getProducts = () => async (dispatch) => {

    try
    {
       
        dispatch({type: PRODUCT_LIST_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
          const response = await axios.get('http://127.0.0.1:8000/productlist', {
            config, 
          });
      
        dispatch({ 

            type: PRODUCT_LIST_SUCCESS,
            payload : response.data
        })

    } catch (error) {

        dispatch({

            type: PRODUCT_LIST_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}
