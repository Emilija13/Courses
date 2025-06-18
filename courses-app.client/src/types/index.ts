export interface User {
  email: string;
  role: "professor" | "student";
}

export interface CourseFile {
  id: number;
  name: string;
  size: string;
  uploadDate: string;
  type?: string;
}

export interface Professor {
  id: number;
  name: string;
  surname: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  professor_id: string;
  professor: Professor;
  students_count: number;
  category: string;
  duration: string;
  level: string;
  files: CourseFile[];
  updated_at: string;
  created_at: string;
  progress?: number; // Optional for student view
}

export interface Student {
  id: number;
  name: string;
  surname: string;
  index: string;
}
