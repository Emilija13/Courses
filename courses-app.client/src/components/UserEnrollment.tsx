import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Users } from "lucide-react";
import type { Course, Student } from "@/types";

interface UserEnrollmentProps {
  courses: Course[];
  students: Student[];
}

export default function UserEnrollment({
  courses,
  students,
}: UserEnrollmentProps) {
  const token = localStorage.getItem("token");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [enrolledStudents, setEnrolledStudents] = useState<{
    [key: number]: Student[];
  }>({});

  const fetchAllEnrolled = async () => {
    const promises = courses.map((course) =>
      fetch(`http://localhost:8000/api/courses/${course.id}/students`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => ({ courseId: course.id, students: data }))
        .catch((err) => {
          console.error(`Failed to fetch for course ${course.id}`, err);
          return { courseId: course.id, students: [] };
        })
    );

    const results = await Promise.all(promises);

    const newEnrolled: { [key: number]: Student[] } = {};
    results.forEach(({ courseId, students }) => {
      newEnrolled[courseId] = students;
    });

    setEnrolledStudents(newEnrolled);
    setLoading(false);
  };

  const handleEnrollment = async () => {
    if (!selectedCourse || !selectedStudent) return;

    const courseId = Number.parseInt(selectedCourse);
    const studentId = Number.parseInt(selectedStudent);

    try {
      const response = await fetch(
        `http://localhost:8000/api/courses/${courseId}/add-student`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ student_id: studentId }),
        }
      );

      if (response.ok) {
        //const data = await response.json();
        setSelectedStudent("");
        setSelectedCourse("");
        alert("Student successfully enrolled!");
        fetchAllEnrolled();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to enroll student.");
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert("An error occurred while enrolling the student.");
    }
  };

  useEffect(() => {
    fetchAllEnrolled();
  }, [courses]);
  console.log(enrolledStudents);

  if (loading) return <div>Loading..</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Enroll Student
          </CardTitle>
          <CardDescription>Add students to courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Course</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Student</label>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  {students?.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name+" "+student.surname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleEnrollment}
                disabled={!selectedCourse || !selectedStudent}
                className="w-full"
              >
                Enroll Student
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {courses.map((course) => {
          const enrolled = enrolledStudents[course.id] || [];
          return (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <Badge variant="secondary">
                    <Users className="w-4 h-4 mr-1" />
                    {enrolled.length} enrolled
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {enrolled.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Enrolled Students:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {enrolled.map((student) => (
                        <div
                          key={student?.id}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-green-600">
                              {student?.name.charAt(0)+student.surname.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {student?.name+" "+student.surname}
                            </p>
                            <p className="text-xs text-gray-500">
                              {student?.index}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No students enrolled yet
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
