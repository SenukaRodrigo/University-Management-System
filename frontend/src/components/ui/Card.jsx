export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900 shadow-card ${className}`}
    >
      {children}
    </div>
  )
}
