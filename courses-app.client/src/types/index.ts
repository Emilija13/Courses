export interface User {
  username: string
  role: "admin" | "student"
}

export interface CourseFile {
  id: number
  name: string
  size: string
  uploadDate: string
  type?: string
}

export interface Course {
  id: number
  title: string
  description: string
  instructor: string
  enrolledStudents: number
  category: string
  duration: string
  level: string
  files: CourseFile[]
  createdDate: string
  progress?: number // Optional for student view
}

export interface Student {
  id: number
  name: string
  email: string
}
