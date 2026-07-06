import axios from 'axios'
import { toast } from 'sonner'

const api = axios.create({
  baseURL: '/api',
})

// Attach the JWT on every request if one is stored.
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global error handling.
//  - /auth/* requests own their messaging (a bad login is a 401 we don't want
//    reported as "session expired"), so they're skipped entirely.
//  - List loads pass { skipErrorToast: true } because they render an inline
//    ErrorState with a Retry button instead — a toast on top would be noise.
api.interceptors.response.use(
  response => response,
  error => {
    const url = error.config?.url ?? ''
    const status = error.response?.status

    if (!url.includes('/auth/')) {
      if (status === 401) {
        // Token rejected (expired/invalid): warn, then log out hard.
        toast.error('Session expired — please log in again.')
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('userId')
        if (window.location.pathname !== '/login') {
          window.location.assign('/login')
        }
      } else if (!error.config?.skipErrorToast && (!error.response || status >= 500)) {
        // No response = network/timeout; >= 500 = server error.
        toast.error('Something went wrong. Please try again.')
      }
    }
    return Promise.reject(error)
  }
)

export default api
