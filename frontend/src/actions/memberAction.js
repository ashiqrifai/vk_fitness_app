import axios from 'axios'

import { 
    
    MEMBER_CREATE_REQUEST, 
    MEMBER_CREATE_SUCCESS, 
    MEMBER_CREATE_FAIL,


    MEMBER_LIST_REQUEST, 
    MEMBER_LIST_SUCCESS, 
    MEMBER_LIST_FAIL,

    MEMBER_PTLIST_REQUEST, 
    MEMBER_PTLIST_SUCCESS, 
    MEMBER_PTLIST_FAIL,

    MEMBER_RESET
 
 
 

} from '../constants/memberconstant'

export const resetMemberInfo = () => {
    return {
        type: MEMBER_RESET
    };
};

export const getmemberptlist = (memberid) => async (dispatch) => {

    try
    {
       
        dispatch({type: MEMBER_PTLIST_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
          const response = await axios.get(`http://127.0.0.1:8000/TransactionPTSessions?member_id=${memberid}`, config);
        
      
        dispatch({ 

            type: MEMBER_PTLIST_SUCCESS,
            payload : response.data
        })

    } catch (error) {

        dispatch({

            type: MEMBER_PTLIST_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}

export const memberlist = (clubid) => async (dispatch) => {

    try
    {
       
        dispatch({type: MEMBER_LIST_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
      
          const response = await axios.get(`http://127.0.0.1:8000/memberlist/${clubid}`, {
            config, 
          });
      
        dispatch({ 

            type: MEMBER_LIST_SUCCESS,
            payload : response.data
        })

        console.log(response.data)

    } catch (error) {

        dispatch({

            type: MEMBER_LIST_FAIL, 
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,

        })
    
    }

}



export const createMember =  (firstname, lastname, mobileno, email, barcode, clubid) => async (dispatch) => {


    try{

        dispatch({type: MEMBER_CREATE_REQUEST})

        const config = {

            headers: {

                'Content-type': 'application/json'
            }
        }
    
        const {data} = await axios.post('http://127.0.0.1:8000/createMember', 
        {"firstname": firstname, "lastname": lastname, "mobilenumber": mobileno, "email": email, "barcode": barcode, "club_id": clubid},
        config
        )

        
        dispatch({

            type: MEMBER_CREATE_SUCCESS,
            payload: data
            
        })

     

    } catch(error) {

        dispatch ({

            type: MEMBER_CREATE_FAIL,
            payload: error.response && error.response.data.detail 
            ? error.response.data.detail : error.message

        })


    }


}