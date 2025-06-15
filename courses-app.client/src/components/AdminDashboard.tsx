import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, BookOpen } from "lucide-react"
import CourseCreation from "@/components/CourseCreation"
import CourseList from "@/components/CourseList"
import UserEnrollment from "@/components/UserEnrollment"
import FileUpload from "@/components/FileUpload"

interface AdminDashboardProps {
  currentUser: string
  onLogout: () => void
}

export default function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Introduction to Computer Science",
      description: "Learn the fundamentals of programming and computer science concepts.",
      instructor: "Dr. Smith",
      enrolledStudents: 25,
      files: [
        { id: 1, name: "Syllabus.pdf", uploadDate: "2024-01-15" },
        { id: 2, name: "Lecture1.pptx", uploadDate: "2024-01-20" },
      ],
    },
    {
      id: 2,
      title: "Web Development Basics",
      description: "HTML, CSS, and JavaScript fundamentals for web development.",
      instructor: "Prof. Johnson",
      enrolledStudents: 18,
      files: [{ id: 3, name: "HTML_Basics.pdf", uploadDate: "2024-01-18" }],
    },
  ])

  const [students] = useState([
    { id: 1, name: "Alice Johnson", email: "alice@example.com" },
    { id: 2, name: "Bob Smith", email: "bob@example.com" },
    { id: 3, name: "Carol Davis", email: "carol@example.com" },
    { id: 4, name: "David Wilson", email: "david@example.com" },
  ])

  const addCourse = (newCourse: any) => {
    const course = {
      ...newCourse,
      id: courses.length + 1,
      instructor: currentUser,
      enrolledStudents: 0,
      files: [],
    }
    setCourses([...courses, course])
  }

  const addFileToCourse = (courseId: number, file: any) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId ? { ...course, files: [...course.files, { ...file, id: Date.now() }] } : course,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold">EduManage Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="create">Create Course</TabsTrigger>
            <TabsTrigger value="enroll">Enroll Students</TabsTrigger>
            <TabsTrigger value="files">Manage Files</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>View and manage all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <CourseList courses={courses} isAdmin={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Course</CardTitle>
                <CardDescription>Add a new course to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <CourseCreation onAddCourse={addCourse} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enroll">
            <Card>
              <CardHeader>
                <CardTitle>Student Enrollment</CardTitle>
                <CardDescription>Enroll students in courses</CardDescription>
              </CardHeader>
              <CardContent>
                <UserEnrollment courses={courses} students={students} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>File Management</CardTitle>
                <CardDescription>Upload and manage course files</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload courses={courses} onFileUpload={addFileToCourse} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
