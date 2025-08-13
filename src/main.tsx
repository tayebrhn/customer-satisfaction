import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SurveyForm from './SurveyForm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SurveyForm />
  </StrictMode>,
)
