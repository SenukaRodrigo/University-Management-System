// Status badges live here — amber/green/red in one place so they're always consistent.
const BADGE_STYLES = {
  PENDING:  'bg-amber-50  text-amber-700  ring-amber-500/20',
  ACCEPTED: 'bg-green-50  text-green-700  ring-green-500/20',
  REJECTED: 'bg-red-50    text-red-700    ring-red-500/20',
}

const BADGE_LABELS = {
  PENDING:  'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
}

export default function Badge({ status }) {
  const style = BADGE_STYLES[status] ?? 'bg-slate-100 text-slate-600 ring-slate-500/20'
  const label = BADGE_LABELS[status] ?? status
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${style}`}
    >
      {label}
    </span>
  )
}
