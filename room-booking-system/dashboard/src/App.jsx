import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'

// Lazy Load Pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Rooms = React.lazy(() => import('./pages/Rooms'))
const Events = React.lazy(() => import('./pages/Events'))
const Bookings = React.lazy(() => import('./pages/Bookings'))
const Login = React.lazy(() => import('./pages/Login'))

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes Wrapper */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="rooms" element={<Rooms />} />
                <Route path="events" element={<Events />} />
                <Route path="bookings" element={<Bookings />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </React.Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
