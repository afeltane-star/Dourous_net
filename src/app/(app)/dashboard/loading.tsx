export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col gap-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-800 rounded-lg" />
          <div className="h-4 w-64 bg-slate-800 rounded-lg" />
        </div>
        <div className="h-10 w-40 bg-slate-800 rounded-xl" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-slate-900/60 border border-slate-800 rounded-2xl" />
        ))}
      </div>

      {/* List Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-32 bg-slate-800 rounded-lg" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-900/60 border border-slate-800 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
