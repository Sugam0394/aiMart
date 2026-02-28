 import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './app/store.js'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google' // 👈 1. Import karo 
import './styles/design-tokens.css'

// --- SPEED INSIGHTS IMPORT ---
import { injectSpeedInsights } from '@vercel/speed-insights'
import { inject } from '@vercel/analytics'

// --- INITIALIZE VERCEL TOOLS ---
injectSpeedInsights();
inject();

 
 document.documentElement.setAttribute('data-theme', 'dark'); 
 document.documentElement.style.backgroundColor = '#020617'; 
 document.body.style.backgroundColor = '#020617'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ✅ Wrapper wapas laya gaya taaki Google Auth kaam kare  */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> 
      <Provider store={store}>
        <App />
        [cite_start]{/* FIX 1C: Updated Toaster with dark styles [cite: 7] */}
        <Toaster 
          position="top-right" 
          reverseOrder={false} 
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
            }
          }}
        /> 
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
