import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import RootLayout from './routes/RootLayout'
import HomePage from './routes/HomePage'
import FavoritesPage from './routes/FavoritesPage'
import RegisterPage from './routes/RegisterPage'
import PopupDetailPage from './routes/PopupDetailPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'popup/:id', element: <PopupDetailPage /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
