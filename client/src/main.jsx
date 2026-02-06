import React from 'react'
import './index.css'
import './global.css' // Modern Premium Design System
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './app/store.js'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>  
  <>  

    <App />
    <Toaster position="top-right" reverseOrder={false} />   
     </>
    </Provider>
  
)
