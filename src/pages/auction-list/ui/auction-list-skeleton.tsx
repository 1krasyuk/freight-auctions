import { Card, CardContent, CardHeader } from "@/shared/ui/card"
import { Skeleton } from "@/shared/ui/skeleton"

export function AuctionListSkeleton() {
  return (
    <ul className="grid gap-4" aria-label="Загрузка аукционов" aria-busy="true">
      {Array.from({ length: 4 }, (_, index) => (
        <li key={index}>
          <Card>
            <CardHeader className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-4/5" />
                <Skeleton className="h-10 w-3/5" />
              </div>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
