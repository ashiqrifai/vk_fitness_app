import { 
    
    DISCOUNT_CREATE_REQUEST, 
    DISCOUNT_CREATE_SUCCESS, 
    DISCOUNT_CREATE_FAIL,

    DISCOUNT_LIST_REQUEST,
    DISCOUNT_LIST_SUCCESS,
    DISCOUNT_LIST_FAIL

} from '../constants/discountConstant'

export const createDiscount = (state = {}, action) => {

    switch (action.type){

        case DISCOUNT_CREATE_REQUEST:
            return {loading: true}
        
        case DISCOUNT_CREATE_SUCCESS:
            return {loading: false, discountInfo: action.payload }
        
        case DISCOUNT_CREATE_FAIL:
            return {loading: false, error: action.payload}
        
      
        
        default:
            return state


    }


}


export const discountListReducer = (state = {discounts: []}, action) => {

    switch(action.type){


        case DISCOUNT_LIST_REQUEST:
            return {loading: true, discounts: []}
        
        case DISCOUNT_LIST_SUCCESS:
            return {loading:false, discounts: action.payload}
        
        case DISCOUNT_LIST_FAIL:
            return {loading: false, error: action.payload}
        
        
        default:
            return state

    }


}