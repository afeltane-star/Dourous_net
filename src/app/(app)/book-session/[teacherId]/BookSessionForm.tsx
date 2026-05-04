'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Calendar, Upload, Loader2, FileText, X } from 'lucide-react'

interface Props {
  teacherId: string
  studentId: string
}

export default function BookSessionForm({ teacherId, studentId }: Props) {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    validateAndSetFile(selected)
  }

  function validateAndSetFile(selected: File) {
    if (selected.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptés.')
      return
    }
    if (selected.size > 10 * 1024 * 1024) {
      toast.error('Le fichier ne doit pas dépasser 10 Mo.')
      return
    }
    setFile(selected)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) validateAndSetFile(dropped)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) { toast.error('Veuillez choisir une date.'); return }
    if (!time) { toast.error('Veuillez choisir une heure.'); return }
    if (!file) { toast.error('Veuillez uploader votre devoir (PDF).'); return }

    setLoading(true)
    const supabase = createClient()

    // 1. Upload PDF to Supabase Storage
    const fileExt = 'pdf'
    const fileName = `${studentId}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('homeworks')
      .upload(fileName, file, { contentType: 'application/pdf', upsert: false })

    if (uploadError) {
      toast.error('Erreur lors de l\'upload : ' + uploadError.message)
      setLoading(false)
      return
    }

    // 2. Get public URL
    const { data: urlData } = supabase.storage
      .from('homeworks')
      .getPublicUrl(fileName)

    const homeworkUrl = urlData.publicUrl

    // 3. Insert session record
    const { error: insertError } = await supabase.from('sessions').insert({
      student_id: studentId,
      teacher_id: teacherId,
      date,
      time,
      status: 'pending',
      homework_file_url: homeworkUrl,
    })

    if (insertError) {
      toast.error('Erreur lors de la réservation : ' + insertError.message)
      setLoading(false)
      return
    }

    toast.success('Séance réservée avec succès !')
    router.push('/dashboard')
    router.refresh()
  }

  // Min date = today
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date picker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="session-date" className="block text-sm font-medium text-slate-300 mb-2">
            Date de la séance
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            <input
              id="session-date"
              type="date"
              required
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl pl-10 pr-4 py-3 text-white outline-none transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="session-time" className="block text-sm font-medium text-slate-300 mb-2">
            Heure de la séance
          </label>
          <input
            id="session-time"
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-white outline-none transition-all [color-scheme:dark]"
          />
        </div>
      </div>

      {/* File upload */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Devoir (PDF uniquement)
        </label>

        {file ? (
          <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
            <div className="bg-indigo-500/20 p-2 rounded-lg shrink-0">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{file.name}</p>
              <p className="text-slate-400 text-xs">
                {(file.size / 1024).toFixed(1)} Ko
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label
            id="homework-upload"
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200 ${
              dragOver
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/50 hover:bg-slate-800'
            }`}
          >
            <div className={`p-3 rounded-xl transition-colors ${dragOver ? 'bg-indigo-500/20' : 'bg-slate-700'}`}>
              <Upload className={`w-6 h-6 ${dragOver ? 'text-indigo-400' : 'text-slate-400'}`} />
            </div>
            <div className="text-center">
              <p className="text-white text-sm font-medium">
                Glissez votre PDF ici
              </p>
              <p className="text-slate-400 text-xs mt-1">
                ou cliquez pour choisir un fichier (max 10 Mo)
              </p>
            </div>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Submit */}
      <button
        id="book-session-submit"
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Réservation en cours…
          </>
        ) : (
          'Confirmer la réservation'
        )}
      </button>
    </form>
  )
}
