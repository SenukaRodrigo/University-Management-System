import Button from './Button'

// Friendly "nothing here" panel. The action button only renders when both
// actionLabel and onAction are provided.
export default function EmptyState({ icon: Icon, title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center">
      {Icon && <Icon className="h-8 w-8 text-slate-400" aria-hidden="true" />}
      <p className="mt-1 font-medium text-slate-700">{title}</p>
      <p className="text-sm text-slate-500">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" className="mt-3" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
