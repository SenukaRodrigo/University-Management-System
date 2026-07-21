// Client-side validation for the auth forms. This is UX only — the backend
// performs the same checks authoritatively (Bean Validation + the email-domain
// rule in EmailDomainService); we just catch problems earlier.

// Single source of truth for the university domains shown and validated in the
// UI. Must be kept in sync with app.email.* in backend application.properties.
export const STUDENT_DOMAIN = 'students.uni.edu'
export const LECTURER_DOMAIN = 'uni.edu'

// Deliberately simple: "something@something.something". The backend's @Email
// is the real gate; this just filters obvious typos.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateFullName(value) {
  if (!value || value.trim().length < 2) return 'Please enter your full name.'
  return null
}

export function validateEmailFormat(value) {
  if (!value || !EMAIL_RE.test(value.trim())) return 'Enter a valid email address.'
  return null
}

// Format first, then domain — mirrors the backend's order (@Email, then
// EmailDomainService.resolveRole).
export function validateUniversityEmail(value) {
  const formatError = validateEmailFormat(value)
  if (formatError) return formatError
  const domain = value.trim().toLowerCase().split('@').pop()
  if (domain !== STUDENT_DOMAIN && domain !== LECTURER_DOMAIN) {
    return 'Use your university email address.'
  }
  return null
}

export function validateSignupPassword(value) {
  if (!value || value.length < 8) return 'Password must be at least 8 characters.'
  return null
}

export function validateLoginPassword(value) {
  if (!value) return 'Password is required.'
  return null
}

export function validateVerificationCode(value) {
  if (!value || !/^\d{6}$/.test(value.trim())) return 'Enter the 6-digit code.'
  return null
}
