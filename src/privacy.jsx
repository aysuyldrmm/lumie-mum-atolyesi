import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrivacyPolicy />
  </StrictMode>,
)
