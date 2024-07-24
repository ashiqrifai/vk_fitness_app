import { 
    
    CLUB_CREATE_REQUEST, 
    CLUB_CREATE_SUCCESS, 
    CLUB_CREATE_FAIL,

    CLUB_LIST_REQUEST,
    CLUB_LIST_SUCCESS,
    CLUB_LIST_FAIL

} from '../constants/clubConstant'

export const registerClub = (state = {}, action) => {

    switch (action.type){

        case CLUB_CREATE_REQUEST:
            return {loading: true}
        
        case CLUB_CREATE_SUCCESS:
            return {loading: false, clubInfo: action.payload }
        
        case CLUB_CREATE_FAIL:
            return {loading: false, error: action.payload}
      
        
        default:
            return state


    }


}

export const clubListReducer = (state = {clubs: []}, action) => {

    switch(action.type){


        case CLUB_LIST_REQUEST:
            return {loading: true, clubs: []}
        
        case CLUB_LIST_SUCCESS:
            return {loading:false, clubs: action.payload}
        
        case CLUB_LIST_FAIL:
            return {loading: false, error: action.payload}
        
        
        default:
            return state

    }


}
