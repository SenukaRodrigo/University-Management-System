import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'
import api from '../api/axios'
import Button from '../components/ui/Button'
import { Input, PasswordInput } from '../components/ui/Input'
import Alert from '../components/ui/Alert'
import useField from '../hooks/useField'
import {
  validateFullName,
  validateUniversityEmail,
  validateSignupPassword,
  STUDENT_DOMAIN,
  LECTURER_DOMAIN,
} from '../lib/validation'

export default function Signup() {
  const navigate  = useNavigate()
  const fullName  = useField(validateFullName)
  const email     = useField(validateUniversityEmail)
  const password  = useField(validateSignupPassword)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const formValid = fullName.isValid && email.isValid && password.isValid

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await api.post('/auth/signup', {
        fullName: fullName.value,
        email: email.value,
        password: password.value,
      })
      // No token anymore — the account is disabled until the emailed code is
      // confirmed. Hand off to the verify page instead of logging in.
      toast.success(data.message ?? 'Account created. Check your email for a verification code.')
      navigate('/verify-email', { state: { email: email.value } })
    } catch (err) {
      // Server stays authoritative: 409 = duplicate email; other 4xx (e.g.
      // unrecognized email domain) surface the server's own message.
      const message = err.response?.status === 409
        ? 'That email is already registered.'
        : err.response?.data?.message ?? 'Signup failed'
      setError(message)
      toast.error(message)
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
          <h2 className="mb-6 text-xl font-semibold text-slate-100">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full name"
              id="fullName"
              autoComplete="name"
              required
              value={fullName.value}
              onChange={fullName.onChange}
              onBlur={fullName.onBlur}
              error={fullName.error}
            />
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
              hint={`Use your university email — students: @${STUDENT_DOMAIN}, lecturers: @${LECTURER_DOMAIN}`}
            />
            <PasswordInput
              label="Password"
              id="password"
              autoComplete="new-password"
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
              {loading ? 'Creating account…' : 'Sign up'}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-navy-300 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
