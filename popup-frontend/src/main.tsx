import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import RootLayout from './routes/RootLayout'
import HomePage from './routes/HomePage'
import PopupDetailPage from './routes/PopupDetailPage'
import FavoritesPage from './routes/FavoritesPage'
import RegisterPage from './routes/RegisterPage'
import ReportsAdminPage from './routes/ReportsAdminPage'
import { AuthProvider } from './hooks/useAuth'
import MyReportsPage from './routes/MyReportsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: 'popup/:id', element: <PopupDetailPage /> },
      { index: true, element: <HomePage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'register', element: <RegisterPage /> },       
      { path: 'reports/admin', element: <ReportsAdminPage /> },
      { path: 'my/reports', element: <MyReportsPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
