import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="px-[2vw] py-6">
      <div className="mb-6">
        <Skeleton className="h-6 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />

          <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>

          <div className="flex space-x-4 mb-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="space-y-6">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-4">
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
              </div>
              <div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
              </div>
              <div>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


