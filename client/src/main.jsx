import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './app/store.js'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google' // Google Provider add kiya
import './styles/design-tokens.css'




// --- SPEED INSIGHTS IMPORT YAHA KAREIN ---
import { injectSpeedInsights } from '@vercel/speed-insights'
import { inject } from '@vercel/analytics'


// --- ISKO INITIALIZE KAREIN ---
injectSpeedInsights();
inject();


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <App />
        <Toaster position="top-right" reverseOrder={false} />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
) 
