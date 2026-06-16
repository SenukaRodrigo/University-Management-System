import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LecturerDashboard from './pages/LecturerDashboard'
import StudentDashboard from './pages/StudentDashboard'

// Redirects / to the right dashboard (or /login if not authenticated).
function RootRedirect() {
  const { auth } = useAuth()
  if (!auth) return <Navigate to="/login" replace />
  return <Navigate to={auth.role === 'LECTURER' ? '/lecturer' : '/student'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/lecturer" element={
        <ProtectedRoute requiredRole="LECTURER">
          <LecturerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/student" element={
        <ProtectedRoute requiredRole="STUDENT">
          <StudentDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
