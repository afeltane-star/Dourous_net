import Link from 'next/link'
import { BookOpen, ArrowRight, Users, Calendar, Upload } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 mb-8">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300 font-medium">
              Plateforme éducative premium
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-tight">
            Dourous-Net
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed">
            Connectez-vous avec des professeurs qualifiés, réservez des séances
            personnalisées et uploadez vos devoirs en toute simplicité.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              id="cta-register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              id="cta-login"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: <Users className="w-6 h-6 text-indigo-400" />,
              title: 'Professeurs qualifiés',
              desc: 'Consultez notre annuaire de professeurs experts dans leur matière.',
            },
            {
              icon: <Calendar className="w-6 h-6 text-violet-400" />,
              title: 'Réservation simple',
              desc: 'Choisissez votre date et réservez en quelques clics.',
            },
            {
              icon: <Upload className="w-6 h-6 text-purple-400" />,
              title: 'Upload de devoirs',
              desc: 'Soumettez vos devoirs PDF directement lors de la réservation.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors duration-200"
            >
              <div className="bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
