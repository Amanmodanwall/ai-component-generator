import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // ✅ import styles for toast
import { ThemeProvider } from './context/ThemeContext.jsx' // ✅ import ThemeProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <ToastContainer /> {/* ✅ Keep this inside ThemeProvider */}
    </ThemeProvider>
  </StrictMode>,
)
