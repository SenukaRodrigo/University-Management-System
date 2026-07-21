import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// text-base on mobile (16px — prevents iOS auto-zoom on focus), text-sm from
// the sm breakpoint up.
const fieldBase =
  'w-full rounded-lg border bg-slate-800 px-3 py-2 text-base sm:text-sm text-slate-100 ' +
  'placeholder:text-slate-500 transition-colors ' +
  'focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 ' +
  'disabled:bg-slate-900 disabled:text-slate-500'

// Shared accessible error/hint wiring:
//   - error message gets id `${id}-error`, role="alert" so it's announced
//   - hint (optional helper text) gets id `${id}-hint`
//   - the input points at both via aria-describedby and flags aria-invalid
function fieldA11y(id, error, hint) {
  const describedBy = [
    hint ? `${id}-hint` : null,
    error ? `${id}-error` : null,
  ].filter(Boolean).join(' ') || undefined
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  }
}

function FieldMessages({ id, error, hint }) {
  return (
    <>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-slate-400">
          {hint}
        </p>
      )}
    </>
  )
}

export function Input({ label, id, error, hint, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        {...fieldA11y(id, error, hint)}
        className={`${fieldBase} ${error ? 'border-red-400' : 'border-slate-700'} ${className}`}
        {...props}
      />
      <FieldMessages id={id} error={error} hint={hint} />
    </div>
  )
}

// Password field with a show/hide toggle. The toggle is a real <button
// type="button"> (never submits the form) whose aria-label flips between
// "Show password" and "Hide password".
export function PasswordInput({ label, id, error, hint, className = '', ...props }) {
  const [visible, setVisible] = useState(false)
  const ToggleIcon = visible ? EyeOff : Eye

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          {...fieldA11y(id, error, hint)}
          className={`${fieldBase} pr-11 ${error ? 'border-red-400' : 'border-slate-700'} ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center rounded-r-lg text-slate-400 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400"
        >
          <ToggleIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <FieldMessages id={id} error={error} hint={hint} />
    </div>
  )
}

export function Textarea({ label, id, error, hint, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={id}
        {...fieldA11y(id, error, hint)}
        className={`${fieldBase} resize-none ${error ? 'border-red-400' : 'border-slate-700'} ${className}`}
        {...props}
      />
      <FieldMessages id={id} error={error} hint={hint} />
    </div>
  )
}

export function Select({ label, id, error, hint, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <select
        id={id}
        {...fieldA11y(id, error, hint)}
        className={`${fieldBase} ${error ? 'border-red-400' : 'border-slate-700'} ${className}`}
        {...props}
      >
        {children}
      </select>
      <FieldMessages id={id} error={error} hint={hint} />
    </div>
  )
}
