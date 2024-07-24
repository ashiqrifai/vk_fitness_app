import axios from 'axios'
import {
  
    CLUB_CREATE_REQUEST,
    CLUB_CREATE_SUCCESS,
    CLUB_CREATE_FAIL, 

    CLUB_LIST_REQUEST,
    CLUB_LIST_SUCCESS,
    CLUB_LIST_FAIL


} from '../constants/clubConstant'


export const createclub =  (clubname, clubcity) => async (dispatch) => {


    try{

        dispatch({type: CLUB_CREATE_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
    
        const {data} = await axios.post('http://127.0.0.1:8000/createclub', 
        {"clubname" : clubname, "clubcity": clubcity},
        config
        )

        
        dispatch({

            type: CLUB_CREATE_SUCCESS,
            payload: data
            
        })

     

    } catch(error) {

        dispatch ({

            type: CLUB_CREATE_FAIL,
            payload: error.response && error.response.data.detail 
            ? error.response.data.detail : error.message

        })

    }


}

export const getclubs = () => async (dispatch) => {

    try
    {
       
        dispatch({type: CLUB_LIST_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
          const response = await axios.get('http://127.0.0.1:8000/clubslist', {
            config, 
          });
      
        dispatch({ 

            type: CLUB_LIST_SUCCESS,
            payload : response.data
        })

    } catch (error) {

        dispatch({

            type: CLUB_LIST_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}
