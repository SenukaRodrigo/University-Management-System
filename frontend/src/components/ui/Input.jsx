const fieldBase =
  'w-full rounded-lg border bg-slate-800 px-3 py-2 text-sm text-slate-100 ' +
  'placeholder:text-slate-500 transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 ' +
  'disabled:bg-slate-900 disabled:text-slate-500'

export function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${fieldBase} ${error ? 'border-red-400' : 'border-slate-700'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function Textarea({ label, id, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`${fieldBase} resize-none ${error ? 'border-red-400' : 'border-slate-700'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function Select({ label, id, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`${fieldBase} ${error ? 'border-red-400' : 'border-slate-700'} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
