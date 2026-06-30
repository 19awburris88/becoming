import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import theme from './theme'

const CLERK_PK = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PK) {
  document.getElementById('root').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Inter,sans-serif;background:#F8F6F1;text-align:center;padding:2rem">
      <div>
        <div style="font-size:2rem;margin-bottom:1rem">⚠️</div>
        <h2 style="color:#1C2B3A;margin-bottom:.75rem">Setup Required</h2>
        <p style="color:#6B7280;margin-bottom:1.5rem;line-height:1.7;max-width:400px">
          Add your Clerk publishable key to <code style="background:#eee;padding:2px 6px;border-radius:4px">frontend/.env.local</code>
        </p>
        <pre style="background:#1C2B3A;color:#C4973F;padding:1.25rem 1.5rem;border-radius:8px;text-align:left;font-size:.85rem;line-height:1.7">
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
        </pre>
        <p style="color:#9CA3AF;font-size:.85rem;margin-top:1rem">
          Get your key at <strong>dashboard.clerk.com</strong> → API Keys
        </p>
      </div>
    </div>
  `
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <ClerkProvider publishableKey={CLERK_PK} afterSignInUrl="/app/dashboard" afterSignUpUrl="/app/dashboard">
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </ClerkProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}
