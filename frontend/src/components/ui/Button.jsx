import { motion } from 'framer-motion'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ' +
  'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

const variants = {
  primary: 'bg-navy-600 text-white hover:bg-navy-500 focus-visible:ring-navy-500',
  secondary:
    'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 focus-visible:ring-slate-500',
  danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500',
  ghost: 'text-slate-300 hover:bg-slate-800 focus-visible:ring-slate-500',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}) {
  // Subtle tactile feedback. Skipped while disabled so dead buttons stay still.
  // Reduced-motion users get no scaling (handled globally by MotionConfig).
  const motionProps = disabled
    ? {}
    : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.97 } }

  return (
    <motion.button
      {...motionProps}
      transition={{ duration: 0.15 }}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
