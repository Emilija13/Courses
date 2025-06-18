import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogOut, BookOpen, Download, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Course } from "@/types"

interface StudentDashboardProps {
  currentUser: string
  onLogout: () => void
  courses: Course[]
}

export default function StudentDashboard({ 
  currentUser, 
  onLogout, 
  courses
 }: StudentDashboardProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold">EduManage Student</h1>
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Courses</h2>
          <p className="text-gray-600">Access your enrolled courses and materials</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="mt-2">{course.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{course.progress || 0}%</Badge>
                </div>
                <div className="text-sm text-gray-600 mt-2">Instructor: {course.instructor}</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{course.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Course Materials ({course.files.length})
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {course.files.slice(0, 3).map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {file.size} • {file.uploadDate}
                            </p>
                          </div>
                          <Button size="sm" variant="ghost" className="ml-2" onClick={(e) => e.stopPropagation()}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {course.files.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">+{course.files.length - 3} more files</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses enrolled</h3>
              <p className="text-gray-600">Contact your administrator to get enrolled in courses.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
