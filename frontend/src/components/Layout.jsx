import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ROLE_LABEL = { LECTURER: 'Lecturer', STUDENT: 'Student' }

export default function Layout({ children }) {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    toast.success("You've been logged out.")
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="bg-navy-800 shadow-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <GraduationCap className="h-6 w-6 text-navy-200" aria-hidden="true" />
              <span className="text-lg font-semibold tracking-tight text-white">
                UniSystem
              </span>
            </div>

            {/* User info + logout */}
            {auth && (
              <div className="flex items-center gap-3">
                <span className="hidden rounded-full bg-navy-900 px-3 py-1 text-xs font-medium text-navy-200 sm:inline-block">
                  {ROLE_LABEL[auth.role] ?? auth.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-navy-100 transition-colors hover:bg-navy-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-0"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  )
}
