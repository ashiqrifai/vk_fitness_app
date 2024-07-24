import React from 'react'
import ReactDom from'react-dom/client'
import App from './App'
import './bootstrap.min.css'
import { Provider } from 'react-redux'
import store from './store'
import { ClubProvider } from './context/ClubContext'
const el = document.getElementById('root')
const root = ReactDom.createRoot(el)

root.render (

<Provider store={store}>
        <ClubProvider>
                <App/>
        </ClubProvider>
</Provider>

)
