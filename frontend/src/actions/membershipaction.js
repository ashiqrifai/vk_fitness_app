import axios from 'axios'
import {

    MEMBERSHIP_CREATE_REQUEST,
    MEMBERSHIP_CREATE_SUCCESS,
    MEMBERSHIP_CREATE_FAIL,

    MEMBERSHIP_LIST_REQUEST,
    MEMBERSHIP_LIST_SUCCESS,
    MEMBERSHIP_LIST_FAIL,

} from '../constants/membershipConstant'


export const membershiplist = () => async (dispatch) => {

    try
    {
       
        dispatch({type: MEMBERSHIP_LIST_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
          const response = await axios.get('http://127.0.0.1:8000/membershiplist', {
            config, 
          });
      
        dispatch({ 

            type: MEMBERSHIP_LIST_SUCCESS,
            payload : response.data
        })

    } catch (error) {

        dispatch({

            type: MEMBERSHIP_LIST_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}

export const createmembership =  (request) => async (dispatch) => {


    try{

        dispatch({type: MEMBERSHIP_CREATE_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
    
        const {data} = await axios.post('http://127.0.0.1:8000/memberships', 
        request,
        config
        )

        
        dispatch({

            type: MEMBERSHIP_CREATE_SUCCESS,
            payload: data
            
        })

     

    } catch(error) {

        dispatch ({

            type: MEMBERSHIP_CREATE_FAIL,
            payload: error.response && error.response.data.detail 
            ? error.response.data.detail : error.message

        })


    }


}