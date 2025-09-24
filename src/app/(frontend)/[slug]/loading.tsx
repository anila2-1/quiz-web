export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="h-8 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}
