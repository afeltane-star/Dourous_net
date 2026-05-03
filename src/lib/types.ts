export type Teacher = {
  id: string
  name: string
  subject: string
  description: string
  photo_url: string
}

export type Session = {
  id: string
  student_id: string
  teacher_id: string
  date: string
  filiere: string | null
  status: 'pending' | 'confirmed' | 'completed'
  homework_file_url: string | null
  teachers?: Teacher
}

export type SessionStatus = 'pending' | 'confirmed' | 'completed'
