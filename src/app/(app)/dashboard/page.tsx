import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Session } from '@/lib/types'
import {
  Calendar,
  Clock,
  CheckCircle,
  Plus,
  BookOpen,
  FileText,
  Activity,
  ChevronRight,
  GraduationCap,
} from 'lucide-react'

const statusConfig = {
  pending: {
    label: 'En attente',
    icon: Clock,
    className: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    activityLabel: 'Réservée',
  },
  confirmed: {
    label: 'Confirmée',
    icon: CheckCircle,
    className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    activityLabel: 'Confirmée',
  },
  completed: {
    label: 'Terminée',
    icon: BookOpen,
    className: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
    activityLabel: 'Effectuée',
  },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*, teachers(name, subject)')
    .eq('student_id', user.id)
    .order('date', { ascending: false })

  const typedSessions = (sessions as Session[]) ?? []

  // No longer grouping by filiere

  const counts = {
    pending: typedSessions.filter((s) => s.status === 'pending').length,
    confirmed: typedSessions.filter((s) => s.status === 'confirmed').length,
    completed: typedSessions.filter((s) => s.status === 'completed').length,
  }

  // Activities (Mocked from actual session events for now)
  const activities = typedSessions.slice(0, 5).map(s => ({
    id: s.id,
    type: s.status,
    title: `Séance ${statusConfig[s.status].activityLabel.toLowerCase()}`,
    description: `Avec ${s.teachers?.name} (${s.teachers?.subject})`,
    date: s.created_at || s.date,
  }))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Bonjour,{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {user.user_metadata?.full_name?.split(' ')[0] ?? 'Élève'} 👋
            </span>
          </h1>
          <p className="text-slate-400 mt-1 text-lg">Prêt pour votre prochaine séance ?</p>
        </div>
        <Link
          href="/teachers"
          id="dashboard-book-btn"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          Réserver une séance
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        {(
          [
            { key: 'pending', label: 'En attente', color: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/20' },
            { key: 'confirmed', label: 'Confirmées', color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/20' },
            { key: 'completed', label: 'Terminées', color: 'text-slate-400', bg: 'bg-slate-500/5 border-slate-500/20' },
          ] as const
        ).map(({ key, label, color, bg }) => (
          <div
            key={key}
            className={`${bg} border backdrop-blur-sm rounded-3xl p-6 flex flex-col gap-1 transition-transform hover:scale-[1.02] duration-200`}
          >
            <span className={`text-4xl font-black ${color}`}>{counts[key]}</span>
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main List: Sessions Grouped by Filière */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Mes séances
              </h2>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400 text-sm flex items-center gap-3">
                <Activity className="w-5 h-5" />
                Erreur lors du chargement des séances.
              </div>
            )}

            {!error && typedSessions.length === 0 && (
              <div className="bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm rounded-3xl p-16 text-center">
                <div className="bg-slate-800/50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-white text-xl font-bold mb-3">Aucune séance pour le moment</h3>
                <p className="text-slate-400 text-base mb-8 max-w-sm mx-auto">
                  Commencez votre apprentissage en réservant votre première séance avec l&apos;un de nos experts.
                </p>
                <Link
                  href="/teachers"
                  className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-200 font-bold px-8 py-3.5 rounded-2xl transition-all duration-200"
                >
                  Explorer les professeurs
                </Link>
              </div>
            )}

            {!error && typedSessions.length > 0 && (
              <div className="space-y-4">
                {typedSessions.map((session) => {
                  const cfg = statusConfig[session.status]
                  const StatusIcon = cfg.icon
                  return (
                    <div
                      key={session.id}
                      className="group bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/50 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-7 h-7 text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg group-hover:text-indigo-300 transition-colors">
                              {session.teachers?.name ?? 'Professeur'}
                            </p>
                            <p className="text-slate-400 font-medium">
                              {session.teachers?.subject ?? '—'}
                            </p>
                            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2">
                              <span className="text-slate-500 text-sm flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-lg">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(session.date).toLocaleDateString('fr-FR', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                              {session.time && (
                                <span className="text-slate-500 text-sm flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-lg">
                                  <Clock className="w-3.5 h-3.5" />
                                  {session.time}
                                </span>
                              )}
                              {session.homework_file_url && (
                                <a
                                  href={session.homework_file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                                >
                                  <FileText className="w-4 h-4" />
                                  Voir le devoir
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center self-end sm:self-center">
                          <span className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider ${cfg.className}`}>
                            <StatusIcon className="w-4 h-4" />
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Recent Activity */}
        <div className="space-y-8">
          <div className="bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-violet-400" />
              Activités Récentes
            </h2>

            <div className="space-y-6">
              {activities.length > 0 ? (
                activities.map((activity, idx) => (
                  <div key={activity.id} className="relative pl-7 pb-6 last:pb-0">
                    {idx !== activities.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-slate-800" />
                    )}
                    <div className="absolute left-0 top-1.5 w-[24px] h-[24px] bg-slate-900 border-2 border-slate-800 rounded-full flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${activity.type === 'confirmed' ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold leading-none">{activity.title}</p>
                      <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{activity.description}</p>
                      <p className="text-slate-500 text-[10px] mt-1.5 font-medium uppercase tracking-tight">
                        {new Date(activity.date as string).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm text-center py-4 italic">Aucune activité récente</p>
              )}
            </div>

            <button className="w-full mt-6 py-3 border border-slate-800 hover:bg-slate-800/50 rounded-2xl text-slate-400 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              Voir tout l&apos;historique
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick tip or promo */}
          <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 rounded-3xl p-6">
            <h3 className="text-indigo-300 font-bold text-sm mb-2 uppercase tracking-wider">Astuce Pro</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Téléchargez vos devoirs au format PDF avant la séance pour permettre au professeur de mieux préparer votre cours.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
