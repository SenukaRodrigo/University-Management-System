import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { MailCheck } from 'lucide-react'
import api from '../api/axios'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import Alert from '../components/ui/Alert'
import useField from '../hooks/useField'
import { validateEmailFormat, validateVerificationCode } from '../lib/validation'

const RESEND_COOLDOWN_SECONDS = 30

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  // Signup (and Login's "verify your email" link) hand the address off via
  // router state. If it's missing — e.g. the page was refreshed directly —
  // fall back to a plain editable field instead of a dead end.
  const stateEmail = location.state?.email ?? ''

  const email = useField(validateEmailFormat, stateEmail)
  const code  = useField(validateVerificationCode)
  const [error, setError] = useState(null)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const formValid = email.isValid && code.isValid

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown(c => c - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  async function handleVerify(e) {
    e.preventDefault()
    setError(null)
    setVerifying(true)
    try {
      await api.post('/auth/verify', { email: email.value, code: code.value })
      toast.success('Email verified — please log in')
      navigate('/login', { state: { verifiedEmail: email.value } })
    } catch (err) {
      // Server stays authoritative for what's actually wrong (invalid vs
      // expired vs already-verified) — we just surface its message.
      const message = err.response?.data?.message ?? 'Verification failed'
      setError(message)
      toast.error(message)
    } finally {
      setVerifying(false)
    }
  }

  async function handleResend() {
    if (!email.isValid) {
      email.onBlur()
      return
    }
    setResending(true)
    try {
      await api.post('/auth/resend', { email: email.value })
      toast.success('A new code has been sent.')
      setCooldown(RESEND_COOLDOWN_SECONDS)
    } catch {
      toast.error('Could not resend the code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700">
            <MailCheck className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Verify your email</h1>
          <p className="mt-1 text-sm text-slate-400">
            Enter the 6-digit code we sent you to finish signing up.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-card">
          <form onSubmit={handleVerify} className="space-y-4" noValidate>
            {stateEmail ? (
              <p className="text-sm text-slate-300">
                We sent a 6-digit code to{' '}
                <span className="font-medium text-slate-100">{stateEmail}</span>.
              </p>
            ) : (
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
            )}

            <Input
              label="Verification code"
              id="code"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="one-time-code"
              placeholder="123456"
              required
              value={code.value}
              onChange={code.onChange}
              onBlur={code.onBlur}
              error={code.error}
            />

            {error && <Alert>{error}</Alert>}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!formValid}
              loading={verifying}
            >
              {verifying ? 'Verifying…' : 'Verify'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              size="lg"
              disabled={cooldown > 0}
              loading={resending}
              onClick={handleResend}
            >
              {resending
                ? 'Sending…'
                : cooldown > 0
                  ? `Resend code (${cooldown}s)`
                  : 'Resend code'}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-slate-400">
          Already verified?{' '}
          <Link to="/login" className="font-medium text-navy-300 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
