import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Course } from "@/types";

interface CourseListProps {
  courses: Course[];
  isAdmin?: boolean;
  onDeleteCourse?: (id: number) => void; 
}

export default function CourseList({
  courses,
  isAdmin = false,
  onDeleteCourse
}: CourseListProps) {
  const navigate = useNavigate();
  
  const handleDelete = async (e: React.MouseEvent, courseId: number) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/courses/${courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Course successfully deleted")
      } else {
        throw new Error("Failed to delete course");
      }

      if (onDeleteCourse) {
        onDeleteCourse(courseId);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete the course.");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card
          key={course.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate(`/course/${course.id}`)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <CardDescription className="mt-2">
                  {course.description}
                </CardDescription>
              </div>
              {isAdmin && (
                <div
                  className="flex gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={(e) => handleDelete(e, course.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Instructor:
              {" " +
                course.professor.name +
                " " +
                course.professor.surname +
                " "}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{course.students_count} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>{course.files?.length} files</span>
                </div>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
