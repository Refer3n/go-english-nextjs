export default function Loading() {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  