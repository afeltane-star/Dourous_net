import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Teacher } from '@/lib/types'
import { Users, BookmarkPlus, GraduationCap } from 'lucide-react'

const SUBJECT_COLORS: Record<string, string> = {
  Mathématiques: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Physique: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Chimie: 'bg-green-500/10 text-green-400 border-green-500/20',
  Français: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Anglais: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Arabe: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Histoire: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Informatique: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  SVT: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Économie: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

function subjectClass(subject: string) {
  return SUBJECT_COLORS[subject] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
}

// Fallback avatar using initials
function Avatar({ name, photoUrl }: { name: string; photoUrl: string }) {
  if (photoUrl && !photoUrl.startsWith('placeholder')) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className="w-full h-full object-cover"
      />
    )
  }
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/30 to-violet-500/30 text-indigo-300 font-bold text-2xl">
      {initials}
    </div>
  )
}

export default async function TeachersPage() {
  const supabase = await createClient()
  const { data: teachers, error } = await supabase
    .from('teachers')
    .select('*')
    .order('name')

  const typedTeachers = (teachers as Teacher[]) ?? []

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Nos Professeurs</h1>
        <p className="text-slate-400">
          Choisissez un professeur et réservez votre séance
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-400 text-sm">
          Erreur lors du chargement des professeurs.
        </div>
      )}

      {!error && typedTeachers.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-white font-semibold mb-2">Aucun professeur</h3>
          <p className="text-slate-400 text-sm">
            Aucun professeur n&apos;est disponible pour le moment.
          </p>
        </div>
      )}

      {!error && typedTeachers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {typedTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="group bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col"
            >
              {/* Photo */}
              <div className="h-40 overflow-hidden relative bg-slate-800">
                <Avatar name={teacher.name} photoUrl={teacher.photo_url} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h2 className="font-semibold text-white text-lg leading-tight group-hover:text-indigo-300 transition-colors">
                      {teacher.name}
                    </h2>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border mt-1.5 ${subjectClass(teacher.subject)}`}
                    >
                      <GraduationCap className="w-3 h-3" />
                      {teacher.subject}
                    </span>
                  </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed flex-1 mt-2 line-clamp-3">
                  {teacher.description}
                </p>

                <Link
                  href={`/book-session/${teacher.id}`}
                  id={`book-teacher-${teacher.id}`}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  Réserver
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
