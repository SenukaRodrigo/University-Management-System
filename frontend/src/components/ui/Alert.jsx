import { AlertCircle, Info } from 'lucide-react'

const STYLES = {
  error: {
    wrap: 'bg-red-50 border-red-200 text-red-700',
    Icon: AlertCircle,
  },
  info: {
    wrap: 'bg-blue-50 border-blue-200 text-blue-700',
    Icon: Info,
  },
}

export default function Alert({ children, variant = 'error' }) {
  if (!children) return null
  const { wrap, Icon } = STYLES[variant] ?? STYLES.error
  return (
    <div role="alert" className={`flex items-start gap-2.5 rounded-lg border p-3 text-sm ${wrap}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}
