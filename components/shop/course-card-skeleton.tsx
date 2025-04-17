import { Skeleton } from "../ui/skeleton";


export default function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden h-full">
      <Skeleton className="w-full h-[180px]" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-1/3 rounded-full" />
        </div>
      </div>
    </div>
  )
}
