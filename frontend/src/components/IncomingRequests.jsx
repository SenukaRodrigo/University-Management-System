import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Inbox, Check, X } from 'lucide-react'
import api from '../api/axios'
import Button from './ui/Button'
import Card from './ui/Card'
import Badge from './ui/Badge'
import EmptyState from './ui/EmptyState'
import ErrorState from './ui/ErrorState'
import RequestRowSkeleton from './ui/RequestRowSkeleton'
import useListFetch from '../hooks/useListFetch'
import { listContainer, listItem } from '../lib/motion'

const fetchIncoming = () => api.get('/requests/incoming', { skipErrorToast: true }).then(r => r.data)

export default function IncomingRequests() {
  const { items: requests, status, refetch } = useListFetch(fetchIncoming)
  // { id, status } of the accept/reject currently in flight — disables both
  // buttons on that row and marks the clicked one as loading.
  const [acting, setActing] = useState(null)

  async function handleStatusChange(id, newStatus) {
    setActing({ id, status: newStatus })
    try {
      await api.put(`/requests/${id}`, { status: newStatus })
      toast.success(newStatus === 'ACCEPTED' ? 'Request accepted.' : 'Request rejected.')
      refetch()
    } catch {
      toast.error('Failed to update request.')
    } finally {
      setActing(null)
    }
  }

  return (
    <section aria-labelledby="incoming-heading">
      <h2 id="incoming-heading" className="mb-4 text-xl font-semibold text-slate-100">
        Incoming Requests
      </h2>

      {status === 'loading' && (
        <div className="space-y-3">
          <RequestRowSkeleton />
          <RequestRowSkeleton />
          <RequestRowSkeleton />
        </div>
      )}

      {status === 'error' && (
        <ErrorState message="Couldn't load requests." onRetry={refetch} />
      )}

      {status === 'empty' && (
        <EmptyState
          icon={Inbox}
          title="No incoming requests"
          message="When students request to join your lectures, they'll appear here."
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
            {requests.map(req => {
              const isActing = acting?.id === req.id
              return (
                <motion.div key={req.id} variants={listItem} exit="exit" layout>
                  <Card className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold text-slate-100">
                          {req.studentName}
                        </p>
                        <p className="mt-0.5 break-words text-sm text-slate-400">
                          wants to join{' '}
                          <span className="font-medium text-slate-300">{req.lectureTitle}</span>
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
                              disabled={isActing}
                              loading={isActing && acting.status === 'ACCEPTED'}
                              onClick={() => handleStatusChange(req.id, 'ACCEPTED')}
                              aria-label={`Accept ${req.studentName}'s request`}
                            >
                              {!(isActing && acting.status === 'ACCEPTED') && (
                                <Check className="h-4 w-4" aria-hidden="true" />
                              )}
                              <span className="hidden sm:inline">
                                {isActing && acting.status === 'ACCEPTED' ? 'Accepting…' : 'Accept'}
                              </span>
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={isActing}
                              loading={isActing && acting.status === 'REJECTED'}
                              onClick={() => handleStatusChange(req.id, 'REJECTED')}
                              aria-label={`Reject ${req.studentName}'s request`}
                            >
                              {!(isActing && acting.status === 'REJECTED') && (
                                <X className="h-4 w-4" aria-hidden="true" />
                              )}
                              <span className="hidden sm:inline">
                                {isActing && acting.status === 'REJECTED' ? 'Rejecting…' : 'Reject'}
                              </span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}
