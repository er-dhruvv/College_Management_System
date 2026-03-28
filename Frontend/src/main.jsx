import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CookiesProvider } from 'react-cookie';
import { NotificationProvider } from './context/NotificationContext';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <CookiesProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </CookiesProvider>,
)
  