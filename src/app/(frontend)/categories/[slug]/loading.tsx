export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Category Header Loading */}
      {/* <div className="mb-12 text-center">
        <div className="relative mx-auto mb-8 h-64 w-full max-w-3xl overflow-hidden rounded-2xl bg-gray-200 animate-pulse"></div>
        <div className="h-10 w-64 mx-auto bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-6 w-96 mx-auto bg-gray-200 rounded animate-pulse"></div>
      </div> */}

      {/* Blogs Grid Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
