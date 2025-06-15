import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, Edit, Trash2 } from "lucide-react"

interface Course {
  id: number
  title: string
  description: string
  instructor: string
  enrolledStudents: number
  files: any[]
}

interface CourseListProps {
  courses: Course[]
  isAdmin?: boolean
}

export default function CourseList({ courses, isAdmin = false }: CourseListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription className="mt-2">{course.description}</CardDescription>
              </div>
              {isAdmin && (
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600 mt-2">Instructor: {course.instructor}</div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{course.enrolledStudents} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>{course.files.length} files</span>
                </div>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
