 import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './app/store.js'
import { Toaster } from 'react-hot-toast'
import './styles/design-tokens.css'

// --- SPEED INSIGHTS IMPORT ---
import { injectSpeedInsights } from '@vercel/speed-insights'
import { inject } from '@vercel/analytics'

// --- INITIALIZE VERCEL TOOLS ---
injectSpeedInsights();
inject();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ✅ GoogleOAuthProvider yahan se hata diya taaki initial load fast ho */}
    <Provider store={store}>
      <App />
      <Toaster position="top-right" reverseOrder={false} />
    </Provider>
  </React.StrictMode>
)
