import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import LoginPage from "@/components/LoginPage"
import AdminDashboard from "@/components/AdminDashboard"
import StudentDashboard from "@/components/StudentDashboard"
import CourseDetail from "@/components/CourseDetail"
import type { User, Course, Student, CourseFile } from "@/types"

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      name: "Introduction to Computer Science",
      description:
        "Learn the fundamentals of programming and computer science concepts. This comprehensive course covers basic programming principles, data structures, algorithms, and software development practices.",
      instructor: "Dr. Smith",
      enrolledStudents: 25,
      category: "Computer Science",
      duration: "12",
      level: "beginner",
      createdDate: "2024-01-10",
      files: [
        { id: 1, name: "Syllabus.pdf", uploadDate: "2024-01-15", size: "245 KB" },
        { id: 2, name: "Lecture1.pptx", uploadDate: "2024-01-20", size: "1.2 MB" },
        { id: 3, name: "Assignment1.docx", uploadDate: "2024-01-25", size: "156 KB" },
        { id: 4, name: "Reading_List.pdf", uploadDate: "2024-01-30", size: "89 KB" },
      ],
    },
    {
      id: 2,
      name: "Web Development Basics",
      description:
        "HTML, CSS, and JavaScript fundamentals for web development. Build responsive websites and learn modern web development techniques.",
      instructor: "Prof. Johnson",
      enrolledStudents: 18,
      category: "Web Development",
      duration: "8",
      level: "beginner",
      createdDate: "2024-01-12",
      files: [
        { id: 5, name: "HTML_Basics.pdf", uploadDate: "2024-01-18", size: "890 KB" },
        { id: 6, name: "CSS_Guide.pdf", uploadDate: "2024-01-22", size: "1.5 MB" },
        { id: 7, name: "JavaScript_Intro.pdf", uploadDate: "2024-01-28", size: "2.1 MB" },
      ],
    },
    {
      id: 3,
      name: "Advanced Mathematics",
      description: "Calculus, linear algebra, and advanced mathematical concepts for engineering and science students.",
      instructor: "Dr. Williams",
      enrolledStudents: 32,
      category: "Mathematics",
      duration: "16",
      level: "advanced",
      createdDate: "2024-01-08",
      files: [
        { id: 8, name: "Calculus_Notes.pdf", uploadDate: "2024-01-16", size: "3.2 MB" },
        { id: 9, name: "Linear_Algebra.pdf", uploadDate: "2024-01-24", size: "2.8 MB" },
      ],
    },
  ])

  const [students] = useState<Student[]>([
    { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" },
    { id: 3, name: "Carol Davis", email: "carol@example.com" },
    { id: 4, name: "David Wilson", email: "david@example.com" },
    { id: 5, name: "Emma Brown", email: "emma@example.com" },
    { id: 6, name: "Frank Miller", email: "frank@example.com" },
  ])

  const handleLogin = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const addCourse = (newCourse: Omit<Course, "id" | "enrolledStudents" | "files" | "createdDate">) => {
    const course: Course = {
      ...newCourse,
      id: courses.length + 1,
      enrolledStudents: 0,
      files: [],
      createdDate: new Date().toISOString().split("T")[0],
    }
    setCourses([...courses, course])
  }

  const addFileToCourse = (courseId: number, file: Omit<CourseFile, "id">) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId ? { ...course, files: [...course.files, { ...file, id: Date.now() }] } : course,
      ),
    )
  }

  if (!user) {
    return (
      <Router>
        <LoginPage onLogin={handleLogin} />
      </Router>
    )
  }

  // Add progress to courses for student view
  const coursesWithProgress = courses.map((course) => ({
    ...course,
    progress: user.role === "student" ? Math.floor(Math.random() * 100) : undefined,
  }))

  // Mock enrolled courses for students (courses 1 and 2)
  const enrolledCourses =
    user.role === "student" ? coursesWithProgress.filter((course) => [1, 2].includes(course.id)) : coursesWithProgress

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user.role === "professor" ? (
              <AdminDashboard
                currentUser={user.email}
                onLogout={handleLogout}
                courses={courses}
                students={students}
                onAddCourse={addCourse}
                onAddFile={addFileToCourse}
              />
            ) : (
              <StudentDashboard currentUser={user.email} onLogout={handleLogout} courses={enrolledCourses} />
            )
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <CourseDetail
              courses={courses}
              students={students}
              currentUser={user.email}
              userRole={user.role}
              onLogout={handleLogout}
              onAddFile={addFileToCourse}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
