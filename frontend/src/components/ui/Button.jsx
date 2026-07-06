import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ' +
  'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

const variants = {
  primary: 'bg-navy-700 text-white hover:bg-navy-800 focus-visible:ring-navy-700',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

// `loading` disables the button and prepends an inline spinner, so every
// in-flight action looks the same without each call site wiring up Loader2.
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  loading = false,
  ...props
}) {
  const isDisabled = disabled || loading

  // Subtle tactile feedback. Skipped while disabled so dead buttons stay still.
  // Reduced-motion users get no scaling (handled globally by MotionConfig).
  const motionProps = isDisabled
    ? {}
    : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.97 } }

  return (
    <motion.button
      {...motionProps}
      transition={{ duration: 0.15 }}
      disabled={isDisabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </motion.button>
  )
}
