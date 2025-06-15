import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Download, Trash2 } from "lucide-react"

interface Course {
  id: number
  title: string
  files: any[]
}

interface FileUploadProps {
  courses: Course[]
  onFileUpload: (courseId: number, file: any) => void
}

export default function FileUpload({ courses, onFileUpload }: FileUploadProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourse) return

    setIsUploading(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const file = formData.get("file") as File

    if (file) {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const fileData = {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadDate: new Date().toISOString().split("T")[0],
        type: file.type,
      }

      onFileUpload(Number.parseInt(selectedCourse), fileData)
    }

    setIsUploading(false)
    ;(e.target as HTMLFormElement).reset()
  }

  const selectedCourseData = courses.find((c) => c.id.toString() === selectedCourse)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Course Files
          </CardTitle>
          <CardDescription>Add files to your courses</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Select Course</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.png" required />
              </div>
            </div>

            <Button type="submit" disabled={!selectedCourse || isUploading}>
              {isUploading ? "Uploading..." : "Upload File"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {selectedCourseData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Files in {selectedCourseData.title}
            </CardTitle>
            <CardDescription>{selectedCourseData.files.length} file(s) uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedCourseData.files.length > 0 ? (
              <div className="space-y-2">
                {selectedCourseData.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">Uploaded on {file.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No files uploaded yet for this course</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
