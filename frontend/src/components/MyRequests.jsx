const STATUS_STYLE = {
  PENDING:  { color: '#888',  label: 'Pending' },
  ACCEPTED: { color: 'green', label: 'Accepted' },
  REJECTED: { color: 'red',   label: 'Rejected' },
}

export default function MyRequests({ requests, loading, error }) {
  return (
    <section>
      <h2>My Requests</h2>

      {loading && <p>Loading…</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && requests.length === 0 && <p>No requests yet.</p>}

      {requests.map(req => {
        const { color, label } = STATUS_STYLE[req.status] ?? { color: '#888', label: req.status }
        return (
          <div key={req.id}
            style={{ border: '1px solid #ccc', padding: 12, marginBottom: 8, borderRadius: 4 }}>
            <strong>{req.lectureTitle}</strong>
            <div style={{ marginTop: 4, color }}>
              {label}
            </div>
          </div>
        )
      })}
    </section>
  )
}
