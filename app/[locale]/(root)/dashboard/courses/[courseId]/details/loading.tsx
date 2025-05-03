import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="px-[2vw] py-6">
      <Skeleton className="h-6 w-64 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Skeleton className="h-80 w-full mb-6" />
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-6" />

          <div className="space-y-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>

          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-40 w-full" />
        </div>

        <div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  )
}
