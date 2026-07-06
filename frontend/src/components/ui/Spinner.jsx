export default function Spinner({ className = '' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-navy-400 ${className}`}
    />
  )
}
