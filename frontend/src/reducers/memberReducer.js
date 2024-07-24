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

const initialState = {
    // ... other initial state properties
    memberInfo: null, // or your initial state for memberInfo
};

export default function memberReducer(state = initialState, action) {
    switch (action.type) {
        // ... existing case handlers
        case MEMBER_RESET:
            return {
                ...state,
                memberInfo: null // Reset memberInfo to null or initial state
            };
        // ... other case handlers
        default:
            return state;
    }
}

export const memberCreateReducer = (state = {}, action) => {


    switch (action.type) {

        case MEMBER_CREATE_REQUEST:
            return {loading: true}
        
        case MEMBER_CREATE_SUCCESS:
            return {loading: false, memberInfo: action.payload}
        
        
        case MEMBER_CREATE_FAIL:
            return {loading: false, error: action.payload}
        
        default:
            return state

    }

}

export const memberlistReducer = (state = {members: []}, action) => {

    switch(action.type){


        case MEMBER_LIST_REQUEST:
            return {loading: true, members: []}
        
        case MEMBER_LIST_SUCCESS:
            return {loading:false, members: action.payload}
        
        case MEMBER_LIST_FAIL:
            return {loading: false, error: action.payload}
        
        
        default:
            return state

    }


}

export const memberPTReducer = (state = {memberpts: []}, action) => {

    switch(action.type){


        case MEMBER_PTLIST_REQUEST:
            return {loading: true, memberpts: []}
        
        case MEMBER_PTLIST_SUCCESS:
            return {loading:false, memberpts: action.payload}
        
        case MEMBER_PTLIST_FAIL:
            return {loading: false, error: action.payload}
        
        
        default:
            return state

    }


}