import { ClipboardList } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Alert from './ui/Alert'
import { LoadingState, EmptyState } from './ui/Spinner'

export default function MyRequests({ requests, loading, error }) {
  return (
    <section aria-labelledby="my-requests-heading">
      <h2 id="my-requests-heading" className="mb-4 text-xl font-semibold text-slate-800">
        My Requests
      </h2>

      {loading && <LoadingState message="Loading your requests…" />}
      {!loading && error && <Alert>{error}</Alert>}
      {!loading && !error && requests.length === 0 && (
        <EmptyState icon={ClipboardList} message="You haven't requested any lectures yet." />
      )}

      <div className="space-y-3">
        {requests.map(req => (
          <Card key={req.id} className="flex items-center justify-between p-4">
            <p className="text-sm font-semibold text-slate-900">{req.lectureTitle}</p>
            <Badge status={req.status} />
          </Card>
        ))}
      </div>
    </section>
  )
}
