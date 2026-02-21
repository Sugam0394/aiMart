import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './app/store.js'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './styles/design-tokens.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <App />
        <SpeedInsights />
        <Toaster position="top-right" reverseOrder={false} />
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
) 
