import { useRef, useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

// Status badges live here — amber/green/red in one place so they're always consistent.
const BADGE_STYLES = {
  PENDING:  'bg-amber-500/10  text-amber-400  ring-amber-500/30',
  ACCEPTED: 'bg-green-500/10  text-green-400  ring-green-500/30',
  REJECTED: 'bg-red-500/10    text-red-400    ring-red-500/30',
}

const BADGE_LABELS = {
  PENDING:  'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
}

export default function Badge({ status }) {
  const style = BADGE_STYLES[status] ?? 'bg-slate-700/40 text-slate-300 ring-slate-600/30'
  const label = BADGE_LABELS[status] ?? status

  // Quick pop only when the status actually changes — not on first render, so a
  // freshly loaded list doesn't pop a dozen badges at once. We compare the
  // previous status inside the effect (reading a ref during render isn't allowed)
  // and drive the keyframe imperatively through animation controls.
  const controls = useAnimationControls()
  const prevStatus = useRef(status)
  useEffect(() => {
    if (prevStatus.current !== status) {
      controls.start({ scale: [1, 1.1, 1], transition: { duration: 0.25 } })
      prevStatus.current = status
    }
  }, [status, controls])

  return (
    <motion.span
      animate={controls}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${style}`}
    >
      {label}
    </motion.span>
  )
}
