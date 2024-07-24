import { 
    
    PAYMENTMETHOD_CREATE_REQUEST, 
    PAYMENTMETHOD_CREATE_SUCCESS, 
    PAYMENTMETHOD_CREATE_FAIL,

    PAYMENTMETHOD_LIST_REQUEST, 
    PAYMENTMETHOD_LIST_SUCCESS, 
    PAYMENTMETHOD_LIST_FAIL,




} from '../constants/paymentConstant'

export const createpaymentReducer = (state = {}, action) => {

    switch (action.type){

        case PAYMENTMETHOD_CREATE_REQUEST:
            return {loading: true}
        
        case PAYMENTMETHOD_CREATE_SUCCESS:
            return {loading: false, paymentmethods: action.payload }
        
        case PAYMENTMETHOD_CREATE_FAIL:
            return {loading: false, error: action.payload}
        
      
        
        default:
            return state


    }
}


export const paymentmethodListReducer = (state = {paymentmethods: []}, action) => {

    switch(action.type){


        case PAYMENTMETHOD_LIST_REQUEST:
            return {loading: true, paymentmethods: []}
        
        case PAYMENTMETHOD_LIST_SUCCESS:
            return {loading:false, paymentmethods: action.payload}
        
        case PAYMENTMETHOD_LIST_FAIL:
            return {loading: false, error: action.payload}
        
        
        default:
            return state

    }


}
