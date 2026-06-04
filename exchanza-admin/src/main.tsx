import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeProvider..tsx';
import ToastProvider from './context/ToastProvider.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { NotificationSettingsProvider } from './context/NotificationSettingsContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <NotificationSettingsProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </NotificationSettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
