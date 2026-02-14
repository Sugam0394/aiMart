import React from 'react'
 
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './app/store.js'
import { Toaster } from 'react-hot-toast'
import './styles/design-tokens.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>  
  <>  

    <App />
    <Toaster position="top-right" reverseOrder={false} />   
     </>
    </Provider>
  
)
