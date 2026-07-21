import { useReducedMotion } from 'framer-motion'

// Grey placeholder block with a shimmer sweep (see .skeleton-shimmer in
// index.css). Size it with width/height (any CSS value) or Tailwind classes.
// Reduced-motion users get a static grey block — same approach as the rest of
// our framer-motion setup.
export default function Skeleton({ width, height, className = '' }) {
  const reduceMotion = useReducedMotion()
  return (
    <div
      aria-hidden="true"
      style={{ width, height }}
      className={`rounded-md bg-slate-700/60 ${reduceMotion ? '' : 'skeleton-shimmer'} ${className}`}
    />
  )
}
