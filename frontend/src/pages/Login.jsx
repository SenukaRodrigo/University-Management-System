import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import { Input, PasswordInput } from '../components/ui/Input'
import Alert from '../components/ui/Alert'
import useField from '../hooks/useField'
import { validateEmailFormat, validateLoginPassword } from '../lib/validation'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const email     = useField(validateEmailFormat)
  const password  = useField(validateLoginPassword)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const formValid = email.isValid && password.isValid

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const loginPromise = api.post('/auth/login', {
      email: email.value,
      password: password.value,
    })
    toast.promise(loginPromise, {
      loading: 'Logging in…',
      success: 'Welcome back!',
      error: 'Invalid email or password.',
    })

    try {
      const { data } = await loginPromise
      login(data.token, data.role, data.id)
      navigate(data.role === 'LECTURER' ? '/lecturer' : '/student')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700">
            <GraduationCap className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">UniSystem</h1>
          <p className="mt-1 text-sm text-slate-400">University Management System</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-card">
          <h2 className="mb-6 text-xl font-semibold text-slate-100">Log in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email address"
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email.value}
              onChange={email.onChange}
              onBlur={email.onBlur}
              error={email.error}
            />
            <PasswordInput
              label="Password"
              id="password"
              autoComplete="current-password"
              required
              value={password.value}
              onChange={password.onChange}
              onBlur={password.onBlur}
              error={password.error}
            />
            {error && <Alert>{error}</Alert>}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!formValid}
              loading={loading}
            >
              {loading ? 'Logging in…' : 'Log in'}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-slate-400">
          No account?{' '}
          <Link to="/signup" className="font-medium text-navy-300 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
