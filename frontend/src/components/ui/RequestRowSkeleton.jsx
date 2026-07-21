import Card from './Card'
import Skeleton from './Skeleton'

// Mirrors a request row: two text lines on the left, a badge pill and action
// buttons on the right — same p-4 padding as the real row.
export default function RequestRowSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-7 w-9 sm:w-20" />
          <Skeleton className="h-7 w-9 sm:w-20" />
        </div>
      </div>
    </Card>
  )
}
