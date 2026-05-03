export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col gap-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-800 rounded-lg" />
        <div className="h-4 w-64 bg-slate-800 rounded-lg" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[320px] bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
            <div className="h-40 bg-slate-800" />
            <div className="p-5 flex-1 space-y-3">
              <div className="h-6 w-3/4 bg-slate-800 rounded" />
              <div className="h-4 w-1/4 bg-slate-800 rounded" />
              <div className="h-12 w-full bg-slate-800 rounded-xl mt-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
