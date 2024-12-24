import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'
import AppProvider from './AppProvider.jsx'

createRoot(document.getElementById('root')).render(
  <AppProvider>
    <RouterProvider router={router}>
    </RouterProvider>
  </AppProvider>
)
