import { 
    
    MEMBERSHIP_CREATE_REQUEST, 
    MEMBERSHIP_CREATE_SUCCESS, 
    MEMBERSHIP_CREATE_FAIL,

    MEMBERSHIP_LIST_REQUEST, 
    MEMBERSHIP_LIST_SUCCESS, 
    MEMBERSHIP_LIST_FAIL,
 

} from '../constants/membershipConstant'


export const membershiplistReducer = (state = {memberships: []}, action) => {

    switch(action.type){


        case MEMBERSHIP_LIST_REQUEST:
            return {loading: true, memberships: []}
        
        case MEMBERSHIP_LIST_SUCCESS:
            return {loading:false, memberships: action.payload}
        
        case MEMBERSHIP_LIST_FAIL:
            return {loading: false, error: action.payload}
        
        
        default:
            return state

    }


}

export const membershipCreate = (state = {}, action) => {


    switch (action.type) {

        case MEMBERSHIP_CREATE_REQUEST:
            return {loading: true}
        
        case MEMBERSHIP_CREATE_SUCCESS:
            return {loading: false, membershipinfo: action.payload}
        
        
        case MEMBERSHIP_CREATE_FAIL:
            return {loading: false, error: action.payload}
        
        default:
            return state



    }



}

