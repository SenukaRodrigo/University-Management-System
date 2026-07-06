import { motion, AnimatePresence } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Alert from './ui/Alert'
import { LoadingState, EmptyState } from './ui/Spinner'
import { listContainer, listItem } from '../lib/motion'

export default function MyRequests({ requests, loading, error }) {
  return (
    <section aria-labelledby="my-requests-heading">
      <h2 id="my-requests-heading" className="mb-4 text-xl font-semibold text-slate-100">
        My Requests
      </h2>

      {loading && <LoadingState message="Loading your requests…" />}
      {!loading && error && <Alert>{error}</Alert>}
      {!loading && !error && requests.length === 0 && (
        <EmptyState icon={ClipboardList} message="You haven't requested any lectures yet." />
      )}

      <motion.div
        className="space-y-3"
        variants={listContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence>
          {requests.map(req => (
            <motion.div key={req.id} variants={listItem} exit="exit" layout>
              <Card className="flex items-center justify-between p-4">
                <p className="text-sm font-semibold text-slate-100">{req.lectureTitle}</p>
                <Badge status={req.status} />
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
