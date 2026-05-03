import { BookOpen } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl">
          <BookOpen className="w-12 h-12 text-indigo-500 animate-bounce" />
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          Dourous-Net
        </div>
        <div className="h-1 w-32 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 w-1/2 animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
