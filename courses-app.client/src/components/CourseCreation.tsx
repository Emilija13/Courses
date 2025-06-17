import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import type { Course } from "@/types"

interface CourseCreationProps {
  onAddCourse: (course: Omit<Course, "id" | "enrolledStudents" | "files" | "createdDate">) => void
}

export default function CourseCreation({ onAddCourse }: CourseCreationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const courseData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      duration: formData.get("duration") as string,
      level: formData.get("level") as string,
      instructor: "Current User", // This would be set by the parent component
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onAddCourse(courseData)
    setIsSubmitting(false)

    // Reset form
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input id="title" name="title" placeholder="Enter course title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
              <SelectItem value="literature">Literature</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Course Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Provide a detailed description of the course"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (weeks)</Label>
          <Input id="duration" name="duration" type="number" placeholder="12" min="1" max="52" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Difficulty Level</Label>
          <Select name="level" required>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? (
          "Creating Course..."
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </>
        )}
      </Button>
    </form>
  )
}
