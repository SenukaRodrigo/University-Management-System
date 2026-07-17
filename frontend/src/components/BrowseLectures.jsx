import { useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { BookOpen, Check } from 'lucide-react'
import api from '../api/axios'
import Button from './ui/Button'
import Card from './ui/Card'
import EmptyState from './ui/EmptyState'
import ErrorState from './ui/ErrorState'
import LectureCardSkeleton from './ui/LectureCardSkeleton'
import useListFetch from '../hooks/useListFetch'
import { listContainer, listItem } from '../lib/motion'

const fetchLectures = () => api.get('/lectures', { skipErrorToast: true }).then(r => r.data)

export default function BrowseLectures({ myRequests, onRequestMade }) {
  const { items: lectures, status, refetch } = useListFetch(fetchLectures)
  const [pending, setPending] = useState({})   // { [lectureId]: true } while POST is in-flight

  const requestedIds = useMemo(
    () => new Set(myRequests.map(r => r.lectureId)),
    [myRequests]
  )

  const handleRequest = useCallback(async (lectureId) => {
    setPending(p => ({ ...p, [lectureId]: true }))
    try {
      await api.post(`/lectures/${lectureId}/requests`)
      toast.success('Request sent.')
      onRequestMade()
    } catch (err) {
      if (err.response?.status === 409) {
        // Already requested — let the student know, then sync state.
        toast.info("You've already requested this lecture.")
        onRequestMade()
      } else {
        toast.error(err.response?.data?.message ?? 'Failed to send request.')
      }
    } finally {
      setPending(p => ({ ...p, [lectureId]: false }))
    }
  }, [onRequestMade])

  return (
    <section aria-labelledby="browse-heading">
      <h2 id="browse-heading" className="mb-4 text-xl font-semibold text-slate-100">
        Browse Lectures
      </h2>

      {status === 'loading' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <LectureCardSkeleton />
          <LectureCardSkeleton />
          <LectureCardSkeleton />
        </div>
      )}

      {status === 'error' && (
        <ErrorState message="Couldn't load lectures." onRetry={refetch} />
      )}

      {status === 'empty' && (
        <EmptyState
          icon={BookOpen}
          title="No lectures available"
          message="Check back later — there's nothing to join yet."
        />
      )}

      {status === 'success' && (
        // Responsive grid: 1 col → 2 col on sm → 3 col on lg
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={listContainer}
          initial="initial"
          animate="animate"
        >
          {lectures.map(lecture => {
            const isRequested = requestedIds.has(lecture.id)
            const isInFlight  = pending[lecture.id]

            return (
              <motion.div
                key={lecture.id}
                variants={listItem}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <Card className="flex h-full flex-col p-5">
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-semibold text-slate-100">{lecture.title}</p>
                    <p className="mt-1 text-xs font-medium text-navy-300">
                      {lecture.lecturerName}
                    </p>
                    {lecture.description && (
                      <p className="mt-2 text-sm text-slate-400 line-clamp-3">
                        {lecture.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      variant={isRequested ? 'secondary' : 'primary'}
                      disabled={isRequested}
                      loading={isInFlight}
                      onClick={() => handleRequest(lecture.id)}
                      aria-label={
                        isRequested
                          ? `Already requested ${lecture.title}`
                          : `Request to join ${lecture.title}`
                      }
                    >
                      {isInFlight ? (
                        'Sending…'
                      ) : isRequested ? (
                        <>
                          <Check className="h-4 w-4" aria-hidden="true" />
                          Requested
                        </>
                      ) : (
                        'Request'
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
