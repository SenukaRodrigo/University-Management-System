import { useState, useEffect, useCallback, useMemo } from 'react'
import { BookOpen, Check, Loader2 } from 'lucide-react'
import api from '../api/axios'
import Button from './ui/Button'
import Card from './ui/Card'
import Alert from './ui/Alert'
import { LoadingState, EmptyState } from './ui/Spinner'

export default function BrowseLectures({ myRequests, onRequestMade }) {
  const [lectures, setLectures] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [pending, setPending]   = useState({})   // { [lectureId]: true } while POST is in-flight

  useEffect(() => {
    api.get('/lectures')
      .then(({ data }) => setLectures(data))
      .catch(() => setError('Failed to load lectures'))
      .finally(() => setLoading(false))
  }, [])

  const requestedIds = useMemo(
    () => new Set(myRequests.map(r => r.lectureId)),
    [myRequests]
  )

  const handleRequest = useCallback(async (lectureId) => {
    setPending(p => ({ ...p, [lectureId]: true }))
    try {
      await api.post(`/lectures/${lectureId}/requests`)
      onRequestMade()
    } catch (err) {
      if (err.response?.status === 409) {
        // Already requested — sync silently, no error shown
        onRequestMade()
      } else {
        alert(err.response?.data?.message ?? 'Failed to send request')
      }
    } finally {
      setPending(p => ({ ...p, [lectureId]: false }))
    }
  }, [onRequestMade])

  if (loading) return <LoadingState message="Loading available lectures…" />
  if (error)   return <Alert>{error}</Alert>

  return (
    <section aria-labelledby="browse-heading">
      <h2 id="browse-heading" className="mb-4 text-xl font-semibold text-slate-800">
        Browse Lectures
      </h2>

      {lectures.length === 0 && (
        <EmptyState icon={BookOpen} message="No lectures are available yet." />
      )}

      {/* Responsive grid: 1 col → 2 col on sm → 3 col on lg */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lectures.map(lecture => {
          const isRequested = requestedIds.has(lecture.id)
          const isInFlight  = pending[lecture.id]

          return (
            <Card key={lecture.id} className="flex flex-col p-5">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{lecture.title}</p>
                <p className="mt-1 text-xs font-medium text-navy-600">
                  {lecture.lecturerName}
                </p>
                {lecture.description && (
                  <p className="mt-2 text-sm text-slate-500 line-clamp-3">
                    {lecture.description}
                  </p>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  variant={isRequested ? 'secondary' : 'primary'}
                  disabled={isRequested || isInFlight}
                  onClick={() => handleRequest(lecture.id)}
                  aria-label={
                    isRequested
                      ? `Already requested ${lecture.title}`
                      : `Request to join ${lecture.title}`
                  }
                >
                  {isInFlight ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Requesting…
                    </>
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
          )
        })}
      </div>
    </section>
  )
}
