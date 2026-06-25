import { BookOpen } from 'lucide-react'

export default function Spinner({ className = '' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-navy-400 ${className}`}
    />
  )
}

export function LoadingState({ message = 'Loading…' }) {
  return (
    <div className="flex items-center gap-3 py-10 text-slate-400">
      <Spinner />
      <span className="text-sm">{message}</span>
    </div>
  )
}

export function EmptyState({ icon: Icon = BookOpen, message }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-slate-500">
      <Icon className="h-8 w-8" aria-hidden="true" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
