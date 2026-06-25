import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import LecturerDashboard from './pages/LecturerDashboard'
import StudentDashboard from './pages/StudentDashboard'
import { pageVariants, pageTransition } from './lib/motion'

// Redirects / to the right dashboard (or /login if not authenticated).
function RootRedirect() {
  const { auth } = useAuth()
  if (!auth) return <Navigate to="/login" replace />
  return <Navigate to={auth.role === 'LECTURER' ? '/lecturer' : '/student'} replace />
}

// Wraps a page so it fades/slides in on enter and out on leave.
function Page({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}

function AppRoutes() {
  const location = useLocation()
  return (
    // mode="wait" lets the old page finish exiting before the new one enters.
    // Keying Routes on the pathname is what makes AnimatePresence see a change.
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Page><Login /></Page>} />
        <Route path="/signup" element={<Page><Signup /></Page>} />
        <Route path="/lecturer" element={
          <ProtectedRoute requiredRole="LECTURER">
            <Page><LecturerDashboard /></Page>
          </ProtectedRoute>
        } />
        <Route path="/student" element={
          <ProtectedRoute requiredRole="STUDENT">
            <Page><StudentDashboard /></Page>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* reducedMotion="user" auto-disables transform animations for anyone
            who has "reduce motion" on, leaving only gentle opacity fades. */}
        <MotionConfig reducedMotion="user">
          <Toaster richColors closeButton position="top-right" theme="dark" />
          <AppRoutes />
        </MotionConfig>
      </AuthProvider>
    </BrowserRouter>
  )
}
