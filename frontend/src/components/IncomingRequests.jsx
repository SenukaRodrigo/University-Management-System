import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'

const STATUS_COLORS = {
  PENDING:  '#888',
  ACCEPTED: 'green',
  REJECTED: 'red',
}

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
      fetchRequests()
    } catch {
      alert(`Failed to update request`)
    }
  }

  return (
    <section>
      <h2>Incoming Requests</h2>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && requests.length === 0 && <p>No pending requests.</p>}

      {requests.map(req => (
        <div key={req.id} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8, borderRadius: 4 }}>
          <div>
            <strong>{req.studentName}</strong> wants to join <strong>{req.lectureTitle}</strong>
          </div>
          <div style={{ marginTop: 4, color: STATUS_COLORS[req.status] ?? '#888' }}>
            Status: {req.status}
          </div>
          {req.status === 'PENDING' && (
            <div style={{ marginTop: 8 }}>
              <button onClick={() => handleStatusChange(req.id, 'ACCEPTED')}
                style={{ marginRight: 8 }}>
                Accept
              </button>
              <button onClick={() => handleStatusChange(req.id, 'REJECTED')}>
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
