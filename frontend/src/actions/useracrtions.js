import axios from 'axios'
import {

  
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,

    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,

    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_PTLIST_REQUEST,
    USER_PTLIST_SUCCESS,
    USER_PTLIST_FAIL,
    

} from '../constants/userConstants'


export const getptlist = (ptid) => async (dispatch) => {

    try
    {
       
        dispatch({type: USER_PTLIST_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
          const response = await axios.get(`http://127.0.0.1:8000/memberptsessions?assigned_to_user=${ptid}`, {
            config, 
          });
      
        dispatch({ 

            type: USER_PTLIST_SUCCESS,
            payload : response.data
        })

      

    } catch (error) {

        dispatch({

            type: USER_PTLIST_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}

export const getusers = (club_id) => async (dispatch) => {

    try
    {
       
        dispatch({type: USER_LIST_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
          const response = await axios.get(`http://127.0.0.1:8000/listofusers?club_id=${club_id}`, {
            config, 
          });
      
        dispatch({ 

            type: USER_LIST_SUCCESS,
            payload : response.data
        })

    } catch (error) {

        dispatch({

            type: USER_LIST_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}


export const login =  (emailid, password) => async (dispatch) => {


    try{

        dispatch({type: USER_LOGIN_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
       
        const {data} = await axios.post('http://127.0.0.1:8000/login', 
        {"email_address" : emailid,   "password": password },
        config
        )

        
        dispatch({

            type: USER_LOGIN_SUCCESS,
            payload: data
            
        })

        localStorage.setItem('userInfo', JSON.stringify(data))
       

    } catch(error) {

        dispatch ({

            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail 
            ? error.response.data.detail : error.message

        })


    }


}


export const register = (email_address, first_name, last_name, password, clubs, usertype) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // Preparing the clubs array in the required format
        const clubsPayload = clubs.map(clubId => ({ id: clubId }));

        const { data } = await axios.post(
            'http://127.0.0.1:8000/createuser',
            { email_address, first_name, last_name, password, clubs: clubsPayload, usertype },
            config
        );

     
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        });

      

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail 
                ? error.response.data.detail 
                : error.message
        });

        console.log(error.response)
    }
};