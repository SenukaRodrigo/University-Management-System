import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { GraduationCap } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import Alert from '../components/ui/Alert'

export default function Signup() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]   = useState({ fullName: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await api.post('/auth/signup', form)
      login(data.token, data.role, data.id)
      toast.success('Account created — welcome!')
      navigate(data.role === 'LECTURER' ? '/lecturer' : '/student')
    } catch (err) {
      // 409 = duplicate email; other 4xx (e.g. unrecognized email domain)
      // surface the server's own message.
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700">
            <GraduationCap className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">UniSystem</h1>
          <p className="mt-1 text-sm text-slate-500">University Management System</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full name"
              id="fullName"
              autoComplete="name"
              required
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
            />
            <div className="space-y-1">
              <Input
                label="Email address"
                id="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <p className="text-xs text-slate-400">
                Use your university email — students: @students.uni.edu, lecturers: @uni.edu
              </p>
            </div>
            <Input
              label="Password"
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            {error && <Alert>{error}</Alert>}
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {loading ? 'Creating account…' : 'Sign up'}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-navy-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
