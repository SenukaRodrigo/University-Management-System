// Shared framer-motion variants. Kept in one place so every page and list
// animates with the same rhythm. Reduced-motion is handled globally by the
// <MotionConfig reducedMotion="user"> wrapper in App.jsx, which strips the
// transform (x/y/scale) parts of these and leaves only opacity.

// Page-level route transitions.
export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}
export const pageTransition = { duration: 0.2 }

// List container: staggers its children in on mount.
export const listContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05 } },
}

// A single list item (lecture card, request row, …).
export const listItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } },
}
