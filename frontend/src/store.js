import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userRegisterReducer, userlistreducer, userloginReducer, userptlistreducer } from './reducers/userReducers'
import { membershipCreate, membershiplistReducer } from './reducers/membeshipReducer'
import { registerClub, clubListReducer } from './reducers/clubReducer'
import { memberCreateReducer, memberlistReducer, memberPTReducer } from './reducers/memberReducer'
import { 
    
    invoicereducer, transactonlistReducer, ptassignreducer, commossionreportReducer, reassignreducer, 
    salesreportreducer, expiredsessionreducer,
    sessionextendreducer, commissiondetailReducer, membertransactionreducer

} from './reducers/transactionreducer'
import { createpaymentReducer, paymentmethodListReducer } from './reducers/paymentmethodReducer'
import { createProduct, productListReducer } from './reducers/productReducer'
import {createDiscount, discountListReducer} from './reducers/discountReducer'

const reducer = combineReducers({

    userRegister: userRegisterReducer,
    membershipReducer: membershipCreate,
    clubreducer: registerClub,
    listofclubs : clubListReducer,
    memberCreate : memberCreateReducer,
    listofmembers: memberlistReducer,
    transactionreducer: invoicereducer,
    listofmemberships: membershiplistReducer,
    paymentmethod: createpaymentReducer,
    paymentmethodList : paymentmethodListReducer,
    memberptlist: memberPTReducer, 
    transactionlist : transactonlistReducer,
    listofusers: userlistreducer,
    ptassign: ptassignreducer,
    userlogin : userloginReducer,
    commissiondata: commossionreportReducer, 
    newproduct : createProduct,
    productlist : productListReducer,
    userptlist : userptlistreducer,
    reassignpt : reassignreducer,
    salesdata : salesreportreducer,
    expiredsessions: expiredsessionreducer,
    extendedsessions: sessionextendreducer,
    newdiscount: createDiscount,
    discountlist: discountListReducer,
    commissiondetail: commissiondetailReducer,
    membertransaction : membertransactionreducer

})

const intitalState = {}

const middleware = [thunk]

const store = createStore(reducer, intitalState, 
composeWithDevTools(applyMiddleware(...middleware)))

export default store
