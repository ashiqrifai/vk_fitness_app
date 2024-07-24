import { 
    
    CREATE_INVOICE_REQUEST, 
    CREATE_INVOICE_SUCCESS, 
    CREATE_INVOICE_FAIL, 

    TRANSACTION_LIST_REQUEST,
    TRANSACTION_LIST_SUCCESS,
    TRANSACTION_LIST_FAIL,

    CREATE_PTASSIGN_REQUEST, 
    CREATE_PTASSIGN_SUCCESS, 
    CREATE_PTASSIGN_FAIL, 

    CREATE_REASSIGN_REQUEST, 
    CREATE_REASSIGN_SUCCESS, 
    CREATE_REASSIGN_FAIL, 

    COMMISSION_REPORT_REQUEST,
    COMMISSION_REPORT_SUCCESS,
    COMMISSION_REPORT_FAIL,

    COMMISSION_DETAIL_REQUEST,
    COMMISSION_DETAIL_SUCCESS,
    COMMISSION_DETAIL_FAIL,

    SALES_REPORT_REQUEST,
    SALES_REPORT_SUCCESS,
    SALES_REPORT_FAIL,

    EXPIRED_SESSION_REQUEST,
    EXPIRED_SESSION_SUCCESS,
    EXPIRED_SESSION_FAIL,

    EXTEND_SESSION_REQUEST,
    EXTEND_SESSION_SUCCESS,
    EXTEND_SESSION_FAIL,

    MEMBER_TRANSACTION_REQUEST,
    MEMBER_TRANSACTION_SUCCESS,
    MEMBER_TRANSACTION_FAIL


} from '../constants/transaction'


export const expiredsessionreducer = (state = {sessioninfo: []}, action) => {


    switch (action.type) {

        case EXPIRED_SESSION_REQUEST:
            return {loading: true, sessioninfo: []}
        
        case EXPIRED_SESSION_SUCCESS:
            return {loading: false, sessioninfo: action.payload}
        
        
        case EXPIRED_SESSION_FAIL:
            return {loading: false, error: action.payload}
        
        default:
            return state

    }

}


export const sessionextendreducer = (state = {}, action) => {


    switch (action.type) {

        case EXTEND_SESSION_REQUEST:
            return {loading: true}
        
        case EXTEND_SESSION_SUCCESS:
            return {loading: false, extendinfo: action.payload}
        
        
        case EXTEND_SESSION_FAIL:
            return {reassign_loading: false, extendinfo: action.payload}
        
        default:
            return state

    }

}


export const reassignreducer = (state = {}, action) => {


    switch (action.type) {

        case CREATE_REASSIGN_REQUEST:
            return {reassign_loading: true}
        
        case CREATE_REASSIGN_SUCCESS:
            return {reassign_loading: false, ressigninfo: action.payload}
        
        
        case CREATE_REASSIGN_FAIL:
            return {reassign_loading: false, reassign_error: action.payload}
        
        default:
            return state

    }

}


export const ptassignreducer = (state = {}, action) => {


    switch (action.type) {

        case CREATE_PTASSIGN_REQUEST:
            return {loading: true}
        
        case CREATE_PTASSIGN_SUCCESS:
            return {loading: false, ptassigninfo: action.payload}
        
        
        case CREATE_PTASSIGN_FAIL:
            return {loading: false, error: action.payload}
        
        default:
            return state

    }

}


export const membertransactionreducer = (state = {membertrans: []}, action) => {

    switch(action.type){


        case MEMBER_TRANSACTION_REQUEST:
            return {loading: true, membertrans: []}
        
        case MEMBER_TRANSACTION_SUCCESS:
            return {loading:false, membertrans: action.payload}
        
        case MEMBER_TRANSACTION_FAIL:
            return {loading: false, error: action.payload}
        
        
        default:
            return state

    }


}

export const invoicereducer = (state = {invoice: []}, action) => {

    switch(action.type){


        case CREATE_INVOICE_REQUEST:
            return {loading: true, invoice: []}
        
        case CREATE_INVOICE_SUCCESS:
            return {loading:false, invoice: action.payload}
        
        case CREATE_INVOICE_FAIL:
            return {loading: false, error: action.payload}
        
        
        default:
            return state

    }


}

export const salesreportreducer = (state = {sales: []}, action) => {

    switch(action.type){


        case SALES_REPORT_REQUEST:
            return {loading: true, sales: []}
        
        case SALES_REPORT_SUCCESS:
            return {loading:false, sales: action.payload}
        
        case SALES_REPORT_FAIL:
            return {loading: false, error: action.payload}
        
        
        default:
            return state

    }


}


export const commissiondetailReducer = (state = {commission_detail: []}, action) => {

    switch(action.type){


        case COMMISSION_DETAIL_REQUEST:
            return {loading: true, commission_detail: []}
        
        case COMMISSION_DETAIL_SUCCESS:
            return {loading:false, commission_detail: action.payload}
        
        case COMMISSION_DETAIL_FAIL:
            return {loading: false, error: action.payload}
        
        
        default:
            return state

    }


}

export const commossionreportReducer = (state = {commissions: []}, action) => {

    switch(action.type){


        case COMMISSION_REPORT_REQUEST:
            return {loading: true, commissions: []}
        
        case COMMISSION_REPORT_SUCCESS:
            return {loading:false, commissions: action.payload}
        
        case COMMISSION_REPORT_FAIL:
            return {loading: false, error: action.payload}
        
        
        default:
            return state

    }


}

export const transactonlistReducer = (state = {transactions: []}, action) => {

    switch(action.type){


        case TRANSACTION_LIST_REQUEST:
            return {loading: true, transactions: []}
        
        case TRANSACTION_LIST_SUCCESS:
            return {loading:false, transactions: action.payload}
        
        case TRANSACTION_LIST_FAIL:
            return {loading: false, error: action.payload}
        
        
        default:
            return state

    }


}