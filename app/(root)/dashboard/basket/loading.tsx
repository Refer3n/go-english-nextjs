import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="px-[2vw] py-6">
      <h1 className="text-3xl font-bold mb-6">Basket</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 space-y-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="flex gap-4 p-4 bg-white rounded-lg">
              <Skeleton className="w-[180px] h-[120px] rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="w-[100px] space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="lg:w-1/4">
          <div className="sticky top-6">
            <Skeleton className="h-[300px] w-full rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
