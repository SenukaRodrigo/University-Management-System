import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Inbox, Check, X } from 'lucide-react'
import api from '../api/axios'
import Button from './ui/Button'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Alert from './ui/Alert'
import { LoadingState, EmptyState } from './ui/Spinner'
import { listContainer, listItem } from '../lib/motion'

export default function IncomingRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/requests/incoming')
      setRequests(data)
    } catch {
      setError('Failed to load incoming requests')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRequests() }, [fetchRequests])

  async function handleStatusChange(id, status) {
    try {
      await api.put(`/requests/${id}`, { status })
      toast.success(status === 'ACCEPTED' ? 'Request accepted.' : 'Request rejected.')
      fetchRequests()
    } catch {
      toast.error('Failed to update request.')
    }
  }

  return (
    <section aria-labelledby="incoming-heading">
      <h2 id="incoming-heading" className="mb-4 text-xl font-semibold text-slate-800">
        Incoming Requests
      </h2>

      {loading && <LoadingState message="Loading requests…" />}
      {!loading && error && <Alert>{error}</Alert>}
      {!loading && !error && requests.length === 0 && (
        <EmptyState icon={Inbox} message="No incoming requests yet." />
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
          <Card className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {req.studentName}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  wants to join{' '}
                  <span className="font-medium text-slate-700">{req.lectureTitle}</span>
                </p>
              </div>

              {/* Status + actions */}
              <div className="flex shrink-0 items-center gap-2">
                <Badge status={req.status} />
                {req.status === 'PENDING' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusChange(req.id, 'ACCEPTED')}
                      aria-label={`Accept ${req.studentName}'s request`}
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">Accept</span>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusChange(req.id, 'REJECTED')}
                      aria-label={`Reject ${req.studentName}'s request`}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">Reject</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
