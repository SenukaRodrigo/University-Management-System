import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import EmptyState from './ui/EmptyState'
import ErrorState from './ui/ErrorState'
import RequestRowSkeleton from './ui/RequestRowSkeleton'
import { listContainer, listItem } from '../lib/motion'

// Presentational: StudentDashboard owns the fetch (the data is shared with
// BrowseLectures) and passes the status machine down.
export default function MyRequests({ requests, status, onRetry, onBrowse }) {
  return (
    <section aria-labelledby="my-requests-heading">
      <h2 id="my-requests-heading" className="mb-4 text-xl font-semibold text-slate-100">
        My Requests
      </h2>

      {status === 'loading' && (
        <div className="space-y-3">
          <RequestRowSkeleton />
          <RequestRowSkeleton />
          <RequestRowSkeleton />
        </div>
      )}

      {status === 'error' && (
        <ErrorState message="Couldn't load your requests." onRetry={onRetry} />
      )}

      {status === 'empty' && (
        <EmptyState
          icon={ClipboardList}
          title="No requests yet"
          message="Browse lectures and request to join one."
          actionLabel="Browse lectures"
          onAction={onBrowse}
        />
      )}

      {status === 'success' && (
        <motion.div
          className="space-y-3"
          variants={listContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {requests.map(req => (
              <motion.div key={req.id} variants={listItem} exit="exit" layout>
                <Card className="flex items-center justify-between gap-3 p-4">
                  <p className="min-w-0 break-words text-sm font-semibold text-slate-100">
                    {req.lectureTitle}
                  </p>
                  <div className="shrink-0">
                    <Badge status={req.status} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}
