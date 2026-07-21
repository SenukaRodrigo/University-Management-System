import Card from './Card'
import Skeleton from './Skeleton'

// Mirrors the real lecture card (title, lecturer/description lines, action
// button) with the same padding so nothing shifts when real data arrives.
export default function LectureCardSkeleton() {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="mt-4 flex justify-end">
        <Skeleton className="h-8 w-24" />
      </div>
    </Card>
  )
}
