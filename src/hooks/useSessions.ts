'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@/lib/types'

export function useSessions(studentId: string | undefined) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
    if (!studentId) return
    setLoading(true)
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('sessions')
      .select('*, teachers(name, subject)')
      .eq('student_id', studentId)
      .order('date', { ascending: false })

    if (err) {
      setError(err.message)
    } else {
      setSessions((data as Session[]) ?? [])
    }
    setLoading(false)
  }, [studentId])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  return { sessions, loading, error, refetch: fetchSessions }
}
