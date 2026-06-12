import { useState, useEffect, useCallback, useMemo } from 'react'
import api from '../api/axios'

export default function BrowseLectures({ myRequests, onRequestMade }) {
  const [lectures, setLectures] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  // Tracks lecture IDs where a POST is in-flight.
  const [pending, setPending] = useState({})

  useEffect(() => {
    api.get('/lectures')
      .then(({ data }) => setLectures(data))
      .catch(() => setError('Failed to load lectures'))
      .finally(() => setLoading(false))
  }, [])

  // Derived from the parent's up-to-date request list — stays in sync after every refresh.
  const requestedIds = useMemo(
    () => new Set(myRequests.map(r => r.lectureId)),
    [myRequests]
  )

  const handleRequest = useCallback(async (lectureId) => {
    setPending(p => ({ ...p, [lectureId]: true }))
    try {
      await api.post(`/lectures/${lectureId}/requests`)
      // Refresh the parent's request list; the button state follows from that.
      onRequestMade()
    } catch (err) {
      if (err.response?.status === 409) {
        // Already requested (e.g. stale list or concurrent click) — sync the list
        // silently rather than showing an error.
        onRequestMade()
      } else {
        alert(err.response?.data?.message ?? 'Failed to send request')
      }
    } finally {
      setPending(p => ({ ...p, [lectureId]: false }))
    }
  }, [onRequestMade])

  if (loading) return <p>Loading lectures…</p>
  if (error)   return <p style={{ color: 'red' }}>{error}</p>

  return (
    <section style={{ marginBottom: 40 }}>
      <h2>Browse Lectures</h2>

      {lectures.length === 0 && <p>No lectures available yet.</p>}

      {lectures.map(lecture => {
        const isRequested = requestedIds.has(lecture.id)
        const isInFlight  = pending[lecture.id]

        return (
          <div key={lecture.id}
            style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8, borderRadius: 4 }}>
            <strong>{lecture.title}</strong>
            <div style={{ fontSize: '0.85em', color: '#555', marginBottom: 4 }}>
              Lecturer: {lecture.lecturerName}
            </div>
            {lecture.description && (
              <p style={{ margin: '4px 0 8px' }}>{lecture.description}</p>
            )}
            <button
              disabled={isRequested || isInFlight}
              onClick={() => handleRequest(lecture.id)}
            >
              {isInFlight ? 'Requesting…' : isRequested ? 'Requested' : 'Request'}
            </button>
          </div>
        )
      })}
    </section>
  )
}
