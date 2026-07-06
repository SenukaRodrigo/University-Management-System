import { AlertCircle, RefreshCw } from 'lucide-react'
import Button from './Button'

// Inline load-failure panel with a retry hook — sits where the list would be,
// never a full-page takeover.
export default function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 rounded-xl border border-red-200 bg-red-50/60 px-6 py-10 text-center">
      <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
      <p className="text-sm font-medium text-red-700">{message}</p>
      <Button variant="secondary" size="sm" className="mt-2" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Retry
      </Button>
    </div>
  )
}
