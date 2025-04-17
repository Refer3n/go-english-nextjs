export default function Loading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-100 animate-pulse h-[500px] rounded-2xl" />
          ))}
        </div>
      )
}