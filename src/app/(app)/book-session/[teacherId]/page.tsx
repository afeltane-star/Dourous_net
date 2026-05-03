import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import BookSessionForm from './BookSessionForm'
import type { Teacher } from '@/lib/types'
import { ArrowLeft, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default async function BookSessionPage({
  params,
}: {
  params: Promise<{ teacherId: string }>
}) {
  const { teacherId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: teacher } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', teacherId)
    .single()

  if (!teacher) notFound()

  const typedTeacher = teacher as Teacher

  const initials = typedTeacher.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/teachers"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Retour aux professeurs
      </Link>

      {/* Teacher card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center">
          {typedTeacher.photo_url && !typedTeacher.photo_url.startsWith('placeholder') ? (
            <img
              src={typedTeacher.photo_url}
              alt={typedTeacher.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-indigo-300 font-bold text-xl">{initials}</span>
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{typedTeacher.name}</h2>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg mt-1.5">
            <GraduationCap className="w-3 h-3" />
            {typedTeacher.subject}
          </span>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            {typedTeacher.description}
          </p>
        </div>
      </div>

      {/* Booking form */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-bold text-white mb-6">Réserver une séance</h1>
        <BookSessionForm teacherId={teacherId} studentId={user.id} />
      </div>
    </div>
  )
}
